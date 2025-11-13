import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArtikliDetaljiPregledComponent } from './Redovni Otpisi/artikli-detalji-pregled/artikli-detalji-pregled.component';
import { KomentarOdbijenihOtpisaComponent } from './Redovni Otpisi/komentar-odbijenih-otpisa/komentar-odbijenih-otpisa.component';
import { KomentarComponent } from './Redovni Otpisi/artikli-detalji-pregled/komentar/komentar.component';
import { RedovniOtpisComponent } from './Redovni Otpisi/redovni-otpis/redovni-otpis.component';
import { PrikazVanrednihArtikalaComponent } from './VAN-Otpisi/prikaz-vanrednih-artikala/prikaz-vanrednih-artikala.component';
import { ZahtjeviVanredniOtpisiComponent } from './VAN-Otpisi/zahtjevi-vanredni-otpisi/zahtjevi-vanredni-otpisi.component';
import { ZahtjeviComponent } from './zahtjevi.component';
import { VanredniOtpisiKomentariComponent } from './VAN-Otpisi/vanredni-otpisi-komentari/vanredni-otpisi-komentari.component';
import { IzdatniceTroskaComponent } from './Izdatnice-Troska/izdatnice-troska/izdatnice-troska.component';
import { ArtikliIzdatniceDetaljiComponent } from './Izdatnice-Troska/artikli-izdatnice-detalji/artikli-izdatnice-detalji.component';
import { KomentarIzdaticaComponent } from './Izdatnice-Troska/komentar-izdatica/komentar-izdatica.component';
import { Role } from "../../@core/data/role";
import { AuthGuard } from '../../auth-guard.service';
import { ZavrseniZahtjeviVoComponent } from './ZavrseniZahtjevi/zavrseni-zahtjevi-vo/zavrseni-zahtjevi-vo.component';
import { ZavrseniZahtjeviRoComponent } from './ZavrseniZahtjevi/zavrseni-zahtjevi-ro/zavrseni-zahtjevi-ro.component';
import { DetaljiRoComponent } from './ZavrseniZahtjevi/detalji-ro/detalji-ro.component';
import { DetaljiVoComponent } from './ZavrseniZahtjevi/detalji-vo/detalji-vo.component';

const routes: Routes = [
  {
    path: "",
    data: { roles: [Role.trejding, Role.podrucni, Role.regionalni, Role.logistika] },
    canActivate: [AuthGuard],
    component: ZahtjeviComponent,

    children: [
      {
        path: "redovni-otpis",
        data: { roles: [Role.podrucni, Role.regionalni,Role.logistika] },
        canActivate: [AuthGuard],
        component: RedovniOtpisComponent,
      },
      {
        path: "artikli/:brojOtpisa",
        data: { roles: [Role.podrucni, Role.regionalni,Role.logistika] },
        canActivate: [AuthGuard],
        component: ArtikliDetaljiPregledComponent,
      },
      {
        path: "vanredni-otpis",
        data: { roles: [Role.podrucni, Role.regionalni, Role.logistika] },
        canActivate: [AuthGuard],
        component: ZahtjeviVanredniOtpisiComponent,
      },
      {
        path: "zavrseni-vanredni-otpis",
        data: { roles: [Role.podrucni, Role.regionalni, Role.logistika] },
        canActivate: [AuthGuard],
        component: ZavrseniZahtjeviVoComponent,
      },
      {
        path: "zavrseni-redovni-otpis",
        data: { roles: [Role.podrucni, Role.regionalni, Role.logistika] },
        canActivate: [AuthGuard],
        component: ZavrseniZahtjeviRoComponent,
      },
      {
        path: "vanredni-artikli/:brojOtpisa",
        data: { roles: [Role.podrucni, Role.regionalni, Role.logistika] },
        canActivate: [AuthGuard],
        component: PrikazVanrednihArtikalaComponent,
      },
      {
        path: "detalji-ro/:brojOtpisa",
        data: { roles: [Role.podrucni, Role.regionalni, Role.logistika] },
        canActivate: [AuthGuard],
        component: DetaljiRoComponent,
      },
      {
        path: "detalji-vo/:brojOtpisa",
        data: { roles: [Role.podrucni, Role.regionalni, Role.logistika] },
        canActivate: [AuthGuard],
        component: DetaljiVoComponent,
      },
      {
        path: "komentar",
        data: { roles: [Role.podrucni, Role.regionalni ,Role.logistika] },
        canActivate: [AuthGuard],
        component: KomentarComponent,
      },
      {
        path: "komentar-otpis",
        data: { roles: [Role.podrucni, Role.regionalni, Role.logistika] },
        canActivate: [AuthGuard],
        component: KomentarOdbijenihOtpisaComponent,
      },
      {
        path: "vanredni-komentar-otpis",
        data: { roles: [Role.podrucni, Role.regionalni,Role.logistika] },
        canActivate: [AuthGuard],
        component: VanredniOtpisiKomentariComponent,
      },
      {
        path: "izdatnice-troska",
        data: { roles: [Role.trejding,] },
        canActivate: [AuthGuard],
        component: IzdatniceTroskaComponent,
      },
      {
        path: "izdatnice-artikli/:brojIzdatnice",
        data: { roles: [Role.trejding,] },
        canActivate: [AuthGuard],
        component: ArtikliIzdatniceDetaljiComponent,
      },
      {
        path: "komentar-izdatnice",
        data: { roles: [Role.trejding,] },
        canActivate: [AuthGuard],
        component: KomentarIzdaticaComponent,
      },
    ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ZahtjeviRoutingModule { }
