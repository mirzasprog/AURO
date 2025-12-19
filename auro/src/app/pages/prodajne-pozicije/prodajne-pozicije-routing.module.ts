import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../auth-guard.service';
import { Role } from '../../@core/data/role';
import { ProdajnePozicijeComponent } from './prodajne-pozicije.component';

const routes: Routes = [
  {
    path: '',
    component: ProdajnePozicijeComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.podrucni, Role.regionalni, Role.interna, Role.uprava] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProdajnePozicijeRoutingModule { }
