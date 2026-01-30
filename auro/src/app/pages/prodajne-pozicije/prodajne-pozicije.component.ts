import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import * as FileSaver from 'file-saver';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DataService } from '../../@core/utils/data.service';
import { ProdajnaPozicija, ProdajniLayout, ProdajnePozicijeResponse, ProdavnicaOption } from '../../@core/data/prodajne-pozicije';

interface TipStatistika {
  tip: string;
  broj: number;
  zauzetaPovrsina: number;
  vrijednost: number;
  ucesce: number;
}

interface NazivStatistika {
  naziv: string;
  broj: number;
  vrijednost: number;
}

interface ProdajnePozicijeReportFilters {
  search: string;
  tip: string;
  odjel: string;
  trgovac: string;
  trader: string;
  status: 'ALL' | 'Zauzeta' | 'Slobodna';
  zakupOd: string;
  zakupDo: string;
}

@Component({
  selector: 'ngx-prodajne-pozicije',
  templateUrl: './prodajne-pozicije.component.html',
  styleUrls: ['./prodajne-pozicije.component.scss']
})
export class ProdajnePozicijeComponent implements OnInit {
  prodavnice: ProdavnicaOption[] = [];
  odabranaProdavnicaId?: number;
  layout: ProdajniLayout | null = null;
  pozicije: ProdajnaPozicija[] = [];
  loading = false;
  editorLayout: ProdajniLayout | null = null;
  editorPozicije: ProdajnaPozicija[] = [];
  showEditor = false;
  ukupnoPozicija = 0;
  zauzetoPozicija = 0;
  slobodnoPozicija = 0;
  isticeUskoroPozicija = 0;
  vrijednostZakupaUkupno = 0;

  ukupnaPovrsina = 0;
  zauzetaPovrsina = 0;
  slobodnaPovrsina = 0;
  iskoristenost = 0;
  statistikaPoTipu: TipStatistika[] = [];
  statistikaPoNazivu: NazivStatistika[] = [];
  statistikaPoTipuPage = 1;
  statistikaPoTipuPageSize = 5;
  totalStatistikaPoTipuPages = 1;
  paginatedStatistikaPoTipu: TipStatistika[] = [];
  statistikaPoNazivuPage = 1;
  statistikaPoNazivuPageSize = 5;
  totalStatistikaPoNazivuPages = 1;
  paginatedStatistikaPoNazivu: NazivStatistika[] = [];
  showIzvjestajiModal = false;
  reportFilters: ProdajnePozicijeReportFilters = {
    search: '',
    tip: '',
    odjel: '',
    trgovac: '',
    trader: '',
    status: 'ALL',
    zakupOd: '',
    zakupDo: ''
  };
  reportOdjeli = [
    'Pakirana',
    'Svježa',
    'Neprehrana 1',
    'Neprehrana 2',
    'Delikates',
    'Gastro',
    'Piće i grickalice',
    'Voće i povrće',
    'Mesnica',
    'Cigarete i duhanski proizvodi',
    'Neprehrana svježa',
    'Neprehrana prehrana',
    'Neprehrana prehrana svježa',
    'Prehrana svježa'
  ];

  constructor(
    private readonly dataService: DataService,
    private readonly toastrService: NbToastrService
  ) {}

  ngOnInit(): void {
    this.ucitajProdavnice();
  }

  ucitajProdavnice(): void {
    this.loading = true;
    this.dataService.preuzmiProdavniceZaProdajnePozicije().subscribe({
      next: (stores) => {
        this.prodavnice = stores;
        this.loading = false;
        if (!this.odabranaProdavnicaId) {
          this.ucitajSvePozicije();
        }
      },
      error: () => {
        this.loading = false;
        this.toastrService.danger('Greška pri učitavanju prodavnica.', 'Prodajne pozicije');
      }
    });
  }

  private ucitajSvePozicije(): void {
    if (!this.prodavnice.length) {
      this.layout = null;
      this.pozicije = [];
      this.osvjeziEditor();
      this.izracunajStatistiku();
      return;
    }

    this.loading = true;
    const requests = this.prodavnice.map((prodavnica) =>
      this.dataService.preuzmiProdajnePozicije(prodavnica.id).pipe(
        map((response) => response.pozicije ?? []),
        catchError(() => of([]))
      )
    );

    forkJoin(requests).subscribe({
      next: (pozicijePoProdavnici: ProdajnaPozicija[][]) => {
        this.layout = null;
        this.pozicije = pozicijePoProdavnici.reduce<ProdajnaPozicija[]>(
          (acc, pozicije) => acc.concat(pozicije),
          []
        );
        this.osvjeziEditor();
        this.izracunajStatistiku();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastrService.danger('Greška pri učitavanju prodajnih pozicija.', 'Prodajne pozicije');
      }
    });
  }

  onProdavnicaChange(): void {
    if (!this.odabranaProdavnicaId) {
      return;
    }

    this.ucitajLayout();
  }

  ucitajLayout(): void {
    if (!this.odabranaProdavnicaId) {
      return;
    }

    this.loading = true;
    this.dataService.preuzmiProdajnePozicije(this.odabranaProdavnicaId).subscribe({
      next: (response: ProdajnePozicijeResponse) => {
        this.layout = response.layout ?? null;
        this.pozicije = response.pozicije ?? [];
        this.osvjeziEditor();
        this.izracunajStatistiku();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastrService.danger('Greška pri učitavanju layouta.', 'Prodajne pozicije');
      }
    });
  }

  private osvjeziEditor(): void {
    if (!this.odabranaProdavnicaId) {
      this.editorLayout = null;
      this.editorPozicije = [];
      this.showEditor = false;
      return;
    }

    this.editorLayout = this.layout
      ? { ...this.layout }
      : {
        sirina: 20,
        duzina: 20,
        prodavnicaId: this.odabranaProdavnicaId,
        backgroundFileName: null,
        backgroundContentType: null,
        backgroundData: null,
        backgroundRotation: 0
      } as ProdajniLayout;

    this.editorPozicije = this.pozicije.map(pozicija => ({ ...pozicija }));
    
    this.showEditor = false;
    setTimeout(() => {
      this.showEditor = true;
    }, 0);
  }

  onSacuvajLayout(result: { layout: ProdajniLayout; pozicije: ProdajnaPozicija[] }): void {
    this.spremiLayout(result.layout, result.pozicije);
  }

  private spremiLayout(layout: ProdajniLayout, pozicije: ProdajnaPozicija[]): void {
    if (!this.odabranaProdavnicaId) {
      return;
    }

    this.loading = true;
    this.dataService.spremiProdajnePozicije(this.odabranaProdavnicaId, {
      sirina: layout.sirina,
      duzina: layout.duzina,
      backgroundFileName: layout.backgroundFileName ?? null,
      backgroundContentType: layout.backgroundContentType ?? null,
      backgroundData: layout.backgroundData ?? null,
      backgroundRotation: layout.backgroundRotation ?? 0,
      pozicije
    }).subscribe({
      next: (response) => {
        this.layout = response.layout ?? layout;
        this.pozicije = response.pozicije ?? pozicije;
        this.osvjeziEditor();
        this.izracunajStatistiku();
        this.loading = false;
        this.toastrService.success('Layout je uspješno sačuvan.', 'Prodajne pozicije');
      },
      error: () => {
        this.loading = false;
        this.toastrService.danger('Greška pri spremanju layouta.', 'Prodajne pozicije');
      }
    });
  }

  exportujExcel(): void {
    if (!this.odabranaProdavnicaId) {
      this.toastrService.warning('Odaberite prodavnicu prije exporta.', 'Prodajne pozicije');
      return;
    }

    this.dataService.exportujProdajnePozicije(this.odabranaProdavnicaId).subscribe({
      next: (blob) => {
        FileSaver.saveAs(blob, this.generisiNazivFajla());
      },
      error: () => {
        this.toastrService.danger('Greška pri exportu u Excel.', 'Prodajne pozicije');
      }
    });
  }

  otvoriIzvjestaje(): void {
    if (!this.odabranaProdavnicaId) {
      this.toastrService.warning('Odaberite prodavnicu prije pregleda izvještaja.', 'Prodajne pozicije');
      return;
    }
    this.showIzvjestajiModal = true;
  }

  zatvoriIzvjestaje(): void {
    this.showIzvjestajiModal = false;
  }

  get reportTipovi(): string[] {
    return Array.from(new Set(this.pozicije.map((pozicija) => pozicija.tip))).sort((a, b) => a.localeCompare(b));
  }

