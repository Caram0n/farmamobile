import { Component, OnInit } from '@angular/core';
import { ToastController, AlertController, ModalController } from '@ionic/angular';
import { FirebaseDbService } from '../../services/firebase-db.service';
import { Proveedor, Usuario, Log } from '../../models/interface';
import { ModalNuevoProveedorPage } from '../../modales/modal-nuevo-proveedor/modal-nuevo-proveedor.page';
import { ModalDetalleProveedorPage } from '../../modales/modal-detalle-proveedor/modal-detalle-proveedor.page';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { LogService } from '../../services/log.service';


@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.page.html',
  styleUrls: ['./proveedores.page.scss'],
})
export class ProveedoresPage implements OnInit {


  uid = '';
  usuario;
  usuarioSubscriber: Subscription;
  admin: boolean = false;
  farma: boolean = false;
  tecnico: boolean = false;

  proveedores: Proveedor[] = [];

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
    this.getProveedores();
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


  getProveedores() {
    const enlace = "Proveedores";
    this.dbFirebase.getCollection<Proveedor>(enlace).subscribe(res => {
      this.proveedores = res;
    });
  }

  nuevoProveedor() {
    this.modalCtrl.create({
      component: ModalNuevoProveedorPage,
      componentProps: {}
    }).then((modal) => {
      modal.onDidDismiss().then(() => {
        this.getProveedores();
      });
      modal.present();
    });
  }

  async deleteProveedor(proveedor: Proveedor, slidingItem) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar borrado',
      message: '¿Está seguro de que desea eliminar este proveedor?',
      buttons: [{
        text: 'No',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel');
        }
      }, {
        text: 'Sí',
        handler: () => {
          this.dbFirebase.deleteDocument<Proveedor>('Proveedores', proveedor.cif).then(() => {
            this.presentToast('El proveedor se eliminó con éxito', 2000)
            const accion: string = 'Ha modificado el usuario ' + proveedor.nombre;
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


  async presentToast(mensaje: string, tiempo: number) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: tiempo
    });
    toast.present();
  }

  muestraDetalle(item, i) {
    this.modalCtrl.create({
      component: ModalDetalleProveedorPage,
      componentProps: { proveedor: item, ind: i }
    }).then((modal) => {
      modal.onDidDismiss().then(() => {
        this.getProveedores();
      });
      modal.present();
    })
  }

}
