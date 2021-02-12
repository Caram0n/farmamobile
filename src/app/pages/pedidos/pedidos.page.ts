import { Component, OnInit, OnDestroy } from '@angular/core';
import { PedidoProveedores } from '../../models/interface';
import { ModalController, ToastController } from '@ionic/angular';
import { FirebaseDbService } from '../../services/firebase-db.service';
import { Subscription } from 'rxjs';
import { PedidoProveedorService } from '../../services/pedido-proveedor.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})
export class PedidosPage implements OnInit, OnDestroy {

  pedidoP: PedidoProveedores;
  cantidad: number;
  total: number;

  pedidoPSubscriber: Subscription;

  constructor(
    public modalCtrl: ModalController,
    public dbFirebase: FirebaseDbService,
    public pedidoProveedorService: PedidoProveedorService,
    public toastCtrl: ToastController,
  ) { 
    this.initPedidoP();
    this.loadPedidoP();
  }

  ngOnInit() {
  }

  ngOnDestroy(){
    if(this.pedidoPSubscriber){
      this.pedidoPSubscriber.unsubscribe();
    }
  }


  getTotal(){
    this.total = 0;
    this.pedidoP.productosP.forEach(producto => {
      this.total =(producto.producto.precio_Alb * producto.cantidad)+ this.total;
      console.log(producto.producto)
    });
  }

  getCantidad(){
    this.cantidad = 0;
    this.pedidoP.productosP.forEach(producto => {
      this.cantidad = producto.cantidad + this.cantidad;
    });
  }

  initPedidoP(){
    this.pedidoP = {
      id:'',
      productosP: [],
      precioTotal: null,
      fecha: new Date()
    }
  }

  loadPedidoP(){
    this.pedidoPSubscriber = this.pedidoProveedorService.getPedido().subscribe(res => {
      this.pedidoP = res;
      this.getTotal();
      this.getCantidad();
    })
  }

  lanzarPedido(){
    if(!this.pedidoP.productosP.length){
      this.presentToast('Añada productos al carrito', 2000);
    }

    this.pedidoP.fecha = new Date();
    this.pedidoP.precioTotal = this.total;
    this.pedidoP.id = this.dbFirebase.createId();

    this.pedidoP.productosP.forEach(producto => {
      const path = 'PedidosProveedores';
      this.dbFirebase.createDocument(this.pedidoP, path, this.pedidoP.id).then(() => {
        console.log(this.pedidoP);

        
      });
      
      this.pedidoProveedorService.clearPedido();
    });
  }


  async presentToast(mensaje: string, tiempo: number) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: tiempo
    });
    toast.present();
  }




}
