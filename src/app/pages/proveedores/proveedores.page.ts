import { Component, OnInit } from '@angular/core';
import { ToastController, AlertController, ModalController } from '@ionic/angular';
import { FirebaseDbService } from '../../services/firebase-db.service';
import { Proveedor } from '../../models/interface';
import { ModalNuevoProveedorPage } from '../../modales/modal-nuevo-proveedor/modal-nuevo-proveedor.page';
import { ModalDetalleProveedorPage } from '../../modales/modal-detalle-proveedor/modal-detalle-proveedor.page';


@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.page.html',
  styleUrls: ['./proveedores.page.scss'],
})
export class ProveedoresPage implements OnInit {

  proveedores: Proveedor[]=[];

  constructor(
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public dbFirebase: FirebaseDbService,
    public toastCtrl: ToastController,
  ) { }

  ngOnInit() {
    this.getProveedores();
  }


  getProveedores(){
    const enlace = "Proveedores";
    this.dbFirebase.getCollection<Proveedor>(enlace).subscribe( res => {
      this.proveedores = res;
    });
  }

  nuevoProveedor(){
    this.modalCtrl.create({
      component: ModalNuevoProveedorPage,
      componentProps: {}
    }).then((modal) => {
      modal.onDidDismiss().then(() =>{
        this.getProveedores();
      });
      modal.present();
    });
  }

  async deleteProveedor(proveedor: Proveedor){
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
          this.dbFirebase.deleteDocument<Proveedor>('Proveedores', proveedor.cif).then(() => this.presentToast('El proveedor se eliminó con éxito', 2000));
          console.log('hecho');
        }
      }]
    });
    await alert.present();
  }


  async presentToast(mensaje: string, tiempo: number) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: tiempo
    });
    toast.present();
  }
  
  muestraDetalle(item, i){
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
