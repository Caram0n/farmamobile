import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalNuevoUsuarioPage } from './modal-nuevo-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: ModalNuevoUsuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalNuevoUsuarioPageRoutingModule {}
