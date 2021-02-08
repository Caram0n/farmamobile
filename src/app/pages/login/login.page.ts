import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Usuario } from 'src/app/models/interface';
import { AuthService } from '../../services/auth.service';
import { FirebaseDbService } from '../../services/firebase-db.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  uid:string;

  user: Usuario = {
    uid: '',
    nombre: '',
    email: '',
    movil: '',
    dni: '',
    password: '',
    rol: ''
  }
  


  constructor(
    public alertCtrl: AlertController,
    public auth: AuthService,
    private router: Router,
    public dbFirebase: FirebaseDbService,
    ) {}


  ngOnInit() {    
  }

  initUser(){
    this.uid='';

    this.user = {
      uid: '',
      nombre: '',
      email: '',
      movil: '',
      dni: '',
      password: '',
      rol: ''
    }
  }

  async signin() {
    this.auth.registerUser(this.user.email, this.user.password)
    .then((user) => {
      // El usuario se ha creado correctamente
      this.user.email = '';
      this.user.password = '';
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
    });

    const uid = await this.auth.getUid();
    this.user.uid = uid;
    this.guardaUser(this.user);
    
  }

  login(){
    this.auth.loginUser(this.user.email, this.user.password).then( result => {
      // El usuario se ha logueado correctamente
      this.router.navigate(['/listado']);
    }).catch(err => {
      this.alertCtrl.create({
        header: 'Error',
        subHeader: err.message,
        buttons: ['Aceptar']
      }).then(alert => {
        alert.present();
      });
    });
  }

  async guardaUser(user: Usuario){
    const path = 'Usuarios';
    const name = this.user.nombre;

    this.dbFirebase.createDocument(user, path, this.user.uid).then( res => {
      console.log('guardado con éxito')
    }).catch( error => {
      console.log(error);
    });

  }

  getUserInfo(uid:string){
    const path ='Usuarios';
    this.dbFirebase.getDocument<Usuario>(path, uid).subscribe( res => {
      this.user = res;
    })
  }




}
