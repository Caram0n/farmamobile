import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalDetalleProveedorPage } from './modal-detalle-proveedor.page';

const routes: Routes = [
  {
    path: '',
    component: ModalDetalleProveedorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalDetalleProveedorPageRoutingModule {}
