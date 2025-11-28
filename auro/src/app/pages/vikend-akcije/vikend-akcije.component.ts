import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataService } from '../../@core/utils/data.service';
import { VikendAkcija } from '../../@core/data/vikend-akcija';
import { VikendAkcijeStavkeComponent } from './vikend-akcije-stavke/vikend-akcije-stavke.component';

@Component({
  selector: 'ngx-vikend-akcije',
  templateUrl: './vikend-akcije.component.html',
  styleUrls: ['./vikend-akcije.component.scss']
})
export class VikendAkcijeComponent implements OnInit, OnDestroy {
  vikendAkcije: VikendAkcija[] = [];
  rola = '';
  loading = false;
  greska = '';
  private destroy$ = new Subject<void>();

  constructor(
    private readonly dataService: DataService,
    private readonly dialogService: NbDialogService,
    private readonly authService: NbAuthService,
  ) { }

  ngOnInit(): void {
    this.authService.getToken()
      .pipe(takeUntil(this.destroy$))
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.rola = token.getPayload()["role"];
        }
        this.ucitajAkcije();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ucitajAkcije(): void {
    this.loading = true;
    this.greska = '';
    this.dataService.preuzmiVikendAkcije()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (podaci) => {
          this.vikendAkcije = podaci;
          this.loading = false;
        },
        error: (err) => {
          this.greska = err.error?.poruka ?? 'Greška pri preuzimanju vikend akcija.';
          this.loading = false;
        }
      });
  }

  otvoriStavke(akcija: VikendAkcija): void {
    this.dialogService.open(VikendAkcijeStavkeComponent, {
      context: {
        vikendAkcijaId: akcija.id,
        naslov: akcija.opis ?? `Akcija #${akcija.id}`,
        rola: this.rola,
      },
      closeOnBackdropClick: false,
    }).onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe((azurirano: boolean) => {
        if (azurirano) {
          this.ucitajAkcije();
        }
      });
  }

  prikaziAkcijeKolonu(): boolean {
    return this.rola === 'uprava';
  }

  redKlasa(akcija: VikendAkcija): string {
    if (!akcija) {
      return '';
    }
    const sada = new Date();
    const kraj = new Date(akcija.kraj);
    if ((akcija.status ?? '').toLowerCase().includes('aktivna')) {
      return 'row-aktivna';
    }
    if (kraj < sada) {
      return 'row-istaknuta';
    }
    return 'row-najava';
  }
}
