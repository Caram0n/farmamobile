import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalNuevoProveedorPage } from './modal-nuevo-proveedor.page';

const routes: Routes = [
  {
    path: '',
    component: ModalNuevoProveedorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalNuevoProveedorPageRoutingModule {}
