import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Role } from '../../@core/data/role';
import { AuthGuard } from '../../auth-guard.service';
import { PregledDinamikeOtpisaComponent } from './pregled-dinamike-otpisa.component';

const routes: Routes = [
  {
    path: "",
    data: { roles:"" },
    canActivate: [AuthGuard],
    component: PregledDinamikeOtpisaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DinamikaOtpisaRoutingModule { }
