import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, LoadingController } from '@ionic/angular';
import { FirebaseDbService } from '../../services/firebase-db.service';
import { Familia } from 'src/app/models/interface';


@Component({
  selector: 'app-modal-detalle-familia',
  templateUrl: './modal-detalle-familia.page.html',
  styleUrls: ['./modal-detalle-familia.page.scss'],
})
export class ModalDetalleFamiliaPage implements OnInit {

  familia: any;
  edit = false;
  loading: any;

  constructor(
    private modalCtrl: ModalController,
    public dbFirebase: FirebaseDbService,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    console.log(this.familia)
  }

  newFamilia: Familia = {
    codigo: '',
    descripcion: '',
    impuesto: null
  }

  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  editar() {
    this.edit = true;
  }


  guardarItem() {
    const path = 'Familias';
    const data = this.familia;
    console.log(path);
    console.log(data);
    this.dbFirebase.updateDocument(data, path, data.codigo).then((res) => {
      this.edit = false;
      console.log("Se ha modificado correctamente en la base de datos");
    }, (err) => {
      console.log("Se ha producido un error", err);
    });
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



}
