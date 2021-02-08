import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-detalle-proveedor',
  templateUrl: './modal-detalle-proveedor.page.html',
  styleUrls: ['./modal-detalle-proveedor.page.scss'],
})
export class ModalDetalleProveedorPage implements OnInit {

  proveedor: any;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    console.log(this.proveedor);
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }

}
