import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NbDateFnsDateModule } from '@nebular/date-fns';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbDatepickerModule, NbCardModule, NbIconModule, NbInputModule, NbButtonModule, NbSelectModule, NbSpinnerModule, NbLayoutModule, NbFormFieldModule, NbTooltipModule, NbTimepickerModule, NbActionsModule, NbCheckboxModule, NbListModule, NbRadioModule, NbTabsetModule, NbUserModule, NbCalendarModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';
import { InventureRoutingModule } from './inventure-routing.module';
import { PregledInventureComponent } from './pregled-inventure/pregled-inventure.component';
import { InvComponent } from './inv.component';
import { ParcijalneInvComponent } from './parcijalne-inv/parcijalne-inv.component';
import { TableModule } from 'primeng-lts/table';
import { CalendarModule } from 'primeng-lts/calendar';
import { ButtonModule } from 'primeng-lts/button';
import { DropdownModule } from 'primeng-lts/dropdown';
import { InputNumberModule } from 'primeng-lts/inputnumber';
import { ConfirmDialogModule } from 'primeng-lts/confirmdialog';
import { ConfirmationService } from 'primeng-lts/api';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { DatumInvComponent } from './datum-inv/datum-inv.component';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { PregledStavkiComponent } from './pregled-stavki/pregled-stavki.component';
import { KomentarOdbijanjaComponent } from './pregled-inventure/komentar-odbijanja/komentar-odbijanja.component';
import { PregledProdavnicaInventuraComponent } from './pregled-prodavnica-inventura/pregled-prodavnica-inventura.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AkcijePregledComponent } from '../Akcije/akcije-pregled/akcije-pregled.component';
import { AkcijeUnosComponent } from '../Akcije/akcije-unos/akcije-unos.component';
import { ButtonPregledAkcijeComponent } from '../Akcije/button-pregled-akcije/button-pregled-akcije.component';
import { ButtonAkcijaComponent } from '../Akcije/button-akcija/button-akcija.component';
import { AkcijeStavkeComponent } from '../Akcije/akcije-stavke/akcije-stavke.component';
import { AkcijeStavkePregledComponent } from '../Akcije/akcije-stavke-pregled/akcije-stavke-pregled.component';
import { ButtonAzurirajAkcijuComponent } from '../Akcije/button-azuriraj-akciju/button-azuriraj-akciju.component';

@NgModule({
  declarations: [
    PregledInventureComponent,
    InvComponent,
    ParcijalneInvComponent,
    DatumInvComponent,
    PregledStavkiComponent,
    KomentarOdbijanjaComponent,
    PregledProdavnicaInventuraComponent,
    AkcijeUnosComponent,
    AkcijePregledComponent,
    ButtonPregledAkcijeComponent,
    ButtonAzurirajAkcijuComponent,
    AkcijeStavkeComponent,
    AkcijeStavkePregledComponent,
    ButtonAkcijaComponent
  ],

  imports: [
    NbDatepickerModule,
    NbDateFnsDateModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    NbButtonModule,
    NbCalendarModule,
    ThemeModule,
    ButtonModule,
    Ng2SmartTableModule,
    FormsModule,
    NbSelectModule,
    NbSpinnerModule,
    NbLayoutModule,
    NbEvaIconsModule,
    NbFormFieldModule,
    NbTooltipModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    InventureRoutingModule,
    NbTimepickerModule,
    NbUserModule,
    NbTabsetModule,
    NbActionsModule,
    NbRadioModule,
    NbListModule,
    NbCheckboxModule,
    TableModule,
    CalendarModule,
    DropdownModule,
    InputNumberModule,
    ConfirmDialogModule,
    NgbTypeaheadModule,
    MatAutocompleteModule,
    MatFormFieldModule,
  ],
  providers: [ConfirmationService],
})
export class InventureModule { }
