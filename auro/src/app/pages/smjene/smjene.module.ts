import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { 
  NbButtonModule, 
  NbCardModule, 
  NbDatepickerModule, 
  NbDialogModule, 
  NbIconModule, 
  NbInputModule, 
  NbSelectModule, 
  NbTabsetModule, 
  NbTooltipModule, 
  NbSpinnerModule,
  NbButtonGroupModule 
} from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { SmjeneRoutingModule } from './smjene-routing.module';
import { SmjeneComponent } from './smjene.component';
import { ShiftFormDialogComponent } from './shift-form-dialog/shift-form-dialog.component';
import { CopyWeekDialogComponent } from './copy-week-dialog/copy-week-dialog.component';

// FullCalendar imports
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

// Plugin registracija
FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin,
]);

@NgModule({
  declarations: [
    SmjeneComponent,
    ShiftFormDialogComponent,
    CopyWeekDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    SmjeneRoutingModule,
    NbCardModule,
    NbButtonModule,
    NbButtonGroupModule,
    NbSelectModule,
    NbInputModule,
    NbIconModule,
    NbTabsetModule,
    NbTooltipModule,
    NbSpinnerModule,
    NbDatepickerModule,
    NbDialogModule.forChild(),
    FullCalendarModule,
  ],
})
export class SmjeneModule {}