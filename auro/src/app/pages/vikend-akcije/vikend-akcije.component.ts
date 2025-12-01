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
  kreiranjeLoading = false;
  importLoading = false;
  uspjehPoruka = '';
  importPoruka = '';
  odabraniFajl?: File;
  akcijaIdZaImport = '';
  novaAkcija = {
    opis: '',
    pocetak: '',
    kraj: ''
  };
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

  kreirajAkciju(): void {
    this.ocistiPoruke();
    if (!this.novaAkcija.pocetak || !this.novaAkcija.kraj) {
      this.greska = 'Potrebno je unijeti datume početka i kraja.';
      return;
    }

    this.kreiranjeLoading = true;
    const tijelo = {
      opis: this.novaAkcija.opis,
      pocetak: new Date(this.novaAkcija.pocetak).toISOString(),
      kraj: new Date(this.novaAkcija.kraj).toISOString()
    };

    this.dataService.kreirajVikendAkciju(tijelo)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (rezultat) => {
          this.kreiranjeLoading = false;
          this.akcijaIdZaImport = rezultat.uniqueId ?? '';
          this.ocistiFormu();
          this.ucitajAkcije();
          this.uspjehPoruka = `Akcija je kreirana. ID akcije: ${this.akcijaIdZaImport || rezultat.id}`;
        },
        error: (err) => {
          this.kreiranjeLoading = false;
          this.greska = err.error?.poruka ?? 'Greška pri kreiranju vikend akcije.';
        }
      });
  }

  zapamtiFajl(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target?.files && target.files.length) {
      this.odabraniFajl = target.files[0];
    }
  }

  importujArtikle(): void {
    this.importPoruka = '';
    this.greska = '';
    if (!this.akcijaIdZaImport) {
      this.greska = 'Unesite ID akcije za koju importujete artikle.';
      return;
    }
    if (!this.odabraniFajl) {
      this.greska = 'Odaberite Excel fajl (.xlsx) sa podacima.';
      return;
    }

    this.importLoading = true;
    this.dataService.importujVikendArtikle(this.akcijaIdZaImport, this.odabraniFajl)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (rezultat: any) => {
          this.importLoading = false;
          this.importPoruka = rezultat?.poruka ?? 'Import uspješno završen.';
          this.ucitajAkcije();
        },
        error: (err) => {
          this.importLoading = false;
          this.greska = err.error?.poruka ?? 'Greška pri importu artikala.';
        }
      });
  }

  private ocistiPoruke(): void {
    this.uspjehPoruka = '';
    this.importPoruka = '';
    this.greska = '';
  }

  private ocistiFormu(): void {
    this.novaAkcija = { opis: '', pocetak: '', kraj: '' };
  }
}
