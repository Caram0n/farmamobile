import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, LoadingController } from '@ionic/angular';
import { FirebaseDbService } from '../../services/firebase-db.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-modal-detalle-usuario',
  templateUrl: './modal-detalle-usuario.page.html',
  styleUrls: ['./modal-detalle-usuario.page.scss'],
})
export class ModalDetalleUsuarioPage implements OnInit {

   uid = '';
  user;
  usuarioSubscriber: Subscription;
  admin: boolean = false;
  farma: boolean = false;
  tecnico: boolean = false;

  usuario: any;
  edit = false;
  loading: any;

  constructor(
    private modalCtrl: ModalController,
    public dbFirebase: FirebaseDbService,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public auth: AuthService,
    public logService: LogService
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
    console.log(this.usuario);
  }
// método que busca el usuario logueado mediante el uid y controla el rol del mismo.
  loadUser() {
    const path = 'Usuarios';
    this.usuarioSubscriber = this.dbFirebase.getDocument(path, this.uid).subscribe(res => {
      console.log('loadUser() ->', res);
      this.user = res;
      this.usuarioSubscriber.unsubscribe();

      if (this.user.rol === 'Administrador') {
        this.admin = true;
      }
      if (this.user.rol === 'Farmacéutico') {
        this.farma = true;
      }
      if (this.user.rol === 'Técnico') {
        this.tecnico = true;
      }
    });
  }

  editar() {
    this.edit = true;
  }

  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'guardando'
    });
    await this.loading.present();
  }
  async presentToast(mensaje: string, tiempo: number) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: tiempo
    });
    toast.present();
  }


// método para actualizar el usuario en la base de datos
  guardarItem() {
    const path = 'Usuarios';
    const data = this.usuario;
    console.log(path);
    console.log(data);
    this.dbFirebase.updateDocument(data, path, data.uid).then((res) => {
      this.edit = false;
      console.log("Se ha modificado correctamente en la base de datos");
      
      const accion: string = 'Ha modificado el usuario '+ data.nombre;
      this.logService.addLog(this.user.nombre, accion);     
      
    }, (err) => {
      console.log("Se ha producido un error", err);
      this.presentToast("Se ha producido un error" + err, 3000);
      this.logService.addError(err);

    });
    this.modalCtrl.dismiss();


  }

}
