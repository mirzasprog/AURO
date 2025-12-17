import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { VikendAkcijaStavka } from '../../../@core/data/vikend-akcija-stavka';
import { DataService } from '../../../@core/utils/data.service';

@Component({
  selector: 'ngx-vikend-akcije-stavke-pregled',
  templateUrl: './vikend-akcije-stavke-pregled.component.html',
  styleUrls: ['./vikend-akcije-stavke-pregled.component.scss']
})
export class VikendAkcijeStavkePregledComponent implements OnInit {
  @Input() vikendAkcijaId!: string;
  @Input() naslov = '';
  @Input() rola = '';
  @Input() brojProdavnice = '';

  stavke: VikendAkcijaStavka[] = [];
  loading = false;
  greska = '';

  constructor(
    protected readonly dialogRef: NbDialogRef<VikendAkcijeStavkePregledComponent>,
    private readonly dataService: DataService,
  ) { }

  ngOnInit(): void {
    this.ucitajStavke();
  }

  ucitajStavke(): void {
    this.loading = true;
    this.greska = '';
    this.dataService.preuzmiStavkeVikendAkcije(this.vikendAkcijaId)
      .subscribe({
        next: (stavke) => {
          this.stavke = this.pripremiStavkeZaPregled(stavke);
          this.loading = false;
        },
        error: (err) => {
          this.greska = err.error?.poruka ?? 'Greška prilikom učitavanja stavki.';
          this.loading = false;
        }
      });
  }

  zatvori(): void {
    this.dialogRef.close();
  }

  exportujStavke(): void {
    if (!this.stavke.length) {
      return;
    }

    const podaci = this.stavke.map(stavka => ({
      idAkcije: this.vikendAkcijaId,
      sifraArtikla: stavka.sifra ?? '',
      nazivArtikla: stavka.naziv ?? '',
      barKod: stavka.barKod ?? '',
      dobavljac: stavka.dobavljac ?? '',
      akcijskaMpc: stavka.akcijskaMpc ?? 0,
      asSa: stavka.asSa ?? 0,
      asMo: stavka.asMo ?? 0,
      asBl: stavka.asBl ?? 0,
      status: stavka.status ?? '',
      opis: stavka.opis ?? '',
      zaliha: stavka.zaliha ?? 0,
      prodavnica: stavka.prodavnica ?? '',
      narucenaKolicina: stavka.kolicina ?? 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(podaci);
    const workbook: XLSX.WorkBook = { Sheets: { Stavke: worksheet }, SheetNames: ['Stavke'] };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, `vikend-akcija-${this.vikendAkcijaId}.xlsx`);
  }

  private pripremiStavkeZaPregled(stavke: VikendAkcijaStavka[]): VikendAkcijaStavka[] {
    const mapa = new Map<string, VikendAkcijaStavka>();
    const ciljanaProdavnica = this.rola === 'prodavnica' ? this.brojProdavnice : '';

    stavke.forEach(stavka => {
      const kljuc = (stavka.sifra ?? stavka.naziv ?? stavka.id ?? '').toString().trim().toLowerCase();
      const postojeca = mapa.get(kljuc);
      const jeCiljana = !!ciljanaProdavnica && (stavka.prodavnica ?? '').toString() === ciljanaProdavnica;

      if (!postojeca || jeCiljana) {
        mapa.set(kljuc, {
          ...stavka,
          prodavnica: jeCiljana ? ciljanaProdavnica : postojeca?.prodavnica ?? stavka.prodavnica,
          kolicina: stavka.kolicina ?? 0,
          zaliha: stavka.zaliha ?? postojeca?.zaliha ?? 0
        });
      }
    });

    return Array.from(mapa.values())
      .map(stavka => ({ ...stavka, zaliha: stavka.zaliha ?? 0 }))
      .sort((a, b) => (a.sifra ?? '').localeCompare(b.sifra ?? ''));
  }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
