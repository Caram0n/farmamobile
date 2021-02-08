import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalDetalleFamiliaPage } from './modal-detalle-familia.page';

const routes: Routes = [
  {
    path: '',
    component: ModalDetalleFamiliaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalDetalleFamiliaPageRoutingModule {}
