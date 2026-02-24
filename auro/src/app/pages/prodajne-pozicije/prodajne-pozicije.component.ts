import { Component, OnInit } from '@angular/core';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import * as FileSaver from 'file-saver';
import { DataService } from '../../@core/utils/data.service';
import { ProdajnaPozicija, ProdajniLayout, ProdajnePozicijeResponse, ProdavnicaOption } from '../../@core/data/prodajne-pozicije';
import { DodajPozicijuModalComponent } from './dodaj-poziciju-modal/dodaj-poziciju-modal.component';

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
  isticeUskoro: boolean;
  samoSlobodne: boolean;
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
  
  // Editor varijable
  editorLayout: ProdajniLayout | null = null;
  editorPozicije: ProdajnaPozicija[] = [];
  showEditor = false;
  
  // Search / Autocomplete varijable
  prodavnicaInputString = ''; 
  autocompleteOpened = false; 
  
  // KPI metrics
  ukupnoPozicija = 0;
  zauzetoPozicija = 0;
  slobodnoPozicija = 0;
  isticeUskoroPozicija = 0;
  vrijednostZakupaUkupno = 0;

  ukupnaPovrsina = 0;
  zauzetaPovrsina = 0;
  slobodnaPovrsina = 0;
  iskoristenost = 0;
  
  // Statistika tables
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
  private readonly layoutCache = new Map<number, ProdajnePozicijeResponse>();
  
  // Reports modal
  showIzvjestajiModal = false;
  reportFilters: ProdajnePozicijeReportFilters = {
    search: '',
    tip: '',
    odjel: '',
    trgovac: '',
    trader: '',
    status: 'ALL',
    zakupOd: '',
    zakupDo: '',
    isticeUskoro: false,
    samoSlobodne: false
  };
  
  reportOdjeli = [
    'Pakirana', 'Svježa', 'Neprehrana 1', 'Neprehrana 2', 'Delikates',
    'Gastro', 'Piće i grickalice', 'Voće i povrće', 'Mesnica',
    'Cigarete i duhanski proizvodi', 'Neprehrana svježa',
    'Neprehrana prehrana', 'Neprehrana prehrana svježa', 'Prehrana svježa'
  ];

  constructor(
    private readonly dataService: DataService,
    private readonly toastrService: NbToastrService,
    private readonly dialogService: NbDialogService
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
      },
      error: () => {
        this.loading = false;
        this.toastrService.danger('Greška pri učitavanju prodavnica.', 'Prodajne pozicije');
      }
    });
  }

  // --- AUTOCOMPLETE LOGIKA ---
  get filtrovaneProdavnice(): ProdavnicaOption[] {
    return this.prodavnice;
  }

  onInputFocus(): void {
    this.autocompleteOpened = true;
  }

  onProdavnicaSelect(selectedName: string): void {
    const store = this.prodavnice.find(p => p.name === selectedName);
    
    if (store) {
      this.odabranaProdavnicaId = store.id;
      this.prodavnicaInputString = store.name;
      this.autocompleteOpened = false;
      this.ucitajLayout();
    } else {
      this.odabranaProdavnicaId = undefined;
      this.resetState();
    }
  }

  resetState(): void {
    this.layout = null;
    this.pozicije = [];
    this.osvjeziEditor();
    this.izracunajStatistiku();
  }

  ucitajLayout(): void {
    if (!this.odabranaProdavnicaId) return;

    const cachedResponse = this.layoutCache.get(this.odabranaProdavnicaId);
    if (cachedResponse) {
      this.primijeniLayoutResponse(cachedResponse);
      return;
    }

    this.loading = true;
    this.dataService.preuzmiProdajnePozicije(this.odabranaProdavnicaId).subscribe({
      next: (response: ProdajnePozicijeResponse) => {
        this.layoutCache.set(this.odabranaProdavnicaId!, response);
        this.primijeniLayoutResponse(response);
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
    if (!this.odabranaProdavnicaId) return;

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
        this.layoutCache.set(this.odabranaProdavnicaId!, response);
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
      next: (blob) => FileSaver.saveAs(blob, this.generisiNazivFajla()),
      error: () => this.toastrService.danger('Greška pri exportu u Excel.', 'Prodajne pozicije')
    });
  }

  otvoriIzvjestaje(): void {
    if (!this.odabranaProdavnicaId) {
      this.toastrService.warning('Odaberite prodavnicu.', 'Prodajne pozicije');
      return;
    }
    this.showIzvjestajiModal = true;
  }

  zatvoriIzvjestaje(): void {
    this.showIzvjestajiModal = false;
  }

  otvoriDodajPozicijuModal(): void {
    if (!this.odabranaProdavnicaId || !this.layout) {
      this.toastrService.warning('Odaberite prodavnicu prije dodavanja.', 'Prodajne pozicije');
      return;
    }

    this.dialogService.open(DodajPozicijuModalComponent, {
      context: {
        layout: this.layout,
        postojecePozicije: this.pozicije
      },
      closeOnBackdropClick: false,
      closeOnEsc: true
    }).onClose.subscribe((novaPozicija: ProdajnaPozicija | null) => {
      if (novaPozicija) {
        this.pozicije.push(novaPozicija);
        this.spremiLayout(this.layout!, this.pozicije);
      }
    });
  }

  // Helperi za izvještaje i filtriranje
  get reportTipovi(): string[] {
    return Array.from(new Set(this.pozicije.map((p) => p.tip))).sort();
  }

  primijeniReportFiltere(): void {
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

    return this.pozicije.filter((p) => {
      if (search) {
        const searchable = `${p.brojPozicije ?? ''} ${p.naziv ?? ''} ${p.nazivArtikla ?? ''} ${p.trgovac ?? ''} ${p.trader ?? ''}`.toLowerCase();
        if (!searchable.includes(search)) return false;
      }
      if (tip && (p.tip ?? '').toLowerCase() !== tip) return false;
      if (odjel && (p.zona ?? '').toLowerCase() !== odjel) return false;
      if (trgovac && !(p.trgovac ?? '').toLowerCase().includes(trgovac)) return false;
      if (trader && !(p.trader ?? '').toLowerCase().includes(trader)) return false;

      const isZauzeta = Boolean((p.trgovac ?? '').trim() || (p.trader ?? '').trim());
      if (status === 'Zauzeta' && !isZauzeta) return false;
      if (status === 'Slobodna' && isZauzeta) return false;
      if (this.reportFilters.samoSlobodne && isZauzeta) return false;
      if (this.reportFilters.isticeUskoro && !this.jeUgovorUskoro(p.zakupDo, 60)) return false;

      if (zakupOd || zakupDo) {
        if (!p.zakupDo) return false;
        const d = new Date(p.zakupDo);
        if (zakupOd && d < zakupOd) return false;
        if (zakupDo && d > zakupDo) return false;
      }
      return true;
    });
  }

  get filtriraneEditorPozicije(): ProdajnaPozicija[] {
    return this.editorPozicije;
  }

  exportujNapredniExcel(): void {
    if (!this.odabranaProdavnicaId) return;
    const params = {
      search: this.reportFilters.search,
      tip: this.reportFilters.tip || undefined,
      odjel: this.reportFilters.odjel || undefined,
      trgovac: this.reportFilters.trgovac || undefined,
      trader: this.reportFilters.trader || undefined,
      status: this.reportFilters.status !== 'ALL' ? this.reportFilters.status : undefined,
      zakupOd: this.reportFilters.zakupOd || undefined,
      zakupDo: this.reportFilters.zakupDo || undefined,
      isticeUskoro: this.reportFilters.isticeUskoro || undefined,
      samoSlobodne: this.reportFilters.samoSlobodne || undefined
    };
    this.dataService.exportujProdajnePozicijeNapredni(this.odabranaProdavnicaId, params).subscribe({
      next: (blob) => FileSaver.saveAs(blob, this.generisiNazivFajla()),
      error: () => this.toastrService.danger('Greška pri exportu.', 'Prodajne pozicije')
    });
  }

  private generisiNazivFajla(): string {
    const store = this.prodavnice.find(p => p.id === this.odabranaProdavnicaId);
    const naziv = store ? store.name.replace(/\s+/g, '_') : 'Prodavnica';
    return `ProdajnePozicije_${naziv}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  }

  // Statistika Helpers
  private izracunajStatistiku(): void {
    const sirina = this.layout?.sirina ?? 0;
    const duzina = this.layout?.duzina ?? 0;
    this.ukupnaPovrsina = sirina * duzina;
    this.zauzetaPovrsina = this.pozicije.reduce((sum, p) => sum + p.sirina * p.duzina, 0);
    this.slobodnaPovrsina = Math.max(this.ukupnaPovrsina - this.zauzetaPovrsina, 0);
    this.iskoristenost = this.ukupnaPovrsina > 0 ? Math.round((this.zauzetaPovrsina / this.ukupnaPovrsina) * 10000) / 100 : 0;

    this.ukupnoPozicija = this.pozicije.length;
    this.zauzetoPozicija = this.pozicije.filter(p => Boolean(p.trgovac || p.trader)).length;
    this.slobodnoPozicija = Math.max(this.ukupnoPozicija - this.zauzetoPozicija, 0);
    this.isticeUskoroPozicija = this.pozicije.filter(p => this.jeUgovorUskoro(p.zakupDo, 30)).length;
    this.vrijednostZakupaUkupno = this.pozicije.reduce((sum, p) => sum + (p.vrijednostZakupa ?? 0), 0);
    const grupisano: Record<string, TipStatistika> = {};
    this.pozicije.forEach(p => {
      if (!grupisano[p.tip]) grupisano[p.tip] = { tip: p.tip, broj: 0, zauzetaPovrsina: 0, vrijednost: 0, ucesce: 0 };
      grupisano[p.tip].broj++;
      grupisano[p.tip].zauzetaPovrsina += p.sirina * p.duzina;
      grupisano[p.tip].vrijednost += p.vrijednostZakupa ?? 0;
    });
    this.statistikaPoTipu = Object.values(grupisano).map(s => ({
       ...s, ucesce: this.ukupnaPovrsina > 0 ? Math.round((s.zauzetaPovrsina/this.ukupnaPovrsina)*10000)/100 : 0 
    })).sort((a, b) => b.broj - a.broj);
    
    const grupisanoPoNazivu: Record<string, NazivStatistika> = {};
    this.pozicije.forEach(p => {
      const naziv = p.naziv || p.brojPozicije || 'Bez naziva';
      if (!grupisanoPoNazivu[naziv]) grupisanoPoNazivu[naziv] = { naziv, broj: 0, vrijednost: 0 };
      grupisanoPoNazivu[naziv].broj++;
      grupisanoPoNazivu[naziv].vrijednost += p.vrijednostZakupa ?? 0;
    });
    this.statistikaPoNazivu = Object.values(grupisanoPoNazivu).sort((a, b) => b.broj - a.broj);
    
    this.updateTipPagination();
    this.updateNazivPagination();
  }

  private jeUgovorUskoro(zakupDo?: string | null, dana: number = 30): boolean {
    if (!zakupDo) return false;
    const parsed = new Date(zakupDo);
    if (Number.isNaN(parsed.getTime())) return false;
    const granica = new Date();
    granica.setDate(granica.getDate() + dana);
    return parsed <= granica;
  }

  // Pagination Methods
  goToStatistikaPoTipuPage(dir: 'prev' | 'next'): void {
    if (dir === 'prev' && this.statistikaPoTipuPage > 1) this.statistikaPoTipuPage--;
    if (dir === 'next' && this.statistikaPoTipuPage < this.totalStatistikaPoTipuPages) this.statistikaPoTipuPage++;
    this.updateTipPagination();
  }
  goToStatistikaPoNazivuPage(dir: 'prev' | 'next'): void {
    if (dir === 'prev' && this.statistikaPoNazivuPage > 1) this.statistikaPoNazivuPage--;
    if (dir === 'next' && this.statistikaPoNazivuPage < this.totalStatistikaPoNazivuPages) this.statistikaPoNazivuPage++;
    this.updateNazivPagination();
  }
  private updateTipPagination(): void {
    this.totalStatistikaPoTipuPages = Math.max(Math.ceil(this.statistikaPoTipu.length / this.statistikaPoTipuPageSize), 1);
    this.statistikaPoTipuPage = Math.min(this.statistikaPoTipuPage, this.totalStatistikaPoTipuPages);
    const start = (this.statistikaPoTipuPage - 1) * this.statistikaPoTipuPageSize;
    this.paginatedStatistikaPoTipu = this.statistikaPoTipu.slice(start, start + this.statistikaPoTipuPageSize);
  }
  private updateNazivPagination(): void {
    this.totalStatistikaPoNazivuPages = Math.max(Math.ceil(this.statistikaPoNazivu.length / this.statistikaPoNazivuPageSize), 1);
    this.statistikaPoNazivuPage = Math.min(this.statistikaPoNazivuPage, this.totalStatistikaPoNazivuPages);
    const start = (this.statistikaPoNazivuPage - 1) * this.statistikaPoNazivuPageSize;
    this.paginatedStatistikaPoNazivu = this.statistikaPoNazivu.slice(start, start + this.statistikaPoNazivuPageSize);
  }

  private primijeniLayoutResponse(response: ProdajnePozicijeResponse): void {
    this.layout = response.layout ?? null;
    this.pozicije = response.pozicije ?? [];
    this.osvjeziEditor();
    this.izracunajStatistiku();
    this.loading = false;
  }

  showAllStores(){

  }
}