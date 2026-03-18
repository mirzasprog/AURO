import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { Injectable } from '@angular/core';
import { ReklamacijaKvaliteta } from '../data/reklamacijaKvaliteta';

@Injectable({
  providedIn: 'root'
})
export class ExportServiceReklamacije {

  public exportReklamacijeKvalitetaExcel(podaci: ReklamacijaKvaliteta[]): void {
    if (!podaci || podaci.length === 0) {
      console.warn('Nema podataka za eksport.');
      return;
    }
    const exportPodaci = podaci.map((x, i) => ({
      Rbr: i + 1,
      'Datum reklamacije': new Date(x.datum).toLocaleDateString('bs-BA'),
      'Datum prijema': new Date(x.datumPrijema).toLocaleDateString('bs-BA'),
      'Broj prodavnice': x.brojProdavnice,
      'Šifra artikla': x.sifraArtikla,
      'Naziv artikla': x.naziv,
      'Jedinica mjere': x.jedinicaMjere,
      'Nabavna cijena': x.nabavnaCijena.toFixed(2),
      'LOT': x.lot,
      'Broj zaduženja MLP': x.brojZaduzenjaMLP,
      'Zaprimljena količina': x.kolicina,
      'Reklamirana količina': x.reklamiranaKolicina,
      'Razlog reklamacije': x.razlog,
      'Komentar': x.komentar,
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportPodaci);

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Reklamacije Kvaliteta VIP': worksheet },
      SheetNames: ['Reklamacije Kvaliteta VIP']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const nazivFajla = `IZVJESTAJ_REKLAMACIJE_${new Date().toISOString().slice(0, 10)}.xlsx`;
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    FileSaver.saveAs(data, nazivFajla);
  }
}
