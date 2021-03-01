import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalDetallePedidoPageRoutingModule } from './modal-detalle-pedido-routing.module';

import { ModalDetallePedidoPage } from './modal-detalle-pedido.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalDetallePedidoPageRoutingModule
  ],
  declarations: [ModalDetallePedidoPage]
})
export class ModalDetallePedidoPageModule {}
