import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalNuevoItemPage } from './modal-nuevo-item.page';

const routes: Routes = [
  {
    path: '',
    component: ModalNuevoItemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalNuevoItemPageRoutingModule {}
