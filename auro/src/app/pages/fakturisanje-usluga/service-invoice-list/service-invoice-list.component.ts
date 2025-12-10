import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PagedResult, ServiceInvoiceListItem } from '../../../@core/data/service-invoice';
import { DataService } from '../../../@core/utils/data.service';

@Component({
  selector: 'ngx-service-invoice-list',
  templateUrl: './service-invoice-list.component.html',
  styleUrls: ['./service-invoice-list.component.scss']
})
export class ServiceInvoiceListComponent implements OnInit, OnDestroy {
  fakture: ServiceInvoiceListItem[] = [];
  ukupnoZapisa = 0;
  loading = false;
  filterForma: FormGroup;
  page = 1;
  pageSize = 10;
  private destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly dataService: DataService,
    private readonly toastrService: NbToastrService,
    private readonly router: Router,
  ) {
    this.filterForma = this.fb.group({
      datumOd: [''],
      datumDo: [''],
      kupac: [''],
      brojFakture: ['']
    });
  }

  ngOnInit(): void {
    this.ucitajFakture();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ucitajFakture(): void {
    this.loading = true;
    const vrijednosti = this.filterForma.value;

    const params = {
      datumOd: vrijednosti.datumOd ? new Date(vrijednosti.datumOd).toISOString() : undefined,
      datumDo: vrijednosti.datumDo ? new Date(vrijednosti.datumDo).toISOString() : undefined,
      kupac: vrijednosti.kupac,
      brojFakture: vrijednosti.brojFakture,
      pageNumber: this.page,
      pageSize: this.pageSize
    };

    this.dataService.preuzmiFaktureUsluga(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PagedResult<ServiceInvoiceListItem>) => {
          this.fakture = response.items;
          this.ukupnoZapisa = response.totalCount;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.toastrService.danger(err.error?.poruka || 'Greška pri učitavanju faktura.', 'Greška');
        }
      });
  }

  resetujFilter(): void {
    this.filterForma.reset();
    this.page = 1;
    this.ucitajFakture();
  }

  otvoriFakturu(id: number): void {
    this.router.navigate(['/pages/fakturisanje-usluga', id]);
  }

  kreirajNovu(): void {
    this.router.navigate(['/pages/fakturisanje-usluga/novo']);
  }

  stampajFakturu(id: number): void {
    window.open(`/pages/fakturisanje-usluga/${id}/print`, '_blank');
  }

  promijeniStranicu(delta: number): void {
    const nova = this.page + delta;
    if (nova < 1 || (this.ukupnoZapisa && nova > Math.ceil(this.ukupnoZapisa / this.pageSize))) {
      return;
    }
    this.page = nova;
    this.ucitajFakture();
  }
}
