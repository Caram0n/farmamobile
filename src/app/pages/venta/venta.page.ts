import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { FirebaseDbService } from '../../services/firebase-db.service';
import { Pedido, Caja } from '../../models/interface';
import { CarritoService } from '../../services/carrito.service';
import { Subscription } from 'rxjs';
import { analyzeFileForInjectables } from '@angular/compiler';
import { CajaService } from '../../services/caja.service';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.page.html',
  styleUrls: ['./venta.page.scss'],
})
export class VentaPage implements OnInit, OnDestroy {

  pedido: Pedido;
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
    public cajaService: CajaService
  ) {
    this.initCarrito();
    this.loadPedido();
  }

  ngOnInit() {
    this.getFechaCaja();
    console.log('fecha ->', this.fechaCaja)


  }

  ngOnDestroy() {
    if (this.carritoSubscriber) {
      this.carritoSubscriber.unsubscribe();
    }

  }

  loadPedido() {
    this.carritoSubscriber = this.carritoService.getCarrito().subscribe(res => {
      this.pedido = res;
      this.getTotal();
      this.getCantidad();
    });
  }

 



  initCarrito() {
    this.pedido = {
      id: '',
      productos: [],
      precioTotal: null,
      fecha: new Date(),
    }
   
  }


  getTotal() {
    this.total = 0;
    this.pedido.productos.forEach(producto => {
      this.total = (producto.producto.pvp * producto.cantidad) + this.total;
      console.log(producto.producto);
    });
  }

  getCantidad() {
    this.cantidad = 0;
    this.pedido.productos.forEach(producto => {
      this.cantidad = producto.cantidad + this.cantidad;
    });

  }

  pedir() {
    if (!this.pedido.productos.length) {
      //console.log("Añada productos al carrito");
      this.presentToast('Añada productos al carrito', 2000);
      return;
    }
    //Crear venta
    this.pedido.fecha = new Date();
    this.pedido.precioTotal = this.total;
    this.pedido.id = this.dbFirebase.createId();
    this.pedido.productos.forEach(producto => {
      let prodStock = producto.producto.stock - producto.cantidad
      if (prodStock <= 0) {
        //console.log("No hay suficiente stock de ", producto.producto.descripcion);
        this.presentToast("No hay suficiente stock de " + producto.producto.descripcion, 2000);
        return;
      }
      else {
        const path = 'Pedidos';
        this.dbFirebase.createDocument(this.pedido, path, this.pedido.id).then(() => {
          this.pedido.productos.forEach(producto => {
            this.dbFirebase.updateDocument(producto.producto, 'Items', producto.producto.codigo)
            this.cajaService.addVenta(this.pedido);
          });


          this.presentToast('La venta se ha realizado con éxito', 2000);
          this.carritoService.clearCarrito();
          
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
