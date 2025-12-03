import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { DataService } from '../../@core/utils/data.service';
import { VikendAkcija } from '../../@core/data/vikend-akcija';
import { VikendAkcijeStavkeComponent } from './vikend-akcije-stavke/vikend-akcije-stavke.component';
import { VikendAkcijeStavkePregledComponent } from './vikend-akcije-stavke-pregled/vikend-akcije-stavke-pregled.component';
import { VikendAkcijaStavka } from '../../@core/data/vikend-akcija-stavka';

@Component({
  selector: 'ngx-vikend-akcije',
  templateUrl: './vikend-akcije.component.html',
  styleUrls: ['./vikend-akcije.component.scss']
})
export class VikendAkcijeComponent implements OnInit, OnDestroy {
  @ViewChild('adminZone') adminZone?: ElementRef<HTMLElement>;
  @ViewChild('excelInput') excelInput?: ElementRef<HTMLInputElement>;
  vikendAkcije: VikendAkcija[] = [];
  rola = '';
  brojProdavnice = '';
  loading = false;
  greska = '';
  kreiranjeLoading = false;
  uspjehPoruka = '';
  importPoruka = '';
  odabraniFajl?: File;
  odabranaAkcijaId = '';
  selektovanaAkcija?: VikendAkcija;
  selektovaneStavke: VikendAkcijaStavka[] = [];
  stavkeLoading = false;
  stavkeGreska = '';
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
    this.authService.onTokenChange()
      .pipe(takeUntil(this.destroy$))
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          const payload = token.getPayload();
          this.rola = payload["role"];
          this.brojProdavnice = payload["name"] ?? '';
        } else {
          this.rola = '';
          this.brojProdavnice = '';
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
          this.postaviOdabranuAkciju(podaci);
          this.loading = false;
        },
        error: (err) => {
          this.greska = err.error?.poruka ?? 'Greška pri preuzimanju vikend akcija.';
          this.loading = false;
        }
      });
  }

  otvoriPregledStavki(akcija: VikendAkcija): void {
    this.dialogService.open(VikendAkcijeStavkePregledComponent, {
      context: {
        vikendAkcijaId: akcija.uniqueId,
        naslov: akcija.opis ?? `Akcija #${akcija.id}`,
      },
      closeOnBackdropClick: false,
    });
  }

  otvoriAzuriranjeStavki(akcija: VikendAkcija): void {
    this.dialogService.open(VikendAkcijeStavkeComponent, {
      context: {
        vikendAkcijaId: akcija.uniqueId,
        naslov: akcija.opis ?? `Akcija #${akcija.id}`,
        rola: this.rola,
        brojProdavnice: this.brojProdavnice,
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

  prikaziAdminZonu(): boolean {
    return this.rola === 'uprava';
  }

  prikaziAkcijeKolonu(): boolean {
    return this.rola === 'uprava' || this.rola === 'prodavnica';
  }

  redKlasa(akcija: VikendAkcija): string {
    const status = this.izracunajStatus(akcija);

    switch (status) {
      case 'aktivno':
        return 'row-aktivno';
      case 'isteklo':
        return 'row-isteklo';
      case 'najava':
        return 'row-najava';
      default:
        return '';
    }
  }

  scrollToAdminZone(): void {
    const element = this.adminZone?.nativeElement;
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  kreirajAkciju(): void {
    this.ocistiPoruke();
    if (!this.novaAkcija.pocetak || !this.novaAkcija.kraj) {
      this.greska = 'Potrebno je unijeti datume početka i kraja.';
      return;
    }

    if (!this.odabraniFajl) {
      this.greska = 'Dodajte Excel fajl (.xlsx) sa artiklima za vikend akciju.';
      return;
    }

    this.kreiranjeLoading = true;
    const tijelo = {
      opis: this.novaAkcija.opis,
      pocetak: new Date(this.novaAkcija.pocetak).toISOString(),
      kraj: new Date(this.novaAkcija.kraj).toISOString()
    };

    this.dataService.kreirajVikendAkciju(tijelo)
      .pipe(
        switchMap((rezultat) => {
          this.odabranaAkcijaId = rezultat.uniqueId ?? '';
          return this.dataService.importujVikendArtikle(this.odabranaAkcijaId, this.odabraniFajl!);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (importRezultat: any) => {
          this.kreiranjeLoading = false;
          this.uspjehPoruka = `Akcija je kreirana. ID akcije: ${this.odabranaAkcijaId || 'N/A'}`;
          this.importPoruka = importRezultat?.poruka ?? 'Import artikala uspješno završen.';
          this.ocistiFormu();
          this.ucitajAkcije();
        },
        error: (err) => {
          this.kreiranjeLoading = false;
          this.greska = err.error?.poruka ?? 'Greška pri kreiranju vikend akcije ili importu artikala.';
        }
      });
  }

  zapamtiFajl(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target?.files && target.files.length) {
      this.odabraniFajl = target.files[0];
    } else {
      this.odabraniFajl = undefined;
    }
  }

  prikaziStavke(akcija: VikendAkcija): void {
    this.selektovanaAkcija = akcija;
    this.selektovaneStavke = [];
    this.stavkeGreska = '';
    this.stavkeLoading = true;
    this.dataService.preuzmiStavkeVikendAkcije(akcija.uniqueId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stavke) => {
          this.selektovaneStavke = stavke;
          this.stavkeLoading = false;
        },
        error: (err) => {
          this.stavkeLoading = false;
          this.stavkeGreska = err.error?.poruka ?? 'Greška prilikom učitavanja stavki.';
        }
      });
  }

  izracunajStatus(akcija?: VikendAkcija): string {
    if (!akcija) {
      return '';
    }

    const sada = new Date();
    const pocetak = new Date(akcija.pocetak);
    const kraj = new Date(akcija.kraj);

    if (isNaN(pocetak.getTime()) || isNaN(kraj.getTime())) {
      return (akcija.status ?? '').toLowerCase();
    }

    if (sada < pocetak) {
      return 'najava';
    }

    if (sada > kraj) {
      return 'isteklo';
    }

    return 'aktivno';
  }

  statusPrikaz(akcija: VikendAkcija): string {
    const status = this.izracunajStatus(akcija);
    if (!status) {
      return 'N/A';
    }

    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  jeAkcijaAktivna(akcija?: VikendAkcija): boolean {
    return this.izracunajStatus(akcija) === 'aktivno';
  }

  private ocistiPoruke(): void {
    this.uspjehPoruka = '';
    this.importPoruka = '';
    this.greska = '';
  }

  ocistiFormu(): void {
    this.novaAkcija = { opis: '', pocetak: '', kraj: '' };
    this.odabraniFajl = undefined;
    if (this.excelInput?.nativeElement) {
      this.excelInput.nativeElement.value = '';
    }
  }

  private postaviOdabranuAkciju(akcije: VikendAkcija[]): void {
    if (!akcije?.length) {
      this.odabranaAkcijaId = '';
      return;
    }

    const postojeci = akcije.find(a => a.uniqueId === this.odabranaAkcijaId);
    if (postojeci) {
      return;
    }

    const najnovija = [...akcije]
      .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))[0];

    this.odabranaAkcijaId = najnovija?.uniqueId ?? '';
  }
}
