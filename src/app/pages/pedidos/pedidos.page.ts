import { Component, OnInit, OnDestroy } from '@angular/core';
import { PedidoProveedores, Producto, Usuario, Log, ProductoProveedor } from '../../models/interface';
import { ModalController, ToastController, Platform } from '@ionic/angular';
import { FirebaseDbService } from '../../services/firebase-db.service';
import { Subscription } from 'rxjs';
import { PedidoProveedorService } from '../../services/pedido-proveedor.service';

import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ModalDetallePedidoPage } from '../../modales/modal-detalle-pedido/modal-detalle-pedido.page';
import { LogService } from '../../services/log.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;



@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})
export class PedidosPage implements OnInit, OnDestroy {


  uid = '';
  usuario;
  usuarioSubscriber: Subscription;
  admin: boolean = false;
  farma: boolean = false;
  tecnico: boolean = false;

  muestraPedido: boolean = false;

  pdfObject: any;

  pedidos: PedidoProveedores[] = [];

  pedidoP: PedidoProveedores;
  cantidad: number;
  total: number;

  pedidoPSubscriber: Subscription;

  constructor(
    public modalCtrl: ModalController,
    public dbFirebase: FirebaseDbService,
    public pedidoProveedorService: PedidoProveedorService,
    public toastCtrl: ToastController,
    public file: File,
    public fileOpener: FileOpener,
    public platform: Platform,
    public auth: AuthService,
    public router: Router,
    public logService: LogService
  ) {
    this.initPedidoP();
    this.loadPedidoP();
    this.auth.stateAuth().subscribe(res => {
      console.log(res);
      if (res !== null) {
        this.uid = res.uid;
        this.loadUser();
      }
    });

  }

  ngOnInit() {
    this.getPedidos();
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

  ngOnDestroy() {
    if (this.pedidoPSubscriber) {
      this.pedidoPSubscriber.unsubscribe();
    }
  }


  getTotal() {
    this.total = 0;
    this.pedidoP.productosP.forEach(producto => {
      this.total = (producto.producto.precio_Alb * producto.cantidad) + this.total;
      console.log(producto.producto);
    });
  }

  getCantidad() {
    this.cantidad = 0;
    this.pedidoP.productosP.forEach(producto => {
      this.cantidad = producto.cantidad + this.cantidad;
    });
  }

  initPedidoP() {
    this.pedidoP = {
      id: '',
      productosP: [],
      precioTotal: null,
      fecha: new Date()
    }
  }

  loadPedidoP() {
    this.pedidoPSubscriber = this.pedidoProveedorService.getPedido().subscribe(res => {
      this.pedidoP = res;
      this.getTotal();
      this.getCantidad();

      console.log(this.pedidoP);
    })
  }

  getPedidos() {
    const path = 'PedidosProveedores';
    this.dbFirebase.getCollectionSort<PedidoProveedores>(path, 'fecha', 'desc').subscribe(res => {
      this.pedidos = res;
    })

  }
  //cuando se lanza el pedido, el pedido en curso es borrado y se guarda el pedido dentro de la tabla de
  //los pedidos a los proveedores y genera el pdf para enviarlo al proveedor
  lanzarPedido() {
    if (!this.pedidoP.productosP.length) {
      this.presentToast('Añada productos al carrito', 2000);
    }

    this.pedidoP.fecha = new Date();
    this.pedidoP.precioTotal = this.total;
    this.pedidoP.id = this.dbFirebase.createId();

    this.pedidoP.productosP.forEach(producto => {
      const path = 'PedidosProveedores';
      this.dbFirebase.createDocument(this.pedidoP, path, this.pedidoP.id).then(() => {
        console.log(this.pedidoP);

        const accion: string = 'Ha lanzado el pedido';
        this.logService.addLog(this.usuario.nombre, accion);

      }, (err) => {
        console.log("Se ha producido un error", err);
        this.presentToast("Se ha producido un error" + err, 3000);
        this.logService.addError(err);
      });
    });
    this.createPdf();

    this.pedidoProveedorService.clearPedido();
    this.initPedidoP();
  }


  async presentToast(mensaje: string, tiempo: number) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: tiempo
    });
    toast.present();
  }

  createPdf() {

    const arrTemp = [];
    const titulos = 'Código ' + 'Descripción      ' + 'Precio Albarán ' + 'Cantidad ' + '\n';

    // arrTemp.push(titulos);

    this.pedidoP.productosP.forEach(producto => {
      const linea = `Código: ${producto.producto.codigo}\t   Descripción: ${producto.producto.descripcion}\t Precio Albarán: ${producto.producto.precio_Alb} €\t  Cantidad: ${producto.cantidad}\n`;
      arrTemp.push(linea);

      console.log(arrTemp);
    });
    let docDefinition = {
      content: [
        { text: 'PEDIDO DE LA FARMACIA DE LA LICENCIADA Dª ___________________________', style: 'header' },
        '\n',
        '\n',
        { text: arrTemp, fontsize: 20, bold: true, alignment: 'justify' },
      ]
    }
    this.pdfObject = pdfMake.createPdf(docDefinition);
    this.openPdf();
  }


  openPdf() {

    if (this.platform.is('capacitor' || 'cordova')) {
      this.pdfObject.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application.pdf' });
        this.file.writeFile(this.file.dataDirectory, 'pedido.pdf', blob, { replace: true }).then(fileEntry => {
          this.fileOpener.open(this.file.dataDirectory + 'pedido.pdf', 'application.pdf');
        })
      });

      return true
    }
    this.pdfObject.download();
  }


  segmentChanged(ev: any) {
    const opc = ev.detail.value;

    if (opc === 'curso') {
      this.muestraPedido = false;
    }
    if (opc === 'historico') {
      this.muestraPedido = true;
    }

  }

  //métodos para añadir o quitar productos del pedido llamando a los métodos del servicio
  addItem(producto: Producto) {
    this.pedidoProveedorService.addProductoPedido(producto);
    console.log(producto);
  }

  removeItem(producto: Producto) {
    this.pedidoProveedorService.removeProductoPedido(producto);
  }


  muestraDetalle(item, i) {
    this.modalCtrl.create({
      component: ModalDetallePedidoPage,
      componentProps: { pedido: item, ind: item }
    }).then((modal) => {
      modal.onDidDismiss().then(() => {
        this.getPedidos();
      });
      modal.present();
    })
  }



}
