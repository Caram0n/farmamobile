import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalDetalleHistoricoPageRoutingModule } from './modal-detalle-historico-routing.module';

import { ModalDetalleHistoricoPage } from './modal-detalle-historico.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalDetalleHistoricoPageRoutingModule
  ],
  declarations: [ModalDetalleHistoricoPage]
})
export class ModalDetalleHistoricoPageModule {}
