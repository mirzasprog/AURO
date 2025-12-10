import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ServiceInvoice } from '../../../@core/data/service-invoice';
import { DataService } from '../../../@core/utils/data.service';

@Component({
  selector: 'ngx-service-invoice-print',
  templateUrl: './service-invoice-print.component.html',
  styleUrls: ['./service-invoice-print.component.scss']
})
export class ServiceInvoicePrintComponent implements OnInit, OnDestroy {
  faktura?: ServiceInvoice;
  loading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly dataService: DataService,
    private readonly toastrService: NbToastrService,
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      return;
    }
    this.ucitajFakturu(id);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ucitajFakturu(id: number): void {
    this.loading = true;
    this.dataService.preuzmiFakturuUsluge(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (faktura) => {
          this.faktura = faktura;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.toastrService.danger(err.error?.poruka || 'Greška pri preuzimanju fakture.', 'Greška');
        }
      });
  }

  stampaj(): void {
    window.print();
  }

  ukupnoBezPdv(): number {
    return this.faktura?.items?.reduce((acc, s) => acc + (s.quantity * s.unitPrice), 0) || 0;
  }

  ukupnoPdv(): number {
    return this.faktura?.items?.reduce((acc, s) => acc + (s.quantity * s.unitPrice * (s.taxRate ?? 0) / 100), 0) || 0;
  }

  ukupnoSaPdv(): number {
    return this.ukupnoBezPdv() + this.ukupnoPdv();
  }
}
