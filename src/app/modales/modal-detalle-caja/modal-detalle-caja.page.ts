import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-detalle-caja',
  templateUrl: './modal-detalle-caja.page.html',
  styleUrls: ['./modal-detalle-caja.page.scss'],
})
export class ModalDetalleCajaPage implements OnInit {

  caja: any;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    console.log(this.caja);
  }

  cerrarModal() {
    this.modalCtrl.dismiss();
  }

}
