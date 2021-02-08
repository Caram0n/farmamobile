import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Familia, Producto } from '../../models/interface';
import { FirebaseDbService } from '../../services/firebase-db.service';
import { Plugins, CameraResultType } from '@capacitor/core';
import { ImgService } from '../../services/img.service';

const { Camera } = Plugins

@Component({
  selector: 'app-modal-nuevo-item',
  templateUrl: './modal-nuevo-item.page.html',
  styleUrls: ['./modal-nuevo-item.page.scss'],
})
export class ModalNuevoItemPage implements OnInit {

  familia: Familia[]= [];
  preview;
  foto;
  imp: number;
  fam;
  
  

  constructor(
    private modalCtrl: ModalController,
    public dbFirebase: FirebaseDbService,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public img: ImgService
  ) { }

  ngOnInit() {
    this.getFamilias();
  }

  newFamilia: Familia ={
    codigo:'',
    descripcion:'',
    impuesto: null 
  }

  
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

  }

  loading: any;

  cerrarModal() {
    this.modalCtrl.dismiss();
  }


  async save() {    
    //console.log('ESTO VAMOS A GUARDAR  ', this.newItem);
    const data = this.newItem;
    data.foto=this.foto;
    data.impuestos=this.imp;
    data.familia=this.fam;

    if(data.foto==='' || data.codigo ===''){
      console.log('Ingrese los campos necesarios');
      this.presentToast('Los campos Foto y Código Nacional deben estar rellenos',3000);
    }else{
      this.presentLoading();
      const prepvp: number =(data.precio_Alb + (data.precio_Alb*data.impuestos))
      data.pvp = Number(prepvp.toFixed(2));
      const enlace = 'Items';
      await this.dbFirebase.createDocument(data, enlace, data.codigo).catch(res => {
        //console.log('el error es -> ', res);
      });
      this.presentToast('El item se guardó con éxito',2000);
      this.loading.dismiss();
  
      this.familia
  
      this.newItem = {
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
    
      };
    }
    
  }

  datosFamilia(event,fam){
    
    console.log(event)
    this.imp=parseFloat(event.target.value.impuesto)/100;
    this.fam=event.target.value.descripcion
    console.log(this.fam);
    console.log(this.imp);
  }


  async presentToast(mensaje: string, tiempo: number){
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: tiempo
    });
    toast.present();
  }


  async presentLoading(){
    this.loading = await this.loadingCtrl.create({
      message: 'guardando'
    });
    await this.loading.present();
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
      this.foto = 'data:image/png;base64,' + profilePicture.base64String;
      this.preview = this.img.getImage(this.foto);
    } catch (error) {
      console.error(error);
    }
  }  

}
