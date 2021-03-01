import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { FirebaseDbService } from '../../services/firebase-db.service';
import { Venta, Caja, Log } from '../../models/interface';
import { CarritoService } from '../../services/carrito.service';
import { Subscription } from 'rxjs';
import { CajaService } from '../../services/caja.service';
import { AuthService } from '../../services/auth.service';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.page.html',
  styleUrls: ['./venta.page.scss'],
})
export class VentaPage implements OnInit, OnDestroy {

  uid = '';
  usuario;
  usuarioSubscriber: Subscription;


  venta: Venta;
  vendido: Venta;
  caja: Caja;
  fechaCaja: string = '';

  carritoSubscriber: Subscription;
  cantidad: number;
  total: number;

  constructor(
    public modalCtrl: ModalController,
    public dbFirebase: FirebaseDbService,
    public carritoService: CarritoService,
    public toastCtrl: ToastController,
    public cajaService: CajaService,
    public auth: AuthService,
    public logService: LogService
  ) {
    this.initCarrito();
    this.initVenta();
    this.loadPedido();
    this.auth.stateAuth().subscribe(res => {
      console.log(res);
      if (res !== null) {
        this.uid = res.uid;
        this.loadUser();
      }
    });

  }

  ngOnInit() {
    this.getFechaCaja();
    console.log('fecha ->', this.fechaCaja)
  }

  loadUser() {
    const path = 'Usuarios';
    this.usuarioSubscriber = this.dbFirebase.getDocument(path, this.uid).subscribe(res => {
      console.log('loadUser() ->', res);
      this.usuario = res;
      this.usuarioSubscriber.unsubscribe();
    });
  }

  ngOnDestroy() {
    if (this.carritoSubscriber) {
      this.carritoSubscriber.unsubscribe();
    }

  }

  loadPedido() {
    this.carritoSubscriber = this.carritoService.getCarrito().subscribe(res => {
      this.venta = res;
      this.getTotal();
      this.getCantidad();
    });
  }

  initVenta() {
    this.vendido = {
      id: '',
      productos: [],
      precioTotal: null,
      fecha: new Date()
    }
  }



  initCarrito() {
    this.venta = {
      id: '',
      productos: [],
      precioTotal: null,
      fecha: new Date(),
    }

  }


  getTotal() {
    this.total = 0;
    this.venta.productos.forEach(producto => {
      this.total = (producto.producto.pvp * producto.cantidad) + this.total;
      console.log(producto.producto);
    });
  }

  getCantidad() {
    this.cantidad = 0;
    this.venta.productos.forEach(producto => {
      this.cantidad = producto.cantidad + this.cantidad;
    });

  }

  async vender() {


    if (!this.venta.productos.length) {
      //console.log("Añada productos al carrito");
      this.presentToast('Añada productos al carrito', 2000);
      return;
    }
    //Crear venta
    this.vendido = this.venta;
    this.vendido.fecha = new Date();
    this.vendido.precioTotal = this.total;
    this.vendido.id = this.dbFirebase.createId();
    this.vendido.productos.forEach(producto => {
      let prodStock = 0;
      prodStock = producto.producto.stock - producto.cantidad
      if (prodStock <= 0) {
        //console.log("No hay suficiente stock de ", producto.producto.descripcion);
        this.presentToast("No hay suficiente stock de " + producto.producto.descripcion, 2000);
        return;
      }
      else {
        this.dbFirebase.createDocument(this.vendido, 'Ventas', this.vendido.id).then(() => {
          this.vendido.productos.forEach(producto => {
            this.dbFirebase.updateDocument(producto.producto, 'Items', producto.producto.codigo)
            this.cajaService.addVenta(this.vendido);
          });


          this.presentToast('La venta se ha realizado con éxito', 2000);
          this.carritoService.clearCarrito();
          this.initCarrito();
          const accion: string = 'Ha cerrado la venta' ;
          this.logService.addLog(this.usuario.nombre, accion);




        }, (err) => {
          console.log("Se ha producido un error", err);
          this.presentToast("Se ha producido un error" + err, 3000);
          this.logService.addError(err);
        });
      }
    });


  }



  async presentToast(mensaje: string, tiempo: number) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: tiempo
    });
    toast.present();
  }

  getFechaCaja() {
    const fecha = new Date().toISOString();
    this.fechaCaja = fecha.substr(0, 10);
  }

}
