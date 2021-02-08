import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { FirebaseDbService } from '../../services/firebase-db.service';
import { ModalNuevoItemPage } from '../../modales/modal-nuevo-item/modal-nuevo-item.page';
import { ModalDetallePage } from '../../modales/modal-detalle/modal-detalle.page';
import { CarritoService } from '../../services/carrito.service';
import { Producto, Familia } from '../../models/interface';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-listado',
  templateUrl: './listado.page.html',
  styleUrls: ['./listado.page.scss'],
})
export class ListadoPage implements OnInit, OnDestroy {

  descending: boolean = false;
  order: number;
  column: string = 'name';

  loading: any;
  textoBuscar: string = '';
  items: Producto[] = [];
  familias: Familia[] = [];
  segmentSubscriber: Subscription;
  defecto: string;

  constructor(
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public dbFirebase: FirebaseDbService,
    public toastCtrl: ToastController,
    public carritoService: CarritoService
  ) { }

  ngOnInit() {
    //this.getItems();
    this.getFamilia();

  }

  ngOnDestroy() {
    if (this.segmentSubscriber) {
      this.segmentSubscriber.unsubscribe();
    }
  }



  nuevoItem() {
    this.modalCtrl.create({
      component: ModalNuevoItemPage,
      componentProps: {}
    }).then((modal) => {
      modal.onDidDismiss().then(() => {

      });
      modal.present();
    });
  }

  getItems() {
    const enlace = 'Items';
    this.dbFirebase.getCollection<Producto>(enlace).subscribe(res => {
      //console.log(res)
      this.items = res;
    });
  }

  getFamilia() {
    const enlace = 'Familias';
    this.dbFirebase.getCollection<Familia>(enlace).subscribe(res => {
      console.log(res)
      this.familias = res;
      this.defecto = this.familias[0].descripcion;
      console.log(this.defecto);

    });
  }

  async deleteItem(item: Producto) {

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
          this.dbFirebase.deleteDocument<Producto>('Items', item.codigo).then(() => this.presentToast('El item se eliminó con éxito', 2000));
          console.log('hecho');
        }
      }]
    });
    await alert.present();

  }


  muestraDetalle(item, i) {
    this.modalCtrl.create({
      component: ModalDetallePage,
      componentProps: { producto: item, ind: i }
    }).then((modal) => {
      modal.onDidDismiss().then(() => {

      });
      modal.present();
    })
  }


  async presentToast(mensaje: string, tiempo: number) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: tiempo
    });
    toast.present();
  }


  addCarrito(item: Producto) {
    this.carritoService.addProducto(item);
  }

  onSearchChange(event) {
    console.log(event);
    this.textoBuscar = event.detail.value;
  }


  segmentChanged(ev: any) {
    console.log(ev.detail.value);
    this.items = [];
    const opc = ev.detail.value;
    const path = 'Items';

    this.segmentSubscriber = this.dbFirebase.getCollectionQuery<Producto>(path, 'familia', '==', opc).subscribe(res => {
      if (res.length) {
        this.items = res;
      }
    });
  }

  sort(){
    this.descending = !this.descending;
    this.order = this.descending ? 1 : -1;
  }


}
