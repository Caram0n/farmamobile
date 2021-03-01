import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, LoadingController } from '@ionic/angular';
import { FirebaseDbService } from '../../services/firebase-db.service';
import { Familia } from 'src/app/models/interface';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Log } from '../../models/interface';
import { LogService } from '../../services/log.service';


@Component({
  selector: 'app-modal-detalle-familia',
  templateUrl: './modal-detalle-familia.page.html',
  styleUrls: ['./modal-detalle-familia.page.scss'],
})
export class ModalDetalleFamiliaPage implements OnInit {

  log: Log = {
    user: null,
    fecha: new Date(),
    accion: '',
    id:''
  }

  uid = '';
  usuario;
  usuarioSubscriber: Subscription;
  admin: boolean = false;
  farma: boolean = false;
  tecnico: boolean = false;

  familia: any;
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
    console.log(this.familia)
  }

  newFamilia: Familia = {
    codigo: '',
    descripcion: '',
    impuesto: null,
    ganancia: null
  }
// método que busca el usuario logueado mediante el uid y controla el rol del usuario
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

  // método que cambia entre las vistas para consultar o editar una familia
  editar() {
    this.edit = true;
  }

  // método que actualiza la familia en la base de datos
  guardarItem() {
    const path = 'Familias';
    const data = this.familia;
    console.log(path);
    console.log(data);
    this.dbFirebase.updateDocument(data, path, data.codigo).then((res) => {
      this.edit = false;
      console.log("Se ha modificado correctamente en la base de datos");
      const accion: string = 'Ha modificado la familia '+ data.descripcion;

      this.logService.addLog(this.usuario.nombre, accion);       
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
  }
  async presentToast(mensaje: string, tiempo: number) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: tiempo
    });
    toast.present();
  }



}
