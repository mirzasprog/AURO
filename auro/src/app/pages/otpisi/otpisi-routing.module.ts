import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Role } from "../../@core/data/role";
import { AuthGuard } from "../../auth-guard.service";
import { ArtikliVanredniComponent } from "./artikli-vanredni/artikli-vanredni.component";
import { ArtikliComponent } from "./artikli/artikli.component";
import { NemaOtpisaComponent } from "./nema-otpisa/nema-otpisa.component";
import { OdbijeniArtikliROComponent } from "./odbijeni-artikli-ro/odbijeni-artikli-ro.component";
import { OdbijeniArtikliVOComponent } from "./odbijeni-artikli-vo/odbijeni-artikli-vo.component";
import { OdobreniArtikliROComponent } from "./odobreni-artikli-ro/odobreni-artikli-ro.component";
import { OdobreniArtikliVOComponent } from "./odobreni-artikli-vo/odobreni-artikli-vo.component";
import { OtpisiComponent } from "./otpisi.component";
import { NoviRedovniComponent } from "./otpisi/redovni/novi-redovni/novi-redovni.component";
import { PregledVanrednihOtpisaComponent } from "./pregled-vanrednih-otpisa/pregled-vanrednih-otpisa.component";
import { RedovniComponent } from "./redovni/redovni.component";
import { VanredniComponent } from "./vanredni/vanredni.component";

const routes: Routes = [
  {
    path: "",
    data: { roles: [Role.prodavnica, Role.skladiste] },
    canActivate: [AuthGuard],
    component: OtpisiComponent,

    children: [
      {
        path: "redovni",
        data: { roles: [Role.prodavnica, Role.skladiste] },
        canActivate: [AuthGuard],
        component: RedovniComponent,
      },
      {
        path: "redovni/novi",
        data: { roles: [Role.prodavnica ,Role.skladiste] },
        canActivate: [AuthGuard],
        component: NoviRedovniComponent,
      },
      {
        path: "nema-otpisa",
        data: { roles: [Role.prodavnica ,Role.skladiste] },
        canActivate: [AuthGuard],
        component: NemaOtpisaComponent,
      },
      {
        path: "artikli/:brojOtpisa",
        data: { roles: [Role.prodavnica, Role.skladiste] },
        canActivate: [AuthGuard],
        component: ArtikliComponent,
      },
      {
        path: "odbijeni-artikli-ro/:brojOtpisa",
        data: { roles: [Role.prodavnica, Role.skladiste] },
        canActivate: [AuthGuard],
        component: OdbijeniArtikliROComponent,
      },
      {
        path: "odobreni-artikli-ro/:brojOtpisa",
        data: { roles: [Role.prodavnica, Role.skladiste] },
        canActivate: [AuthGuard],
        component: OdobreniArtikliROComponent,
      },
      {
        path: "artikli-vanredni/:brojOtpisa",
        data: { roles: [Role.prodavnica, Role.skladiste] },
        canActivate: [AuthGuard],
        component: ArtikliVanredniComponent,
      },
      {
        path: "odbijeni-artikli-vo/:brojOtpisa",
        data: { roles: [Role.prodavnica, Role.skladiste] },
        canActivate: [AuthGuard],
        component: OdbijeniArtikliVOComponent,
      },
      {
        path: "odobreni-artikli-vo/:brojOtpisa",
        data: { roles: [Role.prodavnica, Role.skladiste] },
        canActivate: [AuthGuard],
        component: OdobreniArtikliVOComponent,
      },
      {
        path: "vanredni",
        data: { roles: [Role.prodavnica, Role.skladiste] },
        canActivate: [AuthGuard],
        component: PregledVanrednihOtpisaComponent,
      },
      {
        path: "vanredni/novi",
        data: { roles: [Role.prodavnica, Role.skladiste] },
        canActivate: [AuthGuard],
        component: VanredniComponent,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OtpisiRoutingModule {}

