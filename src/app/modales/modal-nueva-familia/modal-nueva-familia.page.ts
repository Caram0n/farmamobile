import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, LoadingController } from '@ionic/angular';
import { FirebaseDbService } from '../../services/firebase-db.service';
import { Familia } from '../../models/interface';

@Component({
  selector: 'app-modal-nueva-familia',
  templateUrl: './modal-nueva-familia.page.html',
  styleUrls: ['./modal-nueva-familia.page.scss'],
})
export class ModalNuevaFamiliaPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    public dbFirebase: FirebaseDbService,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
  }

  newFamilia: Familia = {
    codigo: '',
    descripcion: '',
    impuesto: null
  }

  loading: any;

  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  async save(){
    this.presentLoading();
    console.log('ESTO VAMOS A GUARDAR  ', this.newFamilia);

    const data = this.newFamilia;
    const enlace = 'Familias';
    data.codigo = this.dbFirebase.createId();
    await this.dbFirebase.createDocument(data, enlace, data.codigo).catch( res => {
      console.log('el error es ->', res);
    });
    this.presentToast('La familia se ha guardado con éxito', 2000);
    this.loading.dismiss();


    this.newFamilia = {
      codigo: '',
      descripcion: '',
      impuesto: null
    }
  }

  async presentLoading(){
    this.loading = await this.loadingCtrl.create({
      message: 'guardando'
    });
    await this.loading.present();
  }
  async presentToast(mensaje: string, tiempo: number){
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: tiempo
    });
    toast.present();
  }

}
