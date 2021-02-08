import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, LoadingController } from '@ionic/angular';
import { FirebaseDbService } from '../../services/firebase-db.service';

@Component({
  selector: 'app-modal-detalle-usuario',
  templateUrl: './modal-detalle-usuario.page.html',
  styleUrls: ['./modal-detalle-usuario.page.scss'],
})
export class ModalDetalleUsuarioPage implements OnInit {

  usuario: any;
  edit = false;
  loading: any;

  constructor(
    private modalCtrl: ModalController,
    public dbFirebase: FirebaseDbService,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    console.log(this.usuario);
  }

  editar() {
    this.edit = true;
  }

  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'guardando'
    });
    await this.loading.present();
  }
  async presentToast(mensaje: string, tiempo: number) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: tiempo
    });
    toast.present();
  }


  
  guardarItem() {
    const path = 'Usuarios';
    const data = this.usuario;
    console.log(path);
    console.log(data);
    this.dbFirebase.updateDocument(data, path, data.uid).then((res) => {
      this.edit = false;
      console.log("Se ha modificado correctamente en la base de datos");
    }, (err) => {
      console.log("Se ha producido un error", err);
    });
    this.modalCtrl.dismiss();
  }

}
