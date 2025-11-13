import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DailyTasksComponent } from './daily-tasks/daily-tasks.component';
import { AuthGuard } from '../../auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: DailyTasksComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DnevniZadaciRoutingModule { }
