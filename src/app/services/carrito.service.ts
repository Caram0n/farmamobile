import { Injectable } from '@angular/core';
import { Venta, ProductoVenta, Producto, Usuario } from '../models/interface';
import { AuthService } from './auth.service';
import { FirebaseDbService } from './firebase-db.service';
import { Router } from '@angular/router';
import { Subject, Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private venta: Venta;
  venta$ = new Subject<Venta>();
  uid = '';
  usuario;

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
      }
    });
     this.loadUser();
  }

  loadUser() {
    const path = 'Usuarios';
    this.usuarioSubscriber = this.dbFirebase.getCollectionQuery(path,'uid','==', this.uid).subscribe(res => {
      console.log('loadUser() ->', res);
      this.usuario = res;
      this.loadCarrito();
      this.usuarioSubscriber.unsubscribe();
    });
  }

  loadCarrito() {
    const enlace = 'Usuarios/' + this.uid + '/carrito';
    console.log(enlace);

    if (this.carritoSubscriber) {
      this.carritoSubscriber.unsubscribe();
    }
    this.carritoSubscriber = this.dbFirebase.getDocument<Venta>(enlace, this.uid).subscribe(res => {
      console.log(res);
      if (res) {
        this.venta = res;
        this.venta$.next(this.venta);
      } else {
        this.initCarrito();
      }
    });
  }

  initCarrito() {
    this.venta = {
      id: this.uid,
      productos: [],
      precioTotal: null,
      fecha: new Date()
    };
    this.venta$.next(this.venta);
  }


  getCarrito(): Observable<Venta> {
    setTimeout(() => {
      this.venta$.next(this.venta);
    }, 100);
    return this.venta$.asObservable();
  }

  addProducto(productoInput: Producto) {

    const enlace = 'Usuarios/' + this.uid + '/carrito';

    if (this.uid.length) {
      const item = this.venta.productos.find(productoVenta => {
        return (productoVenta.producto.codigo === productoInput.codigo)
      });
      if (item !== undefined) {
        item.cantidad++;
      } else {
        const add: ProductoVenta = {
          cantidad: 1,
          producto: productoInput
        }
        this.venta.productos.push(add);
      }
    } else {
      this.router.navigate(['/login']);
      return;
    }
    this.venta$.next(this.venta);
    console.log(this.venta);

    this.dbFirebase.createDocument(this.venta, enlace, this.uid).then(() => {
      console.log('guardado con éxito')
    });

  }

  removeProducto(producto: Producto) {
    const enlace = 'Usuarios/' + this.uid + '/carrito';
    if (this.uid.length) {
      let position = 0;
      const item = this.venta.productos.find((productoVenta, index) => {
        position = index;
        return (productoVenta.producto.codigo === producto.codigo)
      });
      if (item !== undefined) {
        item.cantidad--;

        if (item.cantidad === 0) {
          this.venta.productos.splice(position, 1);
        }


        console.log(this.venta);

        this.dbFirebase.createDocument(this.venta, enlace, this.uid).then(() => {
          console.log('Eliminado con éxito')
        });
      }
    }
  }



  clearCarrito() {
    const enlace = 'Usuarios/' + this.uid + '/carrito';
    
    this.dbFirebase.deleteDocument(enlace, this.uid).then(() => {
      this.initCarrito();
    });
  }

}
