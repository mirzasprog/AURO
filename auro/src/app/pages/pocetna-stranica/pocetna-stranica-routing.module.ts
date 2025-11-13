import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PocetnaStranicaComponent } from './pocetna-stranica.component';
import { RadnaPlocaComponent } from './radna-ploca/radna-ploca.component';

const routes: Routes = [{



  path: "",
  component: PocetnaStranicaComponent,

  children: [
    {
      path: "radna-ploca",
      component: RadnaPlocaComponent,
    },
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocetnaStranicaRoutingModule { }
