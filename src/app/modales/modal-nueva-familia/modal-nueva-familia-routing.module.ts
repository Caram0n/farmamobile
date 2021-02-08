import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalNuevaFamiliaPage } from './modal-nueva-familia.page';

const routes: Routes = [
  {
    path: '',
    component: ModalNuevaFamiliaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalNuevaFamiliaPageRoutingModule {}
