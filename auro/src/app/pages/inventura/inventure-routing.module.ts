import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Role } from "../../@core/data/role";
import { AuthGuard } from '../../auth-guard.service';
import { PregledInventureComponent } from './pregled-inventure/pregled-inventure.component';
import { InvComponent } from './inv.component';
import { ParcijalneInvComponent } from './parcijalne-inv/parcijalne-inv.component';
import { UnsavedChangesGuard } from '../../@core/guard/guards/unsaved-changes.guard';
const routes: Routes = [
  {
    path: "",
    data: { roles: [Role.prodavnica,Role.podrucni, Role.interna] },
    canActivate: [AuthGuard],
    component: InvComponent,
    children: [
      {
        path: "pregled",
        data: { roles: [Role.podrucni, Role.interna] },
        canActivate: [AuthGuard],
        component: PregledInventureComponent,
      },     
       {
        path: "parcijalne-inv",
        data: { roles: [Role.prodavnica] },
        canActivate: [AuthGuard],
        canDeactivate: [UnsavedChangesGuard],
        component: ParcijalneInvComponent,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventureRoutingModule { }
