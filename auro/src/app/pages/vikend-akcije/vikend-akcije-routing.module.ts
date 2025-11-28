import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../auth-guard.service';
import { VikendAkcijeComponent } from './vikend-akcije.component';
import { Role } from '../../@core/data/role';

const routes: Routes = [
  {
    path: '',
    component: VikendAkcijeComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.prodavnica, Role.uprava] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VikendAkcijeRoutingModule { }
