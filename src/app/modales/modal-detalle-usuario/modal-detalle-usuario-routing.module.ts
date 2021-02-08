import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalDetalleUsuarioPage } from './modal-detalle-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: ModalDetalleUsuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalDetalleUsuarioPageRoutingModule {}
