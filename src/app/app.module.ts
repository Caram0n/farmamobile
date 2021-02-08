import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/auth';
import { ModalNuevoItemPageModule } from './modales/modal-nuevo-item/modal-nuevo-item.module';
import { ModalNuevaFamiliaPageModule } from './modales/modal-nueva-familia/modal-nueva-familia.module';
import { ImgService } from './services/img.service';
import { ModalDetallePageModule } from './modales/modal-detalle/modal-detalle.module';
import { ComponentesModule } from './componentes/componentes.module';
import { ModalDetalleFamiliaPageModule } from './modales/modal-detalle-familia/modal-detalle-familia.module';
import { PipesModule } from './pipes/pipes.module';
import { ModalDetalleUsuarioPageModule } from './modales/modal-detalle-usuario/modal-detalle-usuario.module';
import { ModalNuevoUsuarioPageModule } from './modales/modal-nuevo-usuario/modal-nuevo-usuario.module';
import { ModalDetalleHistoricoPageModule } from './modales/modal-detalle-historico/modal-detalle-historico.module';
import { ModalDetalleCajaPageModule } from './modales/modal-detalle-caja/modal-detalle-caja.module';
import { ModalNuevoProveedorPageModule } from './modales/modal-nuevo-proveedor/modal-nuevo-proveedor.module';
import { ModalDetalleProveedorPageModule } from './modales/modal-detalle-proveedor/modal-detalle-proveedor.module';


export const firebaseConfig = {
  apiKey: "AIzaSyCAMyiHUH0qZPxq6NkZMhf9YoK8LtUBEdw",
  authDomain: "farmamobile-4cc13.firebaseapp.com",
  databaseURL: "https://farmamobile-4cc13.firebaseio.com",
  projectId: "farmamobile-4cc13",
  storageBucket: "farmamobile-4cc13.appspot.com",
  messagingSenderId: "542554000603",
  appId: "1:542554000603:web:d549937f8098f9602a90fe",
  measurementId: "G-YFZ1WDXD57"
}





@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    ModalNuevoItemPageModule,
    ModalNuevaFamiliaPageModule,
    ModalDetallePageModule,
    ComponentesModule,
    ModalDetalleFamiliaPageModule,
    PipesModule,
    ModalDetalleUsuarioPageModule,
    ModalNuevoUsuarioPageModule,
    ModalDetalleHistoricoPageModule,
    ModalDetalleCajaPageModule,
    ModalNuevoProveedorPageModule,
    ModalDetalleProveedorPageModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AngularFireAuth, ImgService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
