import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalDetalleProveedorPageRoutingModule } from './modal-detalle-proveedor-routing.module';

import { ModalDetalleProveedorPage } from './modal-detalle-proveedor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalDetalleProveedorPageRoutingModule
  ],
  declarations: [ModalDetalleProveedorPage]
})
export class ModalDetalleProveedorPageModule {}
