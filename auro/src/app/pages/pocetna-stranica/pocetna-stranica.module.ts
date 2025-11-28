import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PocetnaStranicaRoutingModule } from './pocetna-stranica-routing.module';
import { RadnaPlocaComponent } from './radna-ploca/radna-ploca.component';
import { PocetnaStranicaComponent } from './pocetna-stranica.component';
import { FormsModule } from '@angular/forms';
import { NbDateFnsDateModule } from '@nebular/date-fns';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbCardModule, NbIconModule, NbInputModule, NbButtonModule, NbDatepickerModule, NbSelectModule, NbSpinnerModule, NbLayoutModule, NbFormFieldModule, NbDialogModule, NbToggleModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';
import { OtpisiRoutingModule } from '../otpisi/otpisi-routing.module';
import { StatistikaComponent } from './radna-ploca/statistika/statistika.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DropdownModule } from 'primeng-lts/dropdown';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [
    RadnaPlocaComponent,
    PocetnaStranicaComponent,
    StatistikaComponent
  ],
  imports: [
    CommonModule,
    PocetnaStranicaRoutingModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    NbToggleModule,
    NbButtonModule,
    ThemeModule,
    OtpisiRoutingModule,
    Ng2SmartTableModule,
    FormsModule,
    NbDatepickerModule,
    NbSelectModule,
    NbDateFnsDateModule,
    NbSpinnerModule,
    NbLayoutModule,
    NbEvaIconsModule,
    NbFormFieldModule,
    DropdownModule,
    CommonModule,
    FormsModule,
    NgxChartsModule,
    NbDialogModule.forChild()

  ],
  providers: [],
})
@Injectable({ providedIn: 'root' })
export class PocetnaStranicaModule { }
