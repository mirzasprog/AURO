import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Role } from "../../@core/data/role";
import { AuthGuard } from '../../auth-guard.service';
import { UnosDatumaRedovnogOtpisaComponent } from './unos-datuma-redovnog-otpisa.component';

const routes: Routes = [
  {
    path: "",
    data: { roles: [Role.interna] },
    canActivate: [AuthGuard],
    component: UnosDatumaRedovnogOtpisaComponent,
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnosDatumaRoutingModule { }
