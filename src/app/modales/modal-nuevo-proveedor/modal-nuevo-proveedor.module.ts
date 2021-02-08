import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalNuevoProveedorPageRoutingModule } from './modal-nuevo-proveedor-routing.module';

import { ModalNuevoProveedorPage } from './modal-nuevo-proveedor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalNuevoProveedorPageRoutingModule
  ],
  declarations: [ModalNuevoProveedorPage]
})
export class ModalNuevoProveedorPageModule {}
