import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { AuthGuard } from '../auth-guard.service';
import { RadnaPlocaComponent } from './pocetna-stranica/radna-ploca/radna-ploca.component';
import { UnosDatumaRedovnogOtpisaComponent } from './unos-datuma-redovnog-otpisa/unos-datuma-redovnog-otpisa.component';
import { PregledDinamikeOtpisaComponent } from './pregled-dinamike-otpisa/pregled-dinamike-otpisa.component';
import { UnosDatumaInventureComponent } from './unos-datuma-inventure/unos-datuma-inventure.component';
import { Role } from '../@core/data/role';
import { AkcijeUnosComponent } from './Akcije/akcije-unos/akcije-unos.component';
import { AkcijePregledComponent } from './Akcije/akcije-pregled/akcije-pregled.component';
import { ReklamacijeKvalitetaVIPComponent } from './ReklamacijeVIP/reklamacije-kvaliteta-vip/reklamacije-kvaliteta-vip.component';


const routes: Routes = [{
  path: '',
  component: PagesComponent,

  children: [

    {
      path: 'otpis',
      loadChildren: () => import('./otpisi/otpisi.module')
      .then(m => m.OtpisiModule)
    },
    {
      path: 'pregled',
      canActivate: [AuthGuard],
      loadChildren: () => import('./pregled/pregled.module')
      .then(m => m.PregledModule)
    },
    {
      path: 'zahtjevi',
      loadChildren: () => import('./zahtjevi/zahtjevi.module')
      .then(m => m.ZahtjeviModule)
    },

    {
      path: "unos-datuma-inventure",
      data: { roles: [Role.interna] },
      canActivate: [AuthGuard],
      component: UnosDatumaInventureComponent,
    },  

    {
      path: "akcije-unos",
      data: { roles: [Role] },
      canActivate: [AuthGuard],
      component: AkcijeUnosComponent,
    }, 

    {
      path: "akcije-pregled",
      data: { roles: [Role.prodavnica] },
      canActivate: [AuthGuard],
      component: AkcijePregledComponent,
    },

    {
      path: 'pocetna-stranica',
      loadChildren: () => import('./pocetna-stranica/pocetna-stranica.module')
      .then(m => m.PocetnaStranicaModule)
    },
    {
      path: 'inventura',
      loadChildren: () => import('./inventura/inventure.module')
      .then(m => m.InventureModule),
      //component: InventuraComponent
    },
    {
      path: 'unos-datuma-redovnog-otpisa',
      loadChildren: () => import('./unos-datuma-redovnog-otpisa/unos-datuma.module')
      .then(m => m.UnosDatumaModule),
      component: UnosDatumaRedovnogOtpisaComponent
    },
    {
      path: 'dinamika-otpisa',
      loadChildren: () => import('./pregled-dinamike-otpisa/dinamika-otpisa.module')
      .then(m => m.DinamikaOtpisaModule),
      component: PregledDinamikeOtpisaComponent
    },    
    {
      path: 'kvalitetaVIP',
      loadChildren: () => import('./ReklamacijeVIP/reklamacije-kvaliteta-vip/reklamacije-kvaliteta-vip.module')
      .then(m => m.ReklamacijeKvalitetaVIPModule),
      component: ReklamacijeKvalitetaVIPComponent
    },

    {
      path: '',
      component: RadnaPlocaComponent,
    },

    {
      path: '**',
      component: NotFoundComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
