import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/interface';
import { ModalController, AlertController } from '@ionic/angular';
import { LogService } from '../../services/log.service';
import { Subscription } from 'rxjs';
import { FirebaseDbService } from '../../services/firebase-db.service';

@Component({
  selector: 'app-modal-registro',
  templateUrl: './modal-registro.page.html',
  styleUrls: ['./modal-registro.page.scss'],
})
export class ModalRegistroPage implements OnInit {

  uid = '';
  usuarioSubscriber: Subscription;
  usuario;

  user: Usuario = {
    uid: '',
    nombre: '',
    email: '',
    movil: '',
    dni: '',
    password: '',
    rol: 'Técnico'
  }

  constructor(
    public auth: AuthService,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public logService: LogService,
    public dbFirebase: FirebaseDbService
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
  }

  cerrarModal() {
    this.modalCtrl.dismiss();
  }
  loadUser() {
    const path = 'Usuarios';
    this.usuarioSubscriber = this.dbFirebase.getDocument(path, this.uid).subscribe(res => {
      console.log('loadUser() ->', res);
      this.usuario = res;
      this.usuarioSubscriber.unsubscribe();

    });
  }


  async signin() {
    this.auth.registerUser(this.user.email, this.user.password)
      .then((user) => {
        // El usuario se ha creado correctamente
        // this.user.email = '';
        // this.user.password = '';
        const accion: string = 'Ha registrado al usuario ' + this.user.email;
        this.logService.addLog(this.user.nombre, accion);

        this.alertCtrl.create({
          header: 'Nuevo usuario',
          subHeader: 'El usuario se ha creado correctamente',
          buttons: ['Aceptar']
        }).then(alert => {
          alert.present();
        });
      })
      .catch(err => {
        this.alertCtrl.create({
          header: 'Error',
          subHeader: err.message,
          buttons: ['Aceptar']
        }).then(alert => {
          alert.present();
        });
        this.logService.addError(err);
      });

    this.cerrarModal();

  }

}
