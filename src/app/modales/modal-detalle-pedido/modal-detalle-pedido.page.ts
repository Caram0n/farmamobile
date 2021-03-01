import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseDbService } from '../../services/firebase-db.service';

@Component({
  selector: 'app-modal-detalle-pedido',
  templateUrl: './modal-detalle-pedido.page.html',
  styleUrls: ['./modal-detalle-pedido.page.scss'],
})
export class ModalDetallePedidoPage implements OnInit {

  pedido: any;

  constructor(
    private modalCtrl: ModalController,
    public dbFirebase: FirebaseDbService
  ) { }

  ngOnInit() {
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }

}
