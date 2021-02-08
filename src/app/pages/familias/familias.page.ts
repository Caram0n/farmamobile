import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { FirebaseDbService } from '../../services/firebase-db.service';
import { ModalNuevaFamiliaPage } from '../../modales/modal-nueva-familia/modal-nueva-familia.page';
import { Familia } from '../../models/interface';
import { ModalDetalleFamiliaPage } from '../../modales/modal-detalle-familia/modal-detalle-familia.page';

@Component({
  selector: 'app-familias',
  templateUrl: './familias.page.html',
  styleUrls: ['./familias.page.scss'],
})
export class FamiliasPage implements OnInit {

  loading: any;

  items: Familia[] = [];
  

  constructor(
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public dbFirebase: FirebaseDbService,
    public toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.getItems();
  }


  nuevoItem() {
    this.modalCtrl.create({
      component:ModalNuevaFamiliaPage,
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

  async deleteItem(item: Familia) {    
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
          this.dbFirebase.deleteDocument<Familia>('Familias', item.codigo).then(() => this.presentToast('El item se eliminó con éxito',2000));
          
          console.log('hecho')
        
        }
        

      }]
    });
    await alert.present();   
    
  }

  async presentToast(mensaje: string, tiempo: number){
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: tiempo
    });
    toast.present();
  }

  muestraDetalle(item,i){
    this.modalCtrl.create({
      component: ModalDetalleFamiliaPage,
      componentProps: {familia: item, ind: i}
    }).then((modal) => {
      modal.onDidDismiss().then(() => {
        this.getItems();
      });
      modal.present();
    })
  }

  

}
