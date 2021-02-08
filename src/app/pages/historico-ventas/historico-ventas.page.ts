import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { FirebaseDbService } from '../../services/firebase-db.service';
import { Pedido, Caja } from '../../models/interface';
import { ModalDetalleHistoricoPage } from '../../modales/modal-detalle-historico/modal-detalle-historico.page';

@Component({
  selector: 'app-historico-ventas',
  templateUrl: './historico-ventas.page.html',
  styleUrls: ['./historico-ventas.page.scss'],
})
export class HistoricoVentasPage implements OnInit {

 pedidos: Pedido[] = [];
 pedidosCaja: Pedido[] = [];


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
    this.dbFirebase.getCollection<Pedido>(enlace).subscribe(res => {
      this.pedidos = res;
    });
  }

 

  muestraDetalle(item, i) {
    this.modalCtrl.create({
      component: ModalDetalleHistoricoPage,
      componentProps: { pedido: item, ind: i}
    }).then((modal) => {
      modal.onDidDismiss().then(() =>{
        this.getVentas();
      });
      modal.present();
    })
  }

  

}
