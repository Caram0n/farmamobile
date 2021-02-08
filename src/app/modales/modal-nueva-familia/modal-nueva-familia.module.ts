import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalNuevaFamiliaPageRoutingModule } from './modal-nueva-familia-routing.module';

import { ModalNuevaFamiliaPage } from './modal-nueva-familia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalNuevaFamiliaPageRoutingModule
  ],
  declarations: [ModalNuevaFamiliaPage]
})
export class ModalNuevaFamiliaPageModule {}
