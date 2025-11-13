import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { IzvjestajIzdatnica } from '../data/izvjestaj-izdatnica';
import { IzvjestajParcijalnaInventura } from '../data/izvjestaj-parcijalna-inventura';

@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {

  constructor() { }

  public snimiIzdatniceExcel(podaci: Array<IzvjestajIzdatnica>) {
      let workbook = new Workbook();
      let worksheet = workbook.addWorksheet('Izdatnice');

      worksheet.columns = [
        { header: 'Broj prodavnice', key: 'brojProdavnice', width: 15 },
        { header: 'Broj izdatnice', key: 'brojIzdatnice', width: 15 },
        { header: 'Kategorija', key: 'kategorija', width: 40 },
        { header: 'Šifra artikla', key: 'sifraArtikla', width: 25 },
        { header: 'Sniženje', key: 'snizenje', width: 15 },
        { header: 'Razlog', key: 'razlog', width: 35 },
        { header: 'Jedinica mjere', key: 'jedinicaMjere', width: 15 },
        { header: 'P.Kol', key: 'pkol', width: 15 },
        { header: 'MPC', key: 'mpc', width: 15 },
        { header: 'Ukupna vrijednost', key: 'ukupnaVrijednost', width: 20 },
        { header: 'Datum popunjavanja', key: 'datumPopunjavanja', width: 25 },
        { header: 'Šifra dobavljača', key: 'sifraDobavljaca', width: 15 },
        { header: 'Naziv dobavljača', key: 'nazivDobavljaca', width: 30 }
      ];

      worksheet.addRows(podaci, "n");

      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, 'izdatnice.xlsx');
      });

  }

  public snimiParcijalnuInventuruExcel(podaci: Array<IzvjestajParcijalnaInventura>) {
    let workbook = new Workbook();
      let worksheet = workbook.addWorksheet('Inventure');

      worksheet.columns = [
        { header: 'Oznaka OJ', key: 'oznakaOJ', width: 15 },
        { header: 'Entitet', key: 'entitet', width: 25 },
        { header: 'Broj iz DESa', key: 'brojIzDesa', width: 15 },
        { header: 'Ime', key: 'ime', width: 15 },
        { header: 'Prezime', key: 'prezime', width: 35 },
        { header: 'Naziv OJ', key: 'nazivOj', width: 15 },
        { header: 'Format', key: 'format', width: 40 },
        { header: 'Naknada po zaposleniku', key: 'naknadaPoZaposleniku', width: 15 },
        { header: 'Broj dana', key: 'brojDana', width: 15 },
        { header: 'Broj sati', key: 'brojSati', width: 20 },
        { header: 'Datum inventure', key: 'datumInventure', width: 25 },
        { header: 'Iznos za isplatu', key: 'iznosZaIsplatu', width: 15 },
        { header: 'Područni voditelj', key: 'podrucniVoditelj', width: 30 },
        { header: 'Vrsta inventure', key: 'vrstaInventure', width: 30 },
      ];

      worksheet.addRows(podaci, "n");

      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, 'parcijalnaInventura.xlsx');
      });

  }
}
