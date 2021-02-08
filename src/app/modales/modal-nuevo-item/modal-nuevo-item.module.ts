import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalNuevoItemPageRoutingModule } from './modal-nuevo-item-routing.module';

import { ModalNuevoItemPage } from './modal-nuevo-item.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalNuevoItemPageRoutingModule
  ],
  declarations: [ModalNuevoItemPage]
})
export class ModalNuevoItemPageModule {}
