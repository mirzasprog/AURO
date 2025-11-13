import { NgModule } from '@angular/core';
import { VanredniComponent } from './vanredni/vanredni.component';
import { RedovniComponent } from './redovni/redovni.component';
import { OtpisiComponent } from './otpisi.component';
import { OtpisiRoutingModule } from './otpisi-routing.module';
import { NbButtonModule, NbCardModule, NbDatepickerModule, NbFormFieldModule, NbIconModule,
  NbInputModule, NbLayoutModule, NbProgressBarModule, NbSelectModule, NbSpinnerModule, NbTooltipModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';
import { NoviRedovniComponent } from './otpisi/redovni/novi-redovni/novi-redovni.component';
import { FormsModule } from '@angular/forms';
import { NbDateFnsDateModule } from '@nebular/date-fns';
import { PregledVanrednihOtpisaComponent } from './pregled-vanrednih-otpisa/pregled-vanrednih-otpisa.component';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { TabelaDugmeRedovniComponent } from './redovni/tabela-dugme/tabela-dugme-redovni.component';
import { TabelaDugmeVanredniComponent } from './pregled-vanrednih-otpisa/tabela-dugme/tabela-dugme-vanredni.component';
import { ArtikliComponent } from './artikli/artikli.component';
import { ArtikliVanredniComponent } from './artikli-vanredni/artikli-vanredni.component';
import { TabelaDatepickerRendererComponent } from './otpisi/redovni/novi-redovni/tabela-datepicker-renderer/tabela-datepicker-renderer.component';
import { TabelaDatepickerComponent } from './otpisi/redovni/novi-redovni/tabela-datepicker/tabela-datepicker.component';
import { OdbijeniArtikliROComponent } from './odbijeni-artikli-ro/odbijeni-artikli-ro.component';
import { OdobreniArtikliROComponent } from './odobreni-artikli-ro/odobreni-artikli-ro.component';
import { OdobreniArtikliVOComponent } from './odobreni-artikli-vo/odobreni-artikli-vo.component';
import { OdbijeniArtikliVOComponent } from './odbijeni-artikli-vo/odbijeni-artikli-vo.component';
import { ButtonOdbijeniArtikliRoComponent } from './redovni/button-odbijeni-artikli-ro/button-odbijeni-artikli-ro.component';
import { ButtonOdobreniArtikliRoComponent } from './redovni/button-odobreni-artikli-ro/button-odobreni-artikli-ro.component';
import { ButtonOdobreniArtikliVoComponent } from './pregled-vanrednih-otpisa/button-odobreni-artikli-vo/button-odobreni-artikli-vo.component';
import { ButtonOdbijeniArtikliVoComponent } from './pregled-vanrednih-otpisa/button-odbijeni-artikli-vo/button-odbijeni-artikli-vo.component';
import { NemaOtpisaComponent } from './nema-otpisa/nema-otpisa.component';


@NgModule({
  declarations: [
    RedovniComponent,
    VanredniComponent,
    OtpisiComponent,
    NoviRedovniComponent,
    PregledVanrednihOtpisaComponent,
    TabelaDugmeRedovniComponent,
    TabelaDugmeVanredniComponent,
    ArtikliComponent,
    ArtikliVanredniComponent,
    TabelaDatepickerComponent,
    TabelaDatepickerRendererComponent,
    OdbijeniArtikliROComponent,
    OdobreniArtikliROComponent,
    OdobreniArtikliVOComponent,
    OdbijeniArtikliVOComponent,
    ButtonOdbijeniArtikliRoComponent,
    ButtonOdobreniArtikliRoComponent,
    ButtonOdobreniArtikliVoComponent,
    ButtonOdbijeniArtikliVoComponent,
    NemaOtpisaComponent
  ],
  imports: [
    NbCardModule,
    NbIconModule,
    NbInputModule,
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
    NbTooltipModule,
    NbProgressBarModule ,
    NbTooltipModule,
  ]
})
export class OtpisiModule { }
