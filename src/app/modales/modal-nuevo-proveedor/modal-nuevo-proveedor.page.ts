import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, ModalController } from '@ionic/angular';
import { FirebaseDbService } from '../../services/firebase-db.service';
import { Proveedor, Log } from '../../models/interface';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-modal-nuevo-proveedor',
  templateUrl: './modal-nuevo-proveedor.page.html',
  styleUrls: ['./modal-nuevo-proveedor.page.scss'],
})
export class ModalNuevoProveedorPage implements OnInit {

  uid = '';
  usuario;
  usuarioSubscriber: Subscription;

  loading: any;

  constructor(
    private modalCtrl: ModalController,
    public dbFirebase: FirebaseDbService,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
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
  }

  newProveedor: Proveedor = {
    cif: '',
    nombre: '',
    direccion: '',
    telefono: '',
    correo: ''
  }

  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  loadUser() {
    const path = 'Usuarios';
    this.usuarioSubscriber = this.dbFirebase.getDocument(path, this.uid).subscribe(res => {
      console.log('loadUser() ->', res);
      this.usuario = res;
      this.usuarioSubscriber.unsubscribe();
    });
  }

  async save() {
    const data = this.newProveedor;
    this.presentLoading();
    const enlace = 'Proveedores';
    await this.dbFirebase.createDocument(data, enlace, data.cif).then(res => {
      this.presentToast('El proveedor se guardó con éxito', 2000);

      const accion: string = 'Ha creado el proveedor ' + data.nombre;
      this.logService.addLog(this.usuario.nombre, accion);

      this.loading.dismiss();
    }, (err) => {
      console.log("Se ha producido un error", err);
      this.presentToast("Se ha producido un error" + err, 3000);
      this.logService.addError(err);
    });



  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'guardando'
    });
    await this.loading.present();

    this.newProveedor = {
      cif: '',
      nombre: '',
      direccion: '',
      telefono: '',
      correo: ''
    };
  }

  async presentToast(mensaje: string, tiempo: number) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: tiempo
    });
    toast.present();
  }

}
