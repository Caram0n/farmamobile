import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalDetalleUsuarioPageRoutingModule } from './modal-detalle-usuario-routing.module';

import { ModalDetalleUsuarioPage } from './modal-detalle-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalDetalleUsuarioPageRoutingModule
  ],
  declarations: [ModalDetalleUsuarioPage]
})
export class ModalDetalleUsuarioPageModule {}
