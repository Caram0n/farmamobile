import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, AlertController, ToastController, Platform } from '@ionic/angular';
import { FirebaseDbService } from '../../services/firebase-db.service';
import { ModalNuevoItemPage } from '../../modales/modal-nuevo-item/modal-nuevo-item.page';
import { ModalDetallePage } from '../../modales/modal-detalle/modal-detalle.page';
import { CarritoService } from '../../services/carrito.service';
import { Producto, Familia, Usuario, Log } from '../../models/interface';
import { Subscription } from 'rxjs';
import { PedidoProveedorService } from '../../services/pedido-proveedor.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AuthService } from '../../services/auth.service';
import { LogService } from '../../services/log.service';





@Component({
  selector: 'app-listado',
  templateUrl: './listado.page.html',
  styleUrls: ['./listado.page.scss'],
})
export class ListadoPage implements OnInit, OnDestroy {


  uid = '';
  usuario;
  usuarioSubscriber: Subscription;
  admin: boolean = false;
  farma: boolean = false;
  tecnico: boolean = false;


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
    public carritoService: CarritoService,
    public pedidoService: PedidoProveedorService,
    private barcodeScanner: BarcodeScanner,
    public auth: AuthService,
    public logService: LogService

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
    //this.getItems();
    this.getFamilia();

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
    this.dbFirebase.getCollectionSort<Producto>(enlace, 'descripcion', 'asc').subscribe(res => {
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

  async deleteItem(item: Producto, slidingItem) {

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
          this.dbFirebase.deleteDocument<Producto>('Items', item.codigo).then(() => {
            this.presentToast('El producto se eliminó con éxito', 2000)
            const accion: string = 'Ha eliminado el producto ' + item.descripcion;
            this.logService.addLog(this.usuario.nombre, accion);

          }, (err) => {
            console.log("Se ha producido un error", err);
            this.presentToast("Se ha producido un error" + err, 3000);
            this.logService.addError(err);
          })
          console.log('hecho');
        }
      }]
    });
    await alert.present();
    slidingItem.close();
   // this.getItems();

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

  //añade un producto a la venta
  addCarrito(item: Producto, slidingItem) {
    this.carritoService.addProducto(item);
    slidingItem.close();
  }

//añade un producto al pedido a proveedores
  addPedido(item: Producto, slidingItem) {
    this.pedidoService.addProductoPedido(item);
    slidingItem.close();
  }

  onSearchChange(event) {
    console.log(event);
    this.textoBuscar = event.detail.value;
  }

  //busca los productos segun el segment en el que nos encontremos 
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


  // scan() {
  //   this.barcodeScanner.scan().then(barcodeData => {
  //     console.log('Barcode data', barcodeData);
  //   }).catch(err => {
  //     console.log('Error', err);
  //   });
  // }





}
