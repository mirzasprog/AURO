import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbSelectModule,
  NbTabsetModule
} from '@nebular/theme';
import { OsnovnaSredstvaComponent } from './osnovna-sredstva.component';
import { OsnovnaSredstvaRoutingModule } from './osnovna-sredstva-routing.module';

@NgModule({
  declarations: [OsnovnaSredstvaComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbInputModule,
    NbSelectModule,
    NbTabsetModule,
    OsnovnaSredstvaRoutingModule
  ]
})
export class OsnovnaSredstvaModule {}
