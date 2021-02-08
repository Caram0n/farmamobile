import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalDetalleHistoricoPage } from './modal-detalle-historico.page';

const routes: Routes = [
  {
    path: '',
    component: ModalDetalleHistoricoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalDetalleHistoricoPageRoutingModule {}
