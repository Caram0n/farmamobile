import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { FirebaseDbService } from '../../services/firebase-db.service';
import { ModalNuevaFamiliaPage } from '../../modales/modal-nueva-familia/modal-nueva-familia.page';
import { Familia, Usuario, Log } from '../../models/interface';
import { ModalDetalleFamiliaPage } from '../../modales/modal-detalle-familia/modal-detalle-familia.page';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-familias',
  templateUrl: './familias.page.html',
  styleUrls: ['./familias.page.scss'],
})
export class FamiliasPage implements OnInit {



  uid = '';
  usuario;
  usuarioSubscriber: Subscription;
  admin: boolean = false;
  farma: boolean = false;
  tecnico: boolean = false;

  loading: any;

  items: Familia[] = [];


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
    this.getItems();
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


  nuevoItem() {
    this.modalCtrl.create({
      component: ModalNuevaFamiliaPage,
      componentProps: {}
    }).then((modal) => {
      modal.onDidDismiss().then(() => {

      });
      modal.present();
    });
  }

  getItems() {
    const enlace = 'Familias';
    this.dbFirebase.getCollection<Familia>(enlace).subscribe(res => {
      //console.log(res)
      this.items = res;
    });
  }
  //método que elimina una familia mediante un alert
  async deleteItem(item: Familia, slidingItem) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar borrado',
      message: '¿Está seguro de que desea eliminar esta familia?',
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
          this.dbFirebase.deleteDocument<Familia>('Familias', item.codigo).then(() => {
            this.presentToast('La familia se eliminó con éxito', 2000)
            const accion: string = 'Ha eliminado la familia ' + item.descripcion;
            this.logService.addLog(this.usuario.nombre, accion);

          }, (err) => {
            console.log("Se ha producido un error", err);
            this.presentToast("Se ha producido un error" + err, 3000);
            this.logService.addError(err);
          });
          console.log('hecho')
        }
      }]
    });
    await alert.present();
    slidingItem.close();
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
      component: ModalDetalleFamiliaPage,
      componentProps: { familia: item, ind: i }
    }).then((modal) => {
      modal.onDidDismiss().then(() => {
        this.getItems();
      });
      modal.present();
    })
  }



}
