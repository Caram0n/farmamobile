import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemCarritoComponent } from './item-carrito/item-carrito.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ItemPedidoComponent } from './item-pedido/item-pedido.component';



@NgModule({
  declarations: [
    ItemCarritoComponent,
    ItemPedidoComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ],
  exports: [
    ItemCarritoComponent,
    ItemPedidoComponent
  ]
})
export class ComponentesModule { }
