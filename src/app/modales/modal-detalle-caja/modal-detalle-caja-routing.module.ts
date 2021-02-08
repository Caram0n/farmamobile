import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalDetalleCajaPage } from './modal-detalle-caja.page';

const routes: Routes = [
  {
    path: '',
    component: ModalDetalleCajaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalDetalleCajaPageRoutingModule {}
