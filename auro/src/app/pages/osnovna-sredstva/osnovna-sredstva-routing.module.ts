import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../auth-guard.service';
import { OsnovnaSredstvaComponent } from './osnovna-sredstva.component';

const routes: Routes = [
  {
    path: '',
    component: OsnovnaSredstvaComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OsnovnaSredstvaRoutingModule {}
