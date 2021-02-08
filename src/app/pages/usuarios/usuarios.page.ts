import { Component, OnInit } from '@angular/core';
import { ToastController, AlertController, ModalController } from '@ionic/angular';
import { Usuario } from 'src/app/models/interface';
import { FirebaseDbService } from '../../services/firebase-db.service';
import { ModalDetalleUsuarioPage } from '../../modales/modal-detalle-usuario/modal-detalle-usuario.page';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {

  usuarios: Usuario[] = [];
  loading: any;
  textoBuscar: string = '';
  
  constructor(
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public dbFirebase: FirebaseDbService,
    public toastCtrl: ToastController,
  ) { }

  

  ngOnInit() {
    this.getUsuarios();
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

  async deleteItem(usuario: Usuario) {

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
          this.dbFirebase.deleteDocument<Usuario>('Usuarios', usuario.uid).then(() => this.presentToast('El usuario se eliminó con éxito', 2000));
          console.log('hecho');
        }
      }]
    });
    await alert.present();

  }

}
