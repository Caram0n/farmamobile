import { Injectable } from '@angular/core';
import { Pedido, ProductoPedido, Producto, Usuario } from '../models/interface';
import { AuthService } from './auth.service';
import { FirebaseDbService } from './firebase-db.service';
import { Router } from '@angular/router';
import { Subject, Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private pedido: Pedido;
  pedido$ = new Subject<Pedido>();
  path = 'carrito';
  uid = '';
  usuario: Usuario;

  usuarioSubscriber: Subscription;
  carritoSubscriber: Subscription;

  constructor(
    public auth: AuthService,
    public dbFirebase: FirebaseDbService,
    public router: Router
  ) {
    this.initCarrito();
    this.auth.stateAuth().subscribe(res => {
      console.log(res);
      if (res !== null) {
        this.uid = res.uid;
        this.loadUser();
      }
    });

  }

  loadUser() {
    const path = 'Usuarios';
    this.usuarioSubscriber = this.dbFirebase.getDocument<Usuario>(path, this.uid).subscribe(res => {
      console.log('loadUser() ->', res);
      this.usuario = res;
      this.loadCarrito();
      this.usuarioSubscriber.unsubscribe();
    });
  }

  loadCarrito() {
    if (this.carritoSubscriber) {
      this.carritoSubscriber.unsubscribe();
    }
    this.carritoSubscriber = this.dbFirebase.getDocument<Pedido>(this.path, this.uid).subscribe(res => {
      console.log(res);
      if (res) {
        this.pedido = res;
        this.pedido$.next(this.pedido);
      } else {
        this.initCarrito();
      }
    });
  }

  initCarrito() {
    this.pedido = {
      id: this.uid,
      productos: [],
      precioTotal: null,
      fecha: new Date()
    };
    this.pedido$.next(this.pedido);
  }


  getCarrito(): Observable<Pedido> {
    setTimeout(() => {
      this.pedido$.next(this.pedido);
    }, 100);
    return this.pedido$.asObservable();
  }

  addProducto(productoInput: Producto) {
    if (this.uid.length) {
      const item = this.pedido.productos.find(productoPedido => {
        return (productoPedido.producto.codigo === productoInput.codigo)
      });
      if (item !== undefined) {
        item.cantidad++;
      } else {
        const add: ProductoPedido = {
          cantidad: 1,
          producto: productoInput
        }
        this.pedido.productos.push(add);
      }
    } else {
      this.router.navigate(['/login']);
      return;
    }
    this.pedido$.next(this.pedido);
    console.log(this.pedido);

    this.dbFirebase.createDocument(this.pedido, this.path, this.uid).then(() => {
      console.log('guardado con éxito')
    });

  }

  removeProducto(producto: Producto) {
    if (this.uid.length) {
      let position = 0;
      const item = this.pedido.productos.find((productoPedido, index) => {
        position = index;
        return (productoPedido.producto.codigo === producto.codigo)
      });
      if (item !== undefined) {
        item.cantidad--;

        if (item.cantidad === 0) {
          this.pedido.productos.splice(position, 1);
        }


        console.log(this.pedido);

        this.dbFirebase.createDocument(this.pedido, this.path, this.uid).then(() => {
          console.log('Eliminado con éxito')
        });
      }

    }

  }



  clearCarrito() {
    const path = 'carrito'
    this.dbFirebase.deleteDocument(path, this.uid).then(() => {
      this.initCarrito();
    });
  }

}
