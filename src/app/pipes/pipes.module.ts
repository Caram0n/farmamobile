import { NgModule } from '@angular/core';
import { FiltroPipe } from './filtro.pipe';
import { SortPipe } from './sort.pipe';



@NgModule({
  declarations: [FiltroPipe, SortPipe],
  exports: [FiltroPipe, SortPipe]
})
export class PipesModule { }
