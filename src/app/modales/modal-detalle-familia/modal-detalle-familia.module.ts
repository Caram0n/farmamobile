import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalDetalleFamiliaPageRoutingModule } from './modal-detalle-familia-routing.module';

import { ModalDetalleFamiliaPage } from './modal-detalle-familia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalDetalleFamiliaPageRoutingModule
  ],
  declarations: [ModalDetalleFamiliaPage]
})
export class ModalDetalleFamiliaPageModule {}
