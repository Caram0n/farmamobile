import { Injectable } from '@angular/core';
import { PedidoProveedores, Usuario, Producto, ProductoProveedor } from '../models/interface';
import { Subject, Subscription, Observable } from 'rxjs';
import { FirebaseDbService } from './firebase-db.service';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx'

@Injectable({
  providedIn: 'root'
})
export class PedidoProveedorService {

  private pedidoP: PedidoProveedores;
  pedidoP$ = new Subject<PedidoProveedores>();
  path = 'pedidoEnCurso';
  id = 'pedidoEnCurso'
  uid = '';
  usuario;

  usuarioSubscriber: Subscription;
  pedidoProveedorSubscriber: Subscription;


  constructor(
    public auth: AuthService,
    public dbFirebase: FirebaseDbService,
    public router: Router,
    public file: File,
    public emailComposer: EmailComposer
  ) {
    this.initPedido();
    this.auth.stateAuth().subscribe(res => {
      console.log(res);
      if (res !== null) {
        this.uid = res.uid;
        this.loadUser();
        this.loadPedido();
      }
    });
    

  }

  loadUser() {
    const path = 'Usuarios';
    this.usuarioSubscriber = this.dbFirebase.getDocument(path, this.uid).subscribe(res => {
      console.log('loadUser() ->', res);
      this.usuario = res;

      this.usuarioSubscriber.unsubscribe();
    });
  }


  loadPedido() {
    if (this.pedidoProveedorSubscriber) {
      this.pedidoProveedorSubscriber.unsubscribe();
    }
    this.pedidoProveedorSubscriber = this.dbFirebase.getDocument<PedidoProveedores>(this.path, this.id).subscribe(res => {
      //console.log(res);
      if (res) {
        this.pedidoP = res;
        console.log('pedido', this.pedidoP);
        this.pedidoP$.next(this.pedidoP);
       } //else {
      //   this.initPedido();
      // }
    });

  }


  initPedido() {
    this.pedidoP = {
      id: this.id,
      productosP: [],
      precioTotal: null,
      fecha: new Date()
    }
  }

  getPedido(): Observable<PedidoProveedores> {
    setTimeout(() => {
      this.pedidoP$.next(this.pedidoP);
    }, 100);
    return this.pedidoP$.asObservable();

  }


  addProductoPedido(productoInput: Producto) {
    const item = this.pedidoP.productosP.find(productoP => {
      return (productoP.producto.codigo === productoInput.codigo)

    });
    console.log('producto ->', productoInput)
    console.log('item ->', item);
    if (item !== undefined) {
      item.cantidad++;
    } else {
      const add: ProductoProveedor = {
        cantidad: 1,
        producto: productoInput
      }
      this.pedidoP.productosP.push(add);
    }
    this.pedidoP$.next(this.pedidoP);
    console.log(this.pedidoP);

    this.dbFirebase.createDocument(this.pedidoP, this.path, this.id).then(() => {
      console.log('Guardado con éxito')
    });
  }

  removeProductoPedido(producto: Producto) {
    let position = 0;
    const item = this.pedidoP.productosP.find((productoP, index) => {
      position = index;
      return (productoP.producto.codigo === producto.codigo)
    });
    console.log('producto ->', producto)
    console.log('item ->', item);
    if (item !== undefined) {
      item.cantidad--;
      if (item.cantidad === 0) {
        this.pedidoP.productosP.splice(position, 1);
      }

      console.log(this.pedidoP);

      this.dbFirebase.createDocument(this.pedidoP, this.path, this.id).then(() => {
        console.log('Eliminado con éxito');
      });
    }
  }


  clearPedido() {
    this.dbFirebase.deleteDocument(this.path, this.uid).then(() => {
      this.initPedido();
    });
  }


}
