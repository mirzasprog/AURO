import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../auth-guard.service';
import { SmjeneComponent } from './smjene.component';
const routes: Routes = [
  {
    path: '',
    component: SmjeneComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SmjeneRoutingModule {}
