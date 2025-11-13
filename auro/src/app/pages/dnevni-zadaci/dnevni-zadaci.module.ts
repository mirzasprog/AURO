import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbBadgeModule, NbButtonModule, NbCardModule, NbDialogModule, NbIconModule, NbInputModule, NbSelectModule, NbSpinnerModule, NbTagModule, NbToggleModule, NbTooltipModule } from '@nebular/theme';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ThemeModule } from '../../@theme/theme.module';
import { DnevniZadaciRoutingModule } from './dnevni-zadaci-routing.module';
import { DailyTasksComponent } from './daily-tasks/daily-tasks.component';
import { TaskDetailDialogComponent } from './task-detail-dialog/task-detail-dialog.component';
import { CustomTaskDialogComponent } from './custom-task-dialog/custom-task-dialog.component';

@NgModule({
  declarations: [
    DailyTasksComponent,
    TaskDetailDialogComponent,
    CustomTaskDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    DnevniZadaciRoutingModule,
    NbCardModule,
    NbIconModule,
    NbButtonModule,
    NbSelectModule,
    NbInputModule,
    NbBadgeModule,
    NbTagModule,
    NbTooltipModule,
    NbSpinnerModule,
    NbToggleModule,
    NgxChartsModule,
    NbDialogModule.forChild()
  ]
})
export class DnevniZadaciModule { }
