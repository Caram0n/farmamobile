import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { FirebaseDbService } from '../../services/firebase-db.service';
import { Caja } from '../../models/interface';
import { ModalDetalleCajaPage } from '../../modales/modal-detalle-caja/modal-detalle-caja.page';


@Component({
  selector: 'app-cajas',
  templateUrl: './cajas.page.html',
  styleUrls: ['./cajas.page.scss'],
})
export class CajasPage implements OnInit {

  cajas: Caja[] = [];

  constructor(
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public dbFirebase: FirebaseDbService,
    public toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.getCajas();
  }

  getCajas(){
    const enlace = 'Cajas';
    this.dbFirebase.getCollectionSort<Caja>(enlace, 'id', 'desc').subscribe(res => {
      this.cajas = res;
      console.log(this.cajas)
    })
  }

  muestraDetalle(item, i) {
    this.modalCtrl.create({
      component: ModalDetalleCajaPage,
      componentProps: { caja: item, ind: i }
    }).then((modal) => {
      modal.onDidDismiss().then(() => {
        
      });
      modal.present();
    })
  }

}
