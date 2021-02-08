import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Familia, Producto} from 'src/app/models/interface';
import { FirebaseDbService } from 'src/app/services/firebase-db.service';
import { ImgService } from 'src/app/services/img.service';
import { Plugins, CameraResultType } from '@capacitor/core';

const { Camera } = Plugins;


@Component({
  selector: 'app-modal-detalle',
  templateUrl: './modal-detalle.page.html',
  styleUrls: ['./modal-detalle.page.scss'],
})
export class ModalDetallePage implements OnInit {
  preview;

  constructor(
    private modalCtrl: ModalController,
    public dbFirebase: FirebaseDbService,
    private img: ImgService,
    ) { }

  producto: any;
  edit= false;

  

  familia: Familia[]= [];

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


  cerrarModal(){
    this.modalCtrl.dismiss();
  }

  editar(){
    this.edit=true;
  }

  getFamilias(){
    const enlace = 'Familias';
    this.dbFirebase.getCollection<Familia>(enlace).subscribe(res => {
      this.familia = res;
    })
  }


  async sacarFoto(){
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

  guardarItem(){
    const path ='Items';
    const data = this.producto;
    console.log(this.producto)
    console.log(data);
        
     this.dbFirebase.updateDocument(data, path, data.codigo).then((res) => {
       this.edit = false;
       console.log("Se ha introducido correctamente en la base de datos");
     },  (err) => { console.log("Se ha producido un error", err);
     });
  }
 

}