  get filtriranePozicije(): ProdajnaPozicija[] {
    const search = this.reportFilters.search.trim().toLowerCase();
    const tip = this.reportFilters.tip.trim().toLowerCase();
    const odjel = this.reportFilters.odjel.trim().toLowerCase();
    const trgovac = this.reportFilters.trgovac.trim().toLowerCase();
    const trader = this.reportFilters.trader.trim().toLowerCase();
    const status = this.reportFilters.status;
    const zakupOd = this.reportFilters.zakupOd ? new Date(this.reportFilters.zakupOd) : null;
    const zakupDo = this.reportFilters.zakupDo ? new Date(this.reportFilters.zakupDo) : null;

    return this.pozicije.filter((pozicija) => {
      if (search) {
        const searchable = `${pozicija.brojPozicije ?? ''} ${pozicija.naziv ?? ''} ${pozicija.trgovac ?? ''} ${pozicija.trader ?? ''}`
          .toLowerCase();
        if (!searchable.includes(search)) {
          return false;
        }
      }

      if (tip && (pozicija.tip ?? '').toLowerCase() !== tip) {
        return false;
      }

      if (odjel && (pozicija.zona ?? '').toLowerCase() !== odjel) {
        return false;
      }

      if (trgovac && !(pozicija.trgovac ?? '').toLowerCase().includes(trgovac)) {
        return false;
      }

      if (trader && !(pozicija.trader ?? '').toLowerCase().includes(trader)) {
        return false;
      }

      const isZauzeta = Boolean((pozicija.trgovac ?? '').trim() || (pozicija.trader ?? '').trim());
      if (status === 'Zauzeta' && !isZauzeta) {
        return false;
      }
      if (status === 'Slobodna' && isZauzeta) {
        return false;
      }

      if (zakupOd || zakupDo) {
        if (!pozicija.zakupDo) {
          return false;
        }
        const zakupDatum = new Date(pozicija.zakupDo);
        if (zakupOd && zakupDatum < zakupOd) {
          return false;
        }
        if (zakupDo && zakupDatum > zakupDo) {
          return false;
        }
      }

      return true;
    });
  }

  exportujNapredniExcel(): void {
    if (!this.odabranaProdavnicaId) {
      return;
    }

    const params = {
      search: this.reportFilters.search,
      tip: this.reportFilters.tip || undefined,
      odjel: this.reportFilters.odjel || undefined,
      trgovac: this.reportFilters.trgovac || undefined,
      trader: this.reportFilters.trader || undefined,
      status: this.reportFilters.status !== 'ALL' ? this.reportFilters.status : undefined,
      zakupOd: this.reportFilters.zakupOd || undefined,
      zakupDo: this.reportFilters.zakupDo || undefined
    };

    this.dataService.exportujProdajnePozicijeNapredni(this.odabranaProdavnicaId, params).subscribe({
      next: (blob) => {
        FileSaver.saveAs(blob, this.generisiNazivFajla());
      },
      error: () => {
        this.toastrService.danger('Greška pri exportu naprednog izvještaja.', 'Prodajne pozicije');
      }
    });
  }

  private generisiNazivFajla(): string {
    const store = this.prodavnice.find(p => p.id === this.odabranaProdavnicaId);
    const naziv = store ? store.name.replace(/\s+/g, '_') : 'Prodavnica';
    const datum = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `ProdajnePozicije_${naziv}_${datum}.xlsx`;
  }

