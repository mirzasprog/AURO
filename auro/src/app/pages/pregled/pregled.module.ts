import { NgModule } from '@angular/core';
import { PregledRoutingModule } from './pregled-routing.module';
import { PregledComponent } from './pregled.component';
import { IzdatniceTroskaComponent } from './Izdatnice-Troška/izdatnice-troska/izdatnice-troska.component';
import { FormsModule } from '@angular/forms';
import { NbDateFnsDateModule } from '@nebular/date-fns';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbDatepickerModule, NbCardModule, NbIconModule, NbInputModule, NbButtonModule, NbSelectModule, NbSpinnerModule, NbLayoutModule, NbFormFieldModule, NbTooltipModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';
import { RedovniOtpisComponent } from './RedovniOtpis/redovni-otpis/redovni-otpis.component';
import { VanredniOtpisComponent } from './vanredni-otpis/vanredni-otpis.component';
import { NeuslovnaRobaComponent } from './neuslovna-roba/neuslovna-roba.component';
import { KontrolneInventureComponent } from './kontrolne-inventure/kontrolne-inventure.component';
import { DetaljiRedovnogOtpisaComponent } from './RedovniOtpis/redovni-otpis/detalji-redovnog-otpisa/detalji-redovnog-otpisa.component';
import { RedovniOtpisPregledComponent } from './Pregled-detalja/redovni-otpis-pregled/redovni-otpis-pregled.component';
import { DetaljiNeuslovneRobeComponent } from './neuslovna-roba/detalji-neuslovne-robe/detalji-neuslovne-robe.component';
import { DetaljiNeuslovneRobaComponent } from './neuslovna-roba/detalji-neuslovne-roba/detalji-neuslovne-roba.component';
import { DetaljiIzdatniceComponent } from './Izdatnice-Troška/detalji-izdatnice/detalji-izdatnice.component';
import { DetaljiIzdatniceTroskaComponent } from './Izdatnice-Troška/detalji-izdatnice-troska/detalji-izdatnice-troska.component';
import { ProdavniceBezOtpisaComponent } from './ProdavniceBezOtpisa/prodavnice-bez-otpisa/prodavnice-bez-otpisa.component';
import { VanredniOtpisPregledComponent } from './Pregled-detalja/vanredni-otpis-pregled/vanredni-otpis-pregled.component';
import { DetaljiVoComponent } from './vanredni-otpis/detalji-vo/detalji-vo.component';
import { DinamikaRedovnihOtpisaComponent } from './Dinamika redovnih otpisa/dinamika-redovnih-otpisa/dinamika-redovnih-otpisa.component';


@NgModule({
  declarations: [
    PregledComponent,
    IzdatniceTroskaComponent,
    RedovniOtpisComponent,
    VanredniOtpisComponent,
    NeuslovnaRobaComponent,
    KontrolneInventureComponent,
    DetaljiRedovnogOtpisaComponent,
    RedovniOtpisPregledComponent,
    DetaljiNeuslovneRobeComponent,
    DetaljiNeuslovneRobaComponent,
    DetaljiIzdatniceComponent,
    DetaljiIzdatniceTroskaComponent,
    ProdavniceBezOtpisaComponent,
    VanredniOtpisPregledComponent,
    DetaljiVoComponent,
    DinamikaRedovnihOtpisaComponent
  ],
  imports: [
    PregledRoutingModule,
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
  ]
})
export class PregledModule { }
