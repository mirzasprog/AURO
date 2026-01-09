import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import * as FileSaver from 'file-saver';
import { DataService } from '../../@core/utils/data.service';
import { ProdajnaPozicija, ProdajniLayout, ProdajnePozicijeResponse, ProdavnicaOption } from '../../@core/data/prodajne-pozicije';

interface TipStatistika {
  tip: string;
  broj: number;
  zauzetaPovrsina: number;
  ucesce: number;
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

  ukupnaPovrsina = 0;
  zauzetaPovrsina = 0;
  slobodnaPovrsina = 0;
  iskoristenost = 0;
  statistikaPoTipu: TipStatistika[] = [];

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
      },
      error: () => {
        this.loading = false;
        this.toastrService.danger('Greška pri učitavanju prodavnica.', 'Prodajne pozicije');
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

    const grupisano: Record<string, TipStatistika> = {};
    this.pozicije.forEach((pozicija) => {
      if (!grupisano[pozicija.tip]) {
        grupisano[pozicija.tip] = {
          tip: pozicija.tip,
          broj: 0,
          zauzetaPovrsina: 0,
          ucesce: 0
        };
      }

      grupisano[pozicija.tip].broj += 1;
      grupisano[pozicija.tip].zauzetaPovrsina += pozicija.sirina * pozicija.duzina;
    });

    this.statistikaPoTipu = Object.values(grupisano).map(stat => ({
      ...stat,
      ucesce: this.ukupnaPovrsina > 0
        ? Math.round((stat.zauzetaPovrsina / this.ukupnaPovrsina) * 100 * 100) / 100
        : 0
    }));
  }

  private osvjeziEditor(): void {
    if (!this.odabranaProdavnicaId) {
      this.editorLayout = null;
      this.editorPozicije = [];
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
  }
}
