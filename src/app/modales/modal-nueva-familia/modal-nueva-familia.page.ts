import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, LoadingController } from '@ionic/angular';
import { FirebaseDbService } from '../../services/firebase-db.service';
import { Familia, Log } from '../../models/interface';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-modal-nueva-familia',
  templateUrl: './modal-nueva-familia.page.html',
  styleUrls: ['./modal-nueva-familia.page.scss'],
})
export class ModalNuevaFamiliaPage implements OnInit {

  uid = '';
  usuario;
  usuarioSubscriber: Subscription;
  

  constructor(
    private modalCtrl: ModalController,
    public dbFirebase: FirebaseDbService,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public auth: AuthService,
    public logService: LogService
  ) {
    // método que recoge en una variable el uid
    this.auth.stateAuth().subscribe(res => {
      console.log(res);
      if (res !== null) {
        this.uid = res.uid;
        this.loadUser();
      }
    });
    
  }

  ngOnInit() {
  }
// método que busca el usuario logueado mediante el uid
  loadUser() {
    const path = 'Usuarios';
    this.usuarioSubscriber = this.dbFirebase.getDocument(path, this.uid).subscribe(res => {
      console.log('loadUser() ->', res);
      this.usuario = res;
      console.log('usuario ->', this.usuario)
      this.usuarioSubscriber.unsubscribe();
    });
  }

  newFamilia: Familia = {
    codigo: '',
    descripcion: '',
    impuesto: null,
    ganancia: null
  }

  loading: any;

  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  // método que guarda la familia nueva en la base de datos
  async save() {
    this.presentLoading();
    console.log('ESTO VAMOS A GUARDAR  ', this.newFamilia);

    const data = this.newFamilia;
    const enlace = 'Familias';
    data.codigo = this.dbFirebase.createId();
    await this.dbFirebase.createDocument(data, enlace, data.codigo).then((res) => {
      
      //tras guardar la familia se registra en el log el evento
      const accion: string = 'Ha modificado el usuario '+ data.descripcion;
      this.logService.addLog(this.usuario.nombre, accion);

    }, (err) => {
      console.log("Se ha producido un error", err);
      this.presentToast("Se ha producido un error" + err, 3000);
      this.logService.addError(err);
    });
    
    this.presentToast('La familia se ha guardado con éxito', 2000);
    this.loading.dismiss();


    this.newFamilia = {
      codigo: '',
      descripcion: '',
      impuesto: null,
      ganancia: null
    }
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
