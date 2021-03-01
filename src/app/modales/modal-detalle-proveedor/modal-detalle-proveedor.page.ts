import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { FirebaseDbService } from '../../services/firebase-db.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { Log } from '../../models/interface';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-modal-detalle-proveedor',
  templateUrl: './modal-detalle-proveedor.page.html',
  styleUrls: ['./modal-detalle-proveedor.page.scss'],
})
export class ModalDetalleProveedorPage implements OnInit {


  uid = '';
  usuario;
  usuarioSubscriber: Subscription;
  admin: boolean = false;
  farma: boolean = false;
  tecnico: boolean = false;

  proveedor: any;
  edit = false;

  constructor(
    private modalCtrl: ModalController,
    public dbFirebase: FirebaseDbService,
    public auth: AuthService,
    public logService: LogService,
    public toastCtrl: ToastController
  ) {
    // método que recoge en una variable el uid

    this.auth.stateAuth().subscribe(res => {
      console.log(res);
      if (res !== null) {
        this.uid = res.uid;
        this.loadUser();
      }
    });

  }

  ngOnInit() {
    console.log(this.proveedor);
  }
// método que busca el usuario logueado mediante el uid y controla el rol del mismo.
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

  cerrarModal() {
    this.modalCtrl.dismiss();
  }


  editar() {
    this.edit = true;
  }
// método para actualizar los datos del proveedor en la base de datos
  guardarProveedor() {
    const path = "Proveedores";
    const data = this.proveedor;

    this.dbFirebase.updateDocument(data, path, data.cif).then((res) => {
      this.edit = false;

      const accion: string = 'Ha modificado el proveedor ' + data.nombre;

      this.logService.addLog(this.usuario.nombre, accion);

    }, (err) => {
      console.log("Se ha producido un error", err);
      this.presentToast("Se ha producido un error" + err, 3000);
      this.logService.addError(err);
    });


  }

  async presentToast(mensaje: string, tiempo: number) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: tiempo
    });
    toast.present();
  }

}
