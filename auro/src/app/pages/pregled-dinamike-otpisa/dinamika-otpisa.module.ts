import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DinamikaOtpisaRoutingModule } from './dinamika-otpisa-routing.module';
import { FormsModule } from '@angular/forms';
import { NbDateFnsDateModule } from '@nebular/date-fns';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbDatepickerModule, NbCardModule, NbIconModule, NbInputModule, NbButtonModule, NbSelectModule, NbSpinnerModule, NbLayoutModule, NbFormFieldModule, NbTooltipModule, NbTimepickerModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';
import { PregledDinamikeOtpisaComponent } from './pregled-dinamike-otpisa.component';


@NgModule({
  declarations: [PregledDinamikeOtpisaComponent],
  imports: [
    CommonModule,
    DinamikaOtpisaRoutingModule,
    NbDatepickerModule,
    NbDateFnsDateModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    NbButtonModule,
    ThemeModule,
    Ng2SmartTableModule,
    FormsModule,
    NbSelectModule,
    NbSpinnerModule,
    NbLayoutModule,
    NbEvaIconsModule,
    NbFormFieldModule,
    NbTooltipModule,
    NbTimepickerModule
  ]
})
export class DinamikaOtpisaModule { }