  private izracunajStatistiku(): void {
    const sirina = this.layout?.sirina ?? 0;
    const duzina = this.layout?.duzina ?? 0;
    this.ukupnaPovrsina = sirina * duzina;
    this.zauzetaPovrsina = this.pozicije.reduce((sum, pozicija) => sum + pozicija.sirina * pozicija.duzina, 0);
    this.slobodnaPovrsina = Math.max(this.ukupnaPovrsina - this.zauzetaPovrsina, 0);
    this.iskoristenost = this.ukupnaPovrsina > 0
      ? Math.round((this.zauzetaPovrsina / this.ukupnaPovrsina) * 100 * 100) / 100
      : 0;

    this.ukupnoPozicija = this.pozicije.length;
    this.zauzetoPozicija = this.pozicije.filter((pozicija) => Boolean(pozicija.trgovac || pozicija.trader)).length;
    this.slobodnoPozicija = Math.max(this.ukupnoPozicija - this.zauzetoPozicija, 0);
    this.isticeUskoroPozicija = this.pozicije.filter((pozicija) => this.jeUgovorUskoro(pozicija.zakupDo)).length;
    this.vrijednostZakupaUkupno = this.pozicije.reduce(
      (sum, pozicija) => sum + (pozicija.vrijednostZakupa ?? 0),
      0
    );

    const grupisano: Record<string, TipStatistika> = {};
    this.pozicije.forEach((pozicija) => {
      if (!grupisano[pozicija.tip]) {
        grupisano[pozicija.tip] = {
          tip: pozicija.tip,
          broj: 0,
          zauzetaPovrsina: 0,
          vrijednost: 0,
          ucesce: 0
        };
      }

      grupisano[pozicija.tip].broj += 1;
      grupisano[pozicija.tip].zauzetaPovrsina += pozicija.sirina * pozicija.duzina;
      grupisano[pozicija.tip].vrijednost += pozicija.vrijednostZakupa ?? 0;
    });

    this.statistikaPoTipu = Object.values(grupisano).map(stat => ({
      ...stat,
      ucesce: this.ukupnaPovrsina > 0
        ? Math.round((stat.zauzetaPovrsina / this.ukupnaPovrsina) * 100 * 100) / 100
        : 0
    }));

    const grupisanoPoNazivu: Record<string, NazivStatistika> = {};
    this.pozicije.forEach((pozicija) => {
      const naziv = pozicija.naziv || pozicija.brojPozicije || 'Bez naziva';
      if (!grupisanoPoNazivu[naziv]) {
        grupisanoPoNazivu[naziv] = {
          naziv,
          broj: 0,
          vrijednost: 0
        };
      }

      grupisanoPoNazivu[naziv].broj += 1;
      grupisanoPoNazivu[naziv].vrijednost += pozicija.vrijednostZakupa ?? 0;
    });

    this.statistikaPoNazivu = Object.values(grupisanoPoNazivu);
    this.statistikaPoTipuPage = 1;
    this.statistikaPoNazivuPage = 1;
    this.updateTipPagination();
    this.updateNazivPagination();
  }

  private jeUgovorUskoro(zakupDo?: string | null): boolean {
    if (!zakupDo) {
      return false;
    }

    const parsed = new Date(zakupDo);
    if (Number.isNaN(parsed.getTime())) {
      return false;
    }

    const granica = new Date();
    granica.setDate(granica.getDate() + 30);
    return parsed <= granica;
  }

  goToStatistikaPoTipuPage(direction: 'prev' | 'next'): void {
    if (direction === 'prev' && this.statistikaPoTipuPage > 1) {
      this.statistikaPoTipuPage -= 1;
    }

    if (direction === 'next' && this.statistikaPoTipuPage < this.totalStatistikaPoTipuPages) {
      this.statistikaPoTipuPage += 1;
    }

    this.updateTipPagination();
  }

  goToStatistikaPoNazivuPage(direction: 'prev' | 'next'): void {
    if (direction === 'prev' && this.statistikaPoNazivuPage > 1) {
      this.statistikaPoNazivuPage -= 1;
    }

    if (direction === 'next' && this.statistikaPoNazivuPage < this.totalStatistikaPoNazivuPages) {
      this.statistikaPoNazivuPage += 1;
    }

    this.updateNazivPagination();
  }

  private updateTipPagination(): void {
    const totalRows = this.statistikaPoTipu.length;
    this.totalStatistikaPoTipuPages = Math.max(Math.ceil(totalRows / this.statistikaPoTipuPageSize), 1);
    this.statistikaPoTipuPage = Math.min(this.statistikaPoTipuPage, this.totalStatistikaPoTipuPages);
    const startIndex = (this.statistikaPoTipuPage - 1) * this.statistikaPoTipuPageSize;
    this.paginatedStatistikaPoTipu = this.statistikaPoTipu.slice(startIndex, startIndex + this.statistikaPoTipuPageSize);
  }

  private updateNazivPagination(): void {
    const totalRows = this.statistikaPoNazivu.length;
    this.totalStatistikaPoNazivuPages = Math.max(Math.ceil(totalRows / this.statistikaPoNazivuPageSize), 1);
    this.statistikaPoNazivuPage = Math.min(this.statistikaPoNazivuPage, this.totalStatistikaPoNazivuPages);
    const startIndex = (this.statistikaPoNazivuPage - 1) * this.statistikaPoNazivuPageSize;
    this.paginatedStatistikaPoNazivu = this.statistikaPoNazivu.slice(startIndex, startIndex + this.statistikaPoNazivuPageSize);
  }
}
