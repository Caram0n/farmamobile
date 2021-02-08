import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListadoPageRoutingModule } from './listado-routing.module';

import { ListadoPage } from './listado.page';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListadoPageRoutingModule,
    PipesModule
  ],
  declarations: [ListadoPage]
})
export class ListadoPageModule {}
