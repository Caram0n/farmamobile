import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalDetalleCajaPageRoutingModule } from './modal-detalle-caja-routing.module';

import { ModalDetalleCajaPage } from './modal-detalle-caja.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalDetalleCajaPageRoutingModule
  ],
  declarations: [ModalDetalleCajaPage]
})
export class ModalDetalleCajaPageModule {}
