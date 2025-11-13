import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbDateFnsDateModule } from '@nebular/date-fns';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbCardModule, NbIconModule, NbInputModule, NbButtonModule, NbDatepickerModule, NbSelectModule, NbSpinnerModule, NbLayoutModule, NbFormFieldModule, NbTooltipModule, NbProgressBarModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../../@theme/theme.module';
import { ReklamacijeKvalitetaVIPComponent } from './reklamacije-kvaliteta-vip.component';




@NgModule({
  declarations: [
    ReklamacijeKvalitetaVIPComponent
  ],
  imports: [
    CommonModule,
     NbCardModule,
        NbIconModule,
        NbInputModule,
        NbButtonModule,
        ThemeModule,
        Ng2SmartTableModule,
        FormsModule,
        NbDatepickerModule,
        NbSelectModule,
        NbDateFnsDateModule,
        NbSpinnerModule,
        NbLayoutModule,
        NbEvaIconsModule,
        NbFormFieldModule,
        NbTooltipModule,
        NbProgressBarModule ,
        NbTooltipModule,
      ]
})
export class ReklamacijeKvalitetaVIPModule { }
