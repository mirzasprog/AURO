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
    const podaci = this.stavke
      .filter(stavka => (Number(stavka.ukupnaKolicina ?? stavka.kolicina) || 0) > 0)
      .map(stavka => ({
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
        narucenaKolicina: stavka.ukupnaKolicina ?? stavka.kolicina ?? 0,
      }));

    if (!podaci.length) {
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(podaci);
    const workbook: XLSX.WorkBook = { Sheets: { Stavke: worksheet }, SheetNames: ['Stavke'] };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, `vikend-akcija-${this.vikendAkcijaId}.xlsx`);
  }

  private pripremiStavkeZaPregled(stavke: VikendAkcijaStavka[]): VikendAkcijaStavka[] {
    const mapa = new Map<string, {
      stavka: VikendAkcijaStavka;
      ukupnaKolicina: number;
      prodavnice: Set<string>;
    }>();
    const ciljanaProdavnica = this.rola === 'prodavnica' ? this.brojProdavnice : '';

    stavke.forEach(stavka => {
      const kljuc = (stavka.sifra ?? stavka.naziv ?? stavka.id ?? '').toString().trim().toLowerCase();
      const prodavnica = (stavka.prodavnica ?? '').toString();
      const jeCiljana = !!ciljanaProdavnica && prodavnica === ciljanaProdavnica;
      const kolicina = Number(stavka.kolicina) || 0;
      const postojeca = mapa.get(kljuc);
      const normalizovanaStavka: VikendAkcijaStavka = {
        ...stavka,
        prodavnica: jeCiljana ? ciljanaProdavnica : prodavnica,
        kolicina,
        zaliha: stavka.zaliha ?? postojeca?.stavka.zaliha ?? 0
      };

      if (!postojeca) {
        mapa.set(kljuc, {
          stavka: normalizovanaStavka,
          ukupnaKolicina: kolicina,
          prodavnice: prodavnica ? new Set([prodavnica]) : new Set()
        });
        return;
      }

      const prodavnice = prodavnica ? new Set([...postojeca.prodavnice, prodavnica]) : postojeca.prodavnice;
      const trebaAzurirati = jeCiljana || this.imaViseMetaPodataka(postojeca.stavka, normalizovanaStavka);
      const spojenaStavka = trebaAzurirati
        ? this.spojiStavkeZaPregled(postojeca.stavka, normalizovanaStavka)
        : postojeca.stavka;

      mapa.set(kljuc, {
        stavka: spojenaStavka,
        ukupnaKolicina: postojeca.ukupnaKolicina + kolicina,
        prodavnice
      });
    });

    return Array.from(mapa.values())
      .map(zapis => ({
        ...zapis.stavka,
        zaliha: zapis.stavka.zaliha ?? 0,
        ukupnaKolicina: zapis.ukupnaKolicina,
        brojProdavnica: zapis.prodavnice.size || (zapis.stavka.prodavnica ? 1 : 0)
      }))
      .sort((a, b) => (a.sifra ?? '').localeCompare(b.sifra ?? ''));
  }

  private spojiStavkeZaPregled(osnova: VikendAkcijaStavka, noviPodaci: VikendAkcijaStavka): VikendAkcijaStavka {
    return {
      ...osnova,
      ...noviPodaci,
      naziv: noviPodaci.naziv || osnova.naziv,
      barKod: noviPodaci.barKod || osnova.barKod,
      dobavljac: noviPodaci.dobavljac || osnova.dobavljac,
      status: noviPodaci.status || osnova.status,
      opis: noviPodaci.opis || osnova.opis,
      akcijskaMpc: noviPodaci.akcijskaMpc ?? osnova.akcijskaMpc,
      asSa: noviPodaci.asSa ?? osnova.asSa,
      asMo: noviPodaci.asMo ?? osnova.asMo,
      asBl: noviPodaci.asBl ?? osnova.asBl,
      zaliha: noviPodaci.zaliha ?? osnova.zaliha ?? 0,
      kolicina: noviPodaci.kolicina ?? osnova.kolicina ?? 0
    };
  }

  private imaViseMetaPodataka(trenutna: VikendAkcijaStavka, nova: VikendAkcijaStavka): boolean {
    const polja = ['barKod', 'dobavljac', 'status', 'opis', 'akcijskaMpc', 'asSa', 'asMo', 'asBl'];
    return polja.some(polje => (nova as any)[polje] && !(trenutna as any)[polje]);
  }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
