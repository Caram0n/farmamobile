import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, ModalController } from '@ionic/angular';
import { FirebaseDbService } from '../../services/firebase-db.service';
import { Proveedor } from '../../models/interface';

@Component({
  selector: 'app-modal-nuevo-proveedor',
  templateUrl: './modal-nuevo-proveedor.page.html',
  styleUrls: ['./modal-nuevo-proveedor.page.scss'],
})
export class ModalNuevoProveedorPage implements OnInit {

  loading: any;

  constructor(
    private modalCtrl: ModalController,
    public dbFirebase: FirebaseDbService,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
  ) { }

  ngOnInit() {
  }

  newProveedor: Proveedor = {
    cif: '',
    nombre: '',
    direccion: '',
    telefono: '',
    correo: ''
  }

  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  async save() {
    const data = this.newProveedor;
    this.presentLoading();
    const enlace = 'Proveedores';
    await this.dbFirebase.createDocument(data, enlace, data.cif).catch(res => {

    });
    this.presentToast('El item se guardó con éxito', 2000);
    this.loading.dismiss();
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'guardando'
    });
    await this.loading.present();

    this.newProveedor = {
      cif: '',
      nombre: '',
      direccion: '',
      telefono: '',
      correo: ''
    };
  }

  async presentToast(mensaje: string, tiempo: number) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: tiempo
    });
    toast.present();
  }

}
