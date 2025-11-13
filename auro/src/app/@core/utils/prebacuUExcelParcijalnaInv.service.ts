import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class PrebaciUExcelParcijalnaInvService {

  constructor() { }

  exportAsExcelFile(data: any[], excelFileName: string): void {
    // 1. Priprema naziva kolona (velika slova)
    const columns = Object.keys(data[0] || {}).map(col => col.toUpperCase());

    // 2. Pretvaranje podataka u worksheet bez automatskog zaglavlja
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, { header: [] });

    // 3. Dodavanje zaglavlja (velika slova) u worksheet
    XLSX.utils.sheet_add_aoa(worksheet, [columns], { origin: 'A1' });

    // Stilizovanje zaglavlja (npr. boja pozadine)
    const range = XLSX.utils.decode_range(worksheet['!ref']!);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ c: C, r: 0 }); // Oznaka ćelije (npr. 'A1', 'B1')
      if (!worksheet[cellAddress]) continue;

      worksheet[cellAddress].s = {
        font: { bold: true, sz: 12 }, 
        alignment: { horizontal: 'center' },
        fill: {
          fgColor: { rgb: 'FFFF00' }
        }
      };
    }

    // 4. Automatsko prilagođavanje širine kolona
    const columnWidths = columns.map((col, index) => ({
      wch: Math.max(
        col.length, 
        ...data.map(row => String(row[Object.keys(row)[index]] || '').length)
      )
    }));

    worksheet['!cols'] = columnWidths;

    // 5. Kreiranje workbook-a i dodavanje worksheet-a
    const workbook: XLSX.WorkBook = {
      Sheets: { 'data': worksheet },
      SheetNames: ['data']
    };

    // 6. Snimanje u fajl
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
}


  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
