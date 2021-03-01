import { Component, OnInit } from '@angular/core';
import { ToastController, AlertController, ModalController } from '@ionic/angular';
import { Usuario } from 'src/app/models/interface';
import { FirebaseDbService } from '../../services/firebase-db.service';
import { ModalDetalleUsuarioPage } from '../../modales/modal-detalle-usuario/modal-detalle-usuario.page';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { ModalRegistroPage } from '../../modales/modal-registro/modal-registro.page';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {

  uid = '';
  usuario;
  usuarioSubscriber: Subscription;
  admin: boolean = false;
  farma: boolean = false;
  tecnico: boolean = false;

  usuarios: Usuario[] = [];
  loading: any;
  textoBuscar: string = '';

  constructor(
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public dbFirebase: FirebaseDbService,
    public toastCtrl: ToastController,
    public auth: AuthService,
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
    this.getUsuarios();
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
      if (this.usuario.rol === 'Farmacéutico') {
        this.farma = true;
      }
      if (this.usuario.rol === 'Técnico') {
        this.tecnico = true;
      }
    });
  }


  getUsuarios() {
    const enlace = 'Usuarios';
    this.dbFirebase.getCollection<Usuario>(enlace).subscribe(res => {
      //console.log(res)
      this.usuarios = res;
    });
  }

  onSearchChange(event) {
    console.log(event);
    this.textoBuscar = event.detail.value;
  }

  async presentToast(mensaje: string, tiempo: number) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: tiempo
    });
    toast.present();
  }

  muestraDetalle(item, i) {

    if (this.admin === true) {

      this.modalCtrl.create({
        component: ModalDetalleUsuarioPage,
        componentProps: { usuario: item, ind: i }
      }).then((modal) => {
        modal.onDidDismiss().then(() => {
          this.getUsuarios();
        });
        modal.present();
      })
    }
    else {
      return;
    }
  }

  async deleteItem(usuario: Usuario, slidingItem) {

    const alert = await this.alertCtrl.create({
      header: 'Confirmar borrado',
      message: '¿Está seguro de que desea eliminar este producto?',
      buttons: [{
        text: 'No',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel');
        }
      }, {
        text: "Sí",
        handler: () => {
          this.dbFirebase.deleteDocument<Usuario>('Usuarios', usuario.uid).then(() => {
            this.presentToast('El usuario se eliminó con éxito', 2000)
            const accion: string = 'Ha modificado el usuario ' + usuario.nombre;
            this.logService.addLog(this.usuario.nombre, accion);
            
          }, (err) => {
            console.log("Se ha producido un error", err);
            this.presentToast("Se ha producido un error" + err, 3000);
            this.logService.addError(err);
          });
          console.log('hecho');
        }
      }]
    });
    await alert.present();
    slidingItem.close();
  }

  nuevoUsuario() {
    this.modalCtrl.create({
      component: ModalRegistroPage,
      componentProps: {}
    }).then((modal) => {
      modal.onDidDismiss().then(() => {
        this.loadUser();
        this.getUsuarios();
      });
      modal.present();
    })
  }

}
