import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalDetallePedidoPage } from './modal-detalle-pedido.page';

const routes: Routes = [
  {
    path: '',
    component: ModalDetallePedidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalDetallePedidoPageRoutingModule {}
