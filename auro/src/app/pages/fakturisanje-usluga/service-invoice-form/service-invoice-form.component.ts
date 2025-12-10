import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ServiceInvoice, ServiceInvoiceItem } from '../../../@core/data/service-invoice';
import { DataService } from '../../../@core/utils/data.service';

@Component({
  selector: 'ngx-service-invoice-form',
  templateUrl: './service-invoice-form.component.html',
  styleUrls: ['./service-invoice-form.component.scss']
})
export class ServiceInvoiceFormComponent implements OnInit, OnDestroy {
  forma: FormGroup;
  loading = false;
  spremanje = false;
  fakturaId?: number;
  valute = ['BAM', 'EUR', 'USD'];
  private destroy$ = new Subject<void>();

  get stavke(): FormArray {
    return this.forma.get('items') as FormArray;
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly dataService: DataService,
    private readonly toastrService: NbToastrService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.forma = this.fb.group({
      invoiceNumber: [''],
      invoiceDate: [new Date(), Validators.required],
      dueDate: [new Date(), Validators.required],
      customerName: ['', Validators.required],
      customerAddress: [''],
      customerCity: [''],
      customerCountry: [''],
      customerTaxId: [''],
      customerId: [null],
      currency: ['BAM', Validators.required],
      notes: [''],
      status: ['Kreirano'],
      subtotalAmount: [{ value: 0, disabled: true }],
      taxAmount: [{ value: 0, disabled: true }],
      totalAmount: [{ value: 0, disabled: true }],
      items: this.fb.array([])
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'novo') {
      this.fakturaId = Number(id);
      this.ucitajFakturu();
    } else {
      this.dodajStavku();
    }

    this.stavke.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.izracunajUkupno());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ucitajFakturu(): void {
    if (!this.fakturaId) {
      return;
    }
    this.loading = true;
    this.dataService.preuzmiFakturuUsluge(this.fakturaId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (faktura: ServiceInvoice) => {
          this.popuniFormu(faktura);
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.toastrService.danger(err.error?.poruka || 'Greška pri preuzimanju fakture.', 'Greška');
        }
      });
  }

  popuniFormu(faktura: ServiceInvoice): void {
    this.forma.patchValue({
      invoiceNumber: faktura.invoiceNumber,
      invoiceDate: new Date(faktura.invoiceDate),
      dueDate: new Date(faktura.dueDate),
      customerName: faktura.customerName,
      customerAddress: faktura.customerAddress,
      customerCity: faktura.customerCity,
      customerCountry: faktura.customerCountry,
      customerTaxId: faktura.customerTaxId,
      customerId: faktura.customerId,
      currency: faktura.currency,
      notes: faktura.notes,
      status: faktura.status,
      subtotalAmount: faktura.subtotalAmount,
      taxAmount: faktura.taxAmount,
      totalAmount: faktura.totalAmount
    });

    this.stavke.clear();
    faktura.items?.forEach(item => this.stavke.push(this.kreirajStavku(item)));
    if (!this.stavke.length) {
      this.dodajStavku();
    }
  }

  kreirajStavku(item?: ServiceInvoiceItem): FormGroup {
    return this.fb.group({
      description: [item?.description || '', Validators.required],
      quantity: [item?.quantity ?? 1, [Validators.required, Validators.min(0.01)]],
      unitPrice: [item?.unitPrice ?? 0, [Validators.required, Validators.min(0.01)]],
      taxRate: [item?.taxRate ?? 17, [Validators.required, Validators.min(0)]],
    });
  }

  dodajStavku(): void {
    this.stavke.push(this.kreirajStavku());
    this.izracunajUkupno();
  }

  ukloniStavku(index: number): void {
    if (this.stavke.length === 1) {
      return;
    }
    this.stavke.removeAt(index);
    this.izracunajUkupno();
  }

  izracunajUkupno(): void {
    let subtotal = 0;
    let porez = 0;
    this.stavke.controls.forEach(ctrl => {
      const qty = Number(ctrl.get('quantity')?.value) || 0;
      const price = Number(ctrl.get('unitPrice')?.value) || 0;
      const rate = Number(ctrl.get('taxRate')?.value) || 0;
      const lineTotal = qty * price;
      const lineTax = lineTotal * rate / 100;
      subtotal += lineTotal;
      porez += lineTax;
    });
    const total = subtotal + porez;
    this.forma.patchValue({
      subtotalAmount: subtotal,
      taxAmount: porez,
      totalAmount: total
    }, { emitEvent: false });
  }

  sacuvaj(): void {
    if (this.forma.invalid) {
      this.forma.markAllAsTouched();
      this.toastrService.warning('Provjerite obavezna polja.', 'Validacija');
      return;
    }

    const vrijednosti = this.forma.getRawValue();
    const payload: ServiceInvoice = {
      id: this.fakturaId,
      invoiceNumber: vrijednosti.invoiceNumber,
      invoiceDate: new Date(vrijednosti.invoiceDate).toISOString(),
      dueDate: new Date(vrijednosti.dueDate).toISOString(),
      customerName: vrijednosti.customerName,
      customerAddress: vrijednosti.customerAddress,
      customerCity: vrijednosti.customerCity,
      customerCountry: vrijednosti.customerCountry,
      customerTaxId: vrijednosti.customerTaxId,
      customerId: vrijednosti.customerId,
      currency: vrijednosti.currency,
      notes: vrijednosti.notes,
      status: vrijednosti.status,
      items: vrijednosti.items,
    };

    this.spremanje = true;
    const zahtjev = this.fakturaId
      ? this.dataService.azurirajFakturuUsluge(this.fakturaId, payload)
      : this.dataService.kreirajFakturuUsluge(payload);

    zahtjev
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.spremanje = false;
          this.toastrService.success('Faktura uspješno sačuvana.', 'Uspjeh');
          this.router.navigate(['/pages/fakturisanje-usluga', res.id]);
        },
        error: (err) => {
          this.spremanje = false;
          this.toastrService.danger(err.error?.poruka || 'Greška pri spremanju fakture.', 'Greška');
        }
      });
  }
}
