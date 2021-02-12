import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { FirebaseDbService } from '../../services/firebase-db.service';
import { Venta } from '../../models/interface';
import { ModalDetalleHistoricoPage } from '../../modales/modal-detalle-historico/modal-detalle-historico.page';

@Component({
  selector: 'app-historico-ventas',
  templateUrl: './historico-ventas.page.html',
  styleUrls: ['./historico-ventas.page.scss'],
})
export class HistoricoVentasPage implements OnInit {

 ventas: Venta[] = [];


  constructor(
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public dbFirebase: FirebaseDbService,
    public toastCtrl: ToastController,
  ) { }

  ngOnInit() {
    this.getVentas();
  }


  getVentas(){
    const enlace = 'Pedidos';
    this.dbFirebase.getCollectionSort<Venta>(enlace, 'fecha', 'desc').subscribe(res => {
      this.ventas = res;
    });
  }

 

  muestraDetalle(item, i) {
    this.modalCtrl.create({
      component: ModalDetalleHistoricoPage,
      componentProps: { venta: item, ind: i}
    }).then((modal) => {
      modal.onDidDismiss().then(() =>{
        this.getVentas();
      });
      modal.present();
    })
  }

  

}
