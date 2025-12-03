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
          this.stavke = this.filtrirajStavkePoProdavnici(stavke);
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
    }));

    const worksheet = XLSX.utils.json_to_sheet(podaci);
    const workbook: XLSX.WorkBook = { Sheets: { Stavke: worksheet }, SheetNames: ['Stavke'] };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, `vikend-akcija-${this.vikendAkcijaId}.xlsx`);
  }

  private filtrirajStavkePoProdavnici(stavke: VikendAkcijaStavka[]): VikendAkcijaStavka[] {
    if (this.rola !== 'prodavnica' || !this.brojProdavnice) {
      return stavke;
    }

    return stavke.filter(stavka => (stavka.prodavnica ?? '').toString() === this.brojProdavnice);
  }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
