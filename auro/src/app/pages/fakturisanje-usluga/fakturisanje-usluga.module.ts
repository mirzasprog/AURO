import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbDatepickerModule, NbIconModule, NbInputModule, NbSelectModule, NbSpinnerModule, NbTooltipModule, NbBadgeModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { FakturisanjeUslugaRoutingModule } from './fakturisanje-usluga-routing.module';
import { ServiceInvoiceListComponent } from './service-invoice-list/service-invoice-list.component';
import { ServiceInvoiceFormComponent } from './service-invoice-form/service-invoice-form.component';
import { ServiceInvoicePrintComponent } from './service-invoice-print/service-invoice-print.component';

@NgModule({
  declarations: [
    ServiceInvoiceListComponent,
    ServiceInvoiceFormComponent,
    ServiceInvoicePrintComponent
  ],
  imports: [
    CommonModule,
    ThemeModule,
    ReactiveFormsModule,
    FormsModule,
    NbCardModule,
    NbButtonModule,
    NbInputModule,
    NbIconModule,
    NbSelectModule,
    NbDatepickerModule,
    NbSpinnerModule,
    NbTooltipModule,
    NbBadgeModule,
    FakturisanjeUslugaRoutingModule
  ]
})
export class FakturisanjeUslugaModule { }
