import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseDbService } from '../../services/firebase-db.service';

@Component({
  selector: 'app-modal-detalle-proveedor',
  templateUrl: './modal-detalle-proveedor.page.html',
  styleUrls: ['./modal-detalle-proveedor.page.scss'],
})
export class ModalDetalleProveedorPage implements OnInit {

  proveedor: any;
  edit = false;

  constructor(
    private modalCtrl: ModalController,
    public dbFirebase: FirebaseDbService,
  ) { }

  ngOnInit() {
    console.log(this.proveedor);
  }

  cerrarModal() {
    this.modalCtrl.dismiss();
  }


  editar() {
    this.edit = true;
  }

  guardarProveedor() {
    const path = "Proveedores";
    const data = this.proveedor;

    this.dbFirebase.updateDocument(data, path, data.cif).then((res) => {
      this.edit = false;
    }, (err) => { console.log("Se ha producido un error", err);
    });
  }
  
}
