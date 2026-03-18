import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PazarRoutingModule } from './pazar-routing.module';
import { PazarUnosComponent } from './pazar-unos/pazar-unos.component';
import { PazarPregledComponent } from './pazar-pregled/pazar-pregled.component';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FlatpickrModule } from 'angularx-flatpickr';
import {
  NbMenuModule,
  NbInputModule,
  NbButtonModule,
  NbIconModule,
  NbCardModule,
  NbSelectModule,
  NbSpinnerModule,
} from '@nebular/theme';

@NgModule({
  declarations: [
    PazarUnosComponent,
    PazarPregledComponent,
  ],
  imports: [
    CommonModule,
    PazarRoutingModule,
    FormsModule,
    FlatpickrModule.forRoot(),
    NgxDatatableModule,
    NbMenuModule,
    NbInputModule,
    NbButtonModule,
    NbIconModule,
    NbCardModule,
    NbSelectModule,
    NbSpinnerModule,
  ]
})
export class PazarModule { }