import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Familia, Producto } from 'src/app/models/interface';
import { FirebaseDbService } from 'src/app/services/firebase-db.service';
import { ImgService } from 'src/app/services/img.service';
import { Plugins, CameraResultType } from '@capacitor/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Log } from '../../models/interface';
import { LogService } from '../../services/log.service';

const { Camera } = Plugins;


@Component({
  selector: 'app-modal-detalle',
  templateUrl: './modal-detalle.page.html',
  styleUrls: ['./modal-detalle.page.scss'],
})
export class ModalDetallePage implements OnInit {

  
  uid = '';
  usuario;
  usuarioSubscriber: Subscription;
  admin: boolean = false;
  farma: boolean = false;
  tecnico: boolean = false;

  preview;

  constructor(
    private modalCtrl: ModalController,
    public dbFirebase: FirebaseDbService,
    private img: ImgService,
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

  producto: any;
  edit = false;



  familia: Familia[] = [];

  newItem: Producto = {
    codigo: '',
    descripcion: '',
    impuestos: null,
    precio_Alb: null,
    pvp: null,
    stock: null,
    familia: '',
    fecha_cad: '',
    sinonimo: '',
    foto: ''
    //id:''

  }

  ngOnInit() {
    console.log(this.producto);
    this.getFamilias();
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

  getFamilias() {
    const enlace = 'Familias';
    this.dbFirebase.getCollection<Familia>(enlace).subscribe(res => {
      this.familia = res;
    })
  }

  //método para usar la cámara del dispositivo
  async sacarFoto() {
    try {
      const profilePicture = await Camera.getPhoto({
        quality: 50,
        height: 400,
        width: 600,
        allowEditing: false,
        resultType: CameraResultType.Base64,
      });
      this.newItem.foto = 'data:image/png;base64,' + profilePicture.base64String;
      this.preview = this.img.getImage(this.newItem.foto);
    } catch (error) {
      console.error(error);
    }
  }
  // método que guarda el producto nuevo en la base de datos
  guardarItem() {
    const path = 'Items';
    const data = this.producto;
    console.log(this.producto)
    console.log(data);

    this.dbFirebase.updateDocument(data, path, data.codigo).then((res) => {
      this.edit = false;
      console.log("Se ha introducido correctamente en la base de datos");
      //tras guardar el producto se registra en el log el evento
      
      const accion:  string = 'Ha modificado el producto ' + data.descripcion
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
