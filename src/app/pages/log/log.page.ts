import { Component, OnInit } from '@angular/core';
import { FirebaseDbService } from '../../services/firebase-db.service';
import { Log } from '../../models/interface';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-log',
  templateUrl: './log.page.html',
  styleUrls: ['./log.page.scss'],
})
export class LogPage implements OnInit {

  uid = '';
  usuario;
  usuarioSubscriber: Subscription;
  admin: boolean = false;
  farma: boolean = false;
  tecnico: boolean = false;

  logs: Log[] = [];

  constructor(
    public dbFirebase: FirebaseDbService,
    public auth: AuthService,
    public alertCtrl: AlertController
  ) {
    this.auth.stateAuth().subscribe(res => {
      console.log(res);
      if (res !== null) {
        this.uid = res.uid;
        console.log(res.uid);
        this.loadUser();
      }
    });
  }

  ngOnInit() {
    this.getLog();
  }

  loadUser() {
    const path = 'Usuarios';
    this.usuarioSubscriber = this.dbFirebase.getDocument(path, this.uid).subscribe(res => {
      console.log('loadUser() ->', res);
      this.usuario = res;
      this.usuarioSubscriber.unsubscribe();

      if (this.usuario.rol === 'Administrador') {
        this.admin = true;
      }
      if (this.usuario.rol === 'Farmaceutico') {
        this.farma = true;
      }
      if (this.usuario.rol === 'Tecnico') {
        this.tecnico = true;
      }
    });
  }


  getLog() {

    if (this.tecnico === true) {
      this.alertCtrl.create({
        header: 'LOG',
        subHeader: 'No tiene permisos para poder ver el Log',
        buttons: ['Aceptar']
      }).then(alert => {
        alert.present();
      });

    } else {
      const enlace = 'Log';
      this.dbFirebase.getCollectionSort<Log>(enlace, 'fecha', 'desc').subscribe(res => {
        this.logs = res;
        console.log(res);
      })
    }
  }

}
