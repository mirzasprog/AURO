import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IzdatniceTroskaComponent } from './Izdatnice-Troška/izdatnice-troska/izdatnice-troska.component';
import { KontrolneInventureComponent } from './kontrolne-inventure/kontrolne-inventure.component';
import { NeuslovnaRobaComponent } from './neuslovna-roba/neuslovna-roba.component';
import { Role } from "../../@core/data/role";
import { AuthGuard } from "../../auth-guard.service";
import { PregledComponent } from './pregled.component';
import { RedovniOtpisComponent } from './RedovniOtpis/redovni-otpis/redovni-otpis.component';
import { VanredniOtpisComponent } from './vanredni-otpis/vanredni-otpis.component';
import { RedovniOtpisPregledComponent } from './Pregled-detalja/redovni-otpis-pregled/redovni-otpis-pregled.component';
import { DetaljiNeuslovneRobaComponent } from './neuslovna-roba/detalji-neuslovne-roba/detalji-neuslovne-roba.component';
import { DetaljiIzdatniceTroskaComponent } from './Izdatnice-Troška/detalji-izdatnice-troska/detalji-izdatnice-troska.component';
import { ProdavniceBezOtpisaComponent } from './ProdavniceBezOtpisa/prodavnice-bez-otpisa/prodavnice-bez-otpisa.component';
import { VanredniOtpisPregledComponent } from './Pregled-detalja/vanredni-otpis-pregled/vanredni-otpis-pregled.component';
import { DinamikaRedovnihOtpisaComponent } from './Dinamika redovnih otpisa/dinamika-redovnih-otpisa/dinamika-redovnih-otpisa.component';

const routes: Routes = [
  {
    path: "",
    data: { roles: [Role.interna] },
    canActivate: [AuthGuard],
    component: PregledComponent,

    children: [
      {
        path: "izdatnice-troska",
        component: IzdatniceTroskaComponent,
      },
      {
        path: "redovni-otpis",
        component: RedovniOtpisComponent,
      },
      {
        path: "vanredni-otpis",
        component: VanredniOtpisComponent,
      },
      {
        path: "neuslovna-roba",
        component: NeuslovnaRobaComponent,
      },
      {
        path: "kontrolne-inventure",
        component: KontrolneInventureComponent,
      },
      {
        path: "prodavnica-bez-otpisa",
        component: ProdavniceBezOtpisaComponent,
      },
      
      {
        path: "redovni-otpis-detalji/:brojOtpisa",
        component:RedovniOtpisPregledComponent,
      },
      {
        path: "vanredni-otpis-detalji/:brojOtpisa",
        component:VanredniOtpisPregledComponent,
      },
      {
        path: "neuslovna-roba-detalji/:brojNeuslovneRobe",
        component:DetaljiNeuslovneRobaComponent,
      },
      {
        path: "izdatnice-troska-detalji/:brojIzdatnice",
        component:DetaljiIzdatniceTroskaComponent,
      },
      {
        path: "dinamika-otpisa",
        component:DinamikaRedovnihOtpisaComponent,
      },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PregledRoutingModule { }
