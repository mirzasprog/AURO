import { NgModule } from '@angular/core';
import { ZahtjeviRoutingModule } from './zahtjevi-routing.module';
import { ZahtjeviComponent } from './zahtjevi.component';
import { RedovniOtpisComponent } from './Redovni Otpisi/redovni-otpis/redovni-otpis.component';
import { FormsModule } from '@angular/forms';
import { NbDateFnsDateModule } from '@nebular/date-fns';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbDatepickerModule, NbCardModule, NbIconModule, NbInputModule, NbButtonModule, NbSelectModule, NbSpinnerModule, NbLayoutModule, NbFormFieldModule, NbTooltipModule, NbDialogModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';
import { ArtikliDetaljiComponent } from './Redovni Otpisi/redovni-otpis/artikli-detalji/artikli-detalji.component';
import { ArtikliDetaljiPregledComponent } from './Redovni Otpisi/artikli-detalji-pregled/artikli-detalji-pregled.component';
import { ZahtjeviVanredniOtpisiComponent } from './VAN-Otpisi/zahtjevi-vanredni-otpisi/zahtjevi-vanredni-otpisi.component';
import { VanredniArtikliComponent } from './VAN-Otpisi/zahtjevi-vanredni-otpisi/vanredni-artikli/vanredni-artikli.component';
import { PrikazVanrednihArtikalaComponent } from './VAN-Otpisi/prikaz-vanrednih-artikala/prikaz-vanrednih-artikala.component';
import { KomentarComponent } from './Redovni Otpisi/artikli-detalji-pregled/komentar/komentar.component';
import { KomentarOdbijenihOtpisaComponent } from './Redovni Otpisi/komentar-odbijenih-otpisa/komentar-odbijenih-otpisa.component';
import { VanredniOtpisiKomentariComponent } from './VAN-Otpisi/vanredni-otpisi-komentari/vanredni-otpisi-komentari.component';
import { VanredniKomentarComponent } from './VAN-Otpisi/prikaz-vanrednih-artikala/vanredni-komentar/vanredni-komentar.component';
import { IzdatniceTroskaComponent } from './Izdatnice-Troska/izdatnice-troska/izdatnice-troska.component';
import { ArtikliIzdatniceDetaljiComponent } from './Izdatnice-Troska/artikli-izdatnice-detalji/artikli-izdatnice-detalji.component';
import { KomentarIzdaticaComponent } from './Izdatnice-Troska/komentar-izdatica/komentar-izdatica.component';
import { IzdatniceArtikliComponent } from './Izdatnice-Troska/izdatnice-troska/izdatnice-artikli/izdatnice-artikli.component';
import { KomentarOdbijenihIzdaticaComponent } from './Izdatnice-Troska/artikli-izdatnice-detalji/komentar-odbijenih-izdatica/komentar-odbijenih-izdatica.component';
import { ButtonOdobriComponent } from './Redovni Otpisi/artikli-detalji-pregled/button-odobri/button-odobri.component';
import { ButtonOdobriVoComponent } from './VAN-Otpisi/prikaz-vanrednih-artikala/button-odobri-vo/button-odobri-vo.component';
import { ZavrseniZahtjeviRoComponent } from './ZavrseniZahtjevi/zavrseni-zahtjevi-ro/zavrseni-zahtjevi-ro.component';
import { ZavrseniZahtjeviVoComponent } from './ZavrseniZahtjevi/zavrseni-zahtjevi-vo/zavrseni-zahtjevi-vo.component';
import { ZavrseniZahtjeviItComponent } from './ZavrseniZahtjevi/zavrseni-zahtjevi-it/zavrseni-zahtjevi-it.component';
import { ZahtjeviDetaljiRoComponent } from './ZavrseniZahtjevi/zavrseni-zahtjevi-ro/zahtjevi-detalji-ro/zahtjevi-detalji-ro.component';
import { ZahtjeviDetaljiVoComponent } from './ZavrseniZahtjevi/zavrseni-zahtjevi-vo/zahtjevi-detalji-vo/zahtjevi-detalji-vo.component';
import { DetaljiRoComponent } from './ZavrseniZahtjevi/detalji-ro/detalji-ro.component';
import { DetaljiVoComponent } from './ZavrseniZahtjevi/detalji-vo/detalji-vo.component';
import { OdbijOtpisComponent } from './Redovni Otpisi/odbij-otpis/odbij-otpis.component';
import { OdbijanjeVanrednogOtpisaComponent } from './VAN-Otpisi/odbijanje-vanrednog-otpisa/odbijanje-vanrednog-otpisa.component';

@NgModule({
  declarations: [
    ZahtjeviComponent,
    RedovniOtpisComponent,
    ArtikliDetaljiComponent,
    ArtikliDetaljiPregledComponent,
    ZahtjeviVanredniOtpisiComponent,
    VanredniArtikliComponent,
    PrikazVanrednihArtikalaComponent,
    KomentarComponent,
    KomentarOdbijenihOtpisaComponent,
    VanredniOtpisiKomentariComponent,
    VanredniKomentarComponent,
    IzdatniceTroskaComponent,
    ArtikliIzdatniceDetaljiComponent,
    KomentarIzdaticaComponent,
    IzdatniceArtikliComponent,
    KomentarOdbijenihIzdaticaComponent,
    ButtonOdobriComponent,
    ButtonOdobriVoComponent,
    ZavrseniZahtjeviRoComponent,
    ZavrseniZahtjeviVoComponent,
    ZavrseniZahtjeviItComponent,
    ZahtjeviDetaljiRoComponent,
    ZahtjeviDetaljiVoComponent,
    DetaljiRoComponent,
    DetaljiVoComponent,
    OdbijOtpisComponent,
    OdbijanjeVanrednogOtpisaComponent
  ],
  imports: [
    //CommonModule,
    ZahtjeviRoutingModule,
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
    NbDialogModule.forChild()
  ]
})
export class ZahtjeviModule { }
