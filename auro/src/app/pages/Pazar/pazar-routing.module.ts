import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PazarUnosComponent } from './pazar-unos/pazar-unos.component';
import { PazarPregledComponent } from './pazar-pregled/pazar-pregled.component';

const routes: Routes = [
  {
    path: 'unos',
    component: PazarUnosComponent
  },
  {
    path: 'pregled',
    component: PazarPregledComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PazarRoutingModule { }
