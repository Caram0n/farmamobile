import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalDetallePageRoutingModule } from './modal-detalle-routing.module';

import { ModalDetallePage } from './modal-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalDetallePageRoutingModule
  ],
  declarations: [ModalDetallePage]
})
export class ModalDetallePageModule {}
