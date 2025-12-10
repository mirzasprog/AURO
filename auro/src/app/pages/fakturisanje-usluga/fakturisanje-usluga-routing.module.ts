import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceInvoiceListComponent } from './service-invoice-list/service-invoice-list.component';
import { ServiceInvoiceFormComponent } from './service-invoice-form/service-invoice-form.component';
import { ServiceInvoicePrintComponent } from './service-invoice-print/service-invoice-print.component';
import { AuthGuard } from '../../auth-guard.service';
import { Role } from '../../@core/data/role';

const routes: Routes = [
  {
    path: '',
    component: ServiceInvoiceListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'novo',
    component: ServiceInvoiceFormComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.uprava, Role.interna, Role.podrucni, Role.regionalni] },
  },
  {
    path: ':id',
    component: ServiceInvoiceFormComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.uprava, Role.interna, Role.podrucni, Role.regionalni] },
  },
  {
    path: ':id/print',
    component: ServiceInvoicePrintComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FakturisanjeUslugaRoutingModule { }
