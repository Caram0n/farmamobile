import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Usuario } from 'src/app/models/interface';
import { AuthService } from '../../services/auth.service';
import { FirebaseDbService } from '../../services/firebase-db.service';
import { ModalNuevoUsuarioPage } from '../../modales/modal-nuevo-usuario/modal-nuevo-usuario.page';

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
    rol: 'Técnico'
  }
  


  constructor(
    public alertCtrl: AlertController,
    public auth: AuthService,
    private router: Router,
    public dbFirebase: FirebaseDbService,
    public modalCtrl: ModalController
    ) {
      this.auth.stateAuth().subscribe(res => {
        console.log(res);
        if (res !== null) {
          this.uid = res.uid;
        }
      });
    }


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
      rol: 'Técnico'
    }
  }

  //método para logear, si el usuario existe en la base de datos irá a la página listado, si no
  //lo enviará a un modal para que rellene sus datos y se guarde en la base de datos el usuario con toda su información
  login(){
    this.auth.loginUser(this.user.email, this.user.password).then( result => {
      // El usuario se ha logueado correctamente
      this.auth.stateAuth().subscribe(res => {
        console.log(res);
        if (res !== null) {
          this.uid = res.uid;
        }
      });
      this.dbFirebase.getDocument('Usuarios',this.uid).subscribe( res => {
        console.log(res);
        if(res===undefined){
          this.modalCtrl.create({
            component: ModalNuevoUsuarioPage,
            componentProps:{user: this.user}
          }).then((modal) => {
            modal.onDidDismiss().then(() => {
              this.router.navigate(['/listado']);
            });
            modal.present();
          })
        }else{
          this.router.navigate(['/listado']);  
        }
      });      
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




}
