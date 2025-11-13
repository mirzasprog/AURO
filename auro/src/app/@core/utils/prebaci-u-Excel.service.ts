import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class PrebaciUExcelService {

  constructor() { }

  exportAsExcelFile(data: any[], excelFileName: string): void {
    // 1. Kreiranje workbook-a
    const workbook: XLSX.WorkBook = { Sheets: {}, SheetNames: [] };

    // 2. Dodavanje prvog sheet-a sa svim podacima bez grupisanja
    const allDataSheet = this.createSheetWithFormattedData(data, 'Sve prodavnice');
    workbook.Sheets['Sve prodavnice'] = allDataSheet;
    workbook.SheetNames.push('Sve prodavnice');

    // 3. Grupiranje podataka prema "brojProdavnice"
    const groupedData = this.groupBy(data, 'brojProdavnice');

    // 4. Kreiranje sheet-ova za svaki "brojProdavnice"
    for (const podnosilac in groupedData) {
      if (groupedData.hasOwnProperty(podnosilac)) {
        const podaci = groupedData[podnosilac];
        const podnosilacSheet = this.createSheetWithFormattedData(podaci, podnosilac);
        workbook.Sheets[podnosilac] = podnosilacSheet;
        workbook.SheetNames.push(podnosilac);
      }
    }

    // 5. Snimanje workbook-a u fajl
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  // Funkcija koja kreira i formatira sheet sa datim podacima
  private createSheetWithFormattedData(data: any[], sheetName: string): XLSX.WorkSheet {
    // Priprema naziva kolona (velika slova)
    const columns = Object.keys(data[0] || {}).map(col => col.toUpperCase());

    // Pretvaranje podataka u worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, { header: [] });

    // Dodavanje zaglavlja (velika slova)
    XLSX.utils.sheet_add_aoa(worksheet, [columns], { origin: 'A1' });

    // Stilizovanje zaglavlja
    const range = XLSX.utils.decode_range(worksheet['!ref']!);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ c: C, r: 0 });
      if (!worksheet[cellAddress]) continue;

      worksheet[cellAddress].s = {
        font: { bold: true, sz: 12 },
        alignment: { horizontal: 'center' },
        fill: { fgColor: { rgb: 'FFFF00' } }
      };
    }

    // Formatiranje kolone "IZNOSZAISPLATU" kao BAM (KM)
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      const iznosCell = XLSX.utils.encode_cell({ c: columns.indexOf('IZNOSZAISPLATU'), r: R });

      // Provjera da li ćelija postoji
      if (worksheet[iznosCell]) {
        const value = worksheet[iznosCell].v;

        // Provjera da li je vrijednost broj
        if (!isNaN(value)) {
          // Postavljanje vrijednosti ćelije kao numeričke i formatiranje kao valutu
          worksheet[iznosCell].t = 'n'; // Postavljanje tipa na numerički
          worksheet[iznosCell].z = '#,##0.00 "KM"'; // Format za valutu
        } else {
          // Konvertovanje vrijednosti u broj ako nije broj
          worksheet[iznosCell].v = parseFloat(value);
          worksheet[iznosCell].t = 'n'; // Postavljanje tipa na numerički
          worksheet[iznosCell].z = '#,##0.00 "KM"'; // Format za valutu
        }
      }
    }

    // Automatsko prilagođavanje širine kolona
    const columnWidths = columns.map((col, index) => ({
      wch: Math.max(col.length, ...data.map(row => String(row[Object.keys(row)[index]] || '').length))
    }));
    worksheet['!cols'] = columnWidths;

    return worksheet;
  }

  // Funkcija koja grupiše podatke po "PODNOSIOC"
  private groupBy(data: any[], key: string): { [key: string]: any[] } {
    return data.reduce((acc, curr) => {
      const group = curr[key];
      acc[group] = acc[group] || [];
      acc[group].push(curr);
      return acc;
    }, {});
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
