import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemCarritoComponent } from './item-carrito/item-carrito.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ItemCarritoComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ],
  exports: [
    ItemCarritoComponent
  ]
})
export class ComponentesModule { }
