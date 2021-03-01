import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { FirebaseDbService } from '../../services/firebase-db.service';
import { Usuario, Log } from '../../models/interface';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-modal-nuevo-usuario',
  templateUrl: './modal-nuevo-usuario.page.html',
  styleUrls: ['./modal-nuevo-usuario.page.scss'],
})
export class ModalNuevoUsuarioPage implements OnInit {

  id = '';
  usuario;
  usuarioSubscriber: Subscription;



  loading: any;
  user: Usuario;

  uid = '';

  constructor(
    private modalCtrl: ModalController,
    public dbFirebase: FirebaseDbService,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public auth: AuthService,
    public alertCtrl: AlertController,
    private router: Router,
    public logService: LogService
  ) {
    this.auth.stateAuth().subscribe(res => {
      console.log(res);
      if (res !== null) {
        this.uid = res.uid;
        this.loadUser();
      }
    });
  }

  ngOnInit() {
    console.log(this.user);
  }

  loadUser() {
    const path = 'Usuarios';
    this.usuarioSubscriber = this.dbFirebase.getDocument(path, this.uid).subscribe(res => {
      console.log('loadUser() ->', res);
      this.usuario = res;
      this.usuarioSubscriber.unsubscribe();

    });
  }



  cerrarModal() {
    this.modalCtrl.dismiss();
  }



  async guardaUser() {
    //this.presentLoading();
    const path = 'Usuarios';
    this.user.uid = this.uid
    //const data = user

    //console.log(data);

    this.dbFirebase.createDocument(this.user, path, this.user.uid).then(res => {
      console.log('guardado con éxito')
      this.auth.stateAuth().subscribe(res => {
        console.log(res);
        if (res !== null) {
          this.uid = res.uid;
          this.loadUser();
        }
      });

      const accion: string = 'Ha guardado los datos de usuario' + this.user.nombre;
      this.logService.addLog(this.user.nombre, accion);

    }).catch(error => {
      console.log(error);
      this.presentToast("Se ha producido un error" + error, 3000);
      this.logService.addError(error);
    });
    this.presentToast('Los datos se han guardado correctamente', 2000);
    //this.loading.dismiss();
    this.router.navigate(['/listado']);



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
