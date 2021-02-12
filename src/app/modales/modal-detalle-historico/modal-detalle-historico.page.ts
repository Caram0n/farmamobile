import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, ModalController } from '@ionic/angular';
import { FirebaseDbService } from '../../services/firebase-db.service';
import {  Producto } from '../../models/interface';

@Component({
  selector: 'app-modal-detalle-historico',
  templateUrl: './modal-detalle-historico.page.html',
  styleUrls: ['./modal-detalle-historico.page.scss'],
})
export class ModalDetalleHistoricoPage implements OnInit {
  
  venta: any;
  productos: Producto[] = [];

  constructor(
    private modalCtrl: ModalController,
    public dbFirebase: FirebaseDbService,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.getProductos();
    console.log(this.venta)
  }

  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  getProductos() {
    this.productos = this.venta.productos;
    console.log(this.productos);
    }
  

}
