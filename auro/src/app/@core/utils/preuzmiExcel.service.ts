import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class PreuzmiUExcelService {

  constructor() { }

  exportAsExcelFile(data: any[], excelFileName: string): void {
    const worksheet = this.buildWorksheet(data);

    const workbook: XLSX.WorkBook = {
      Sheets: { 'data': worksheet },
      SheetNames: ['data']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  exportMultipleSheets(sheets: { name: string; data: any[]; }[], excelFileName: string): void {
    if (!sheets?.length) {
      return;
    }

    const workbook: XLSX.WorkBook = { Sheets: {}, SheetNames: [] };

    sheets.forEach((sheet, index) => {
      const sheetName = sheet.name || `Sheet${index + 1}`;
      const worksheet = this.buildWorksheet(sheet.data);

      workbook.SheetNames.push(sheetName);
      workbook.Sheets[sheetName] = worksheet;
    });

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private buildWorksheet(data: any[]): XLSX.WorkSheet {
    const columns = Object.keys(data[0] || {}).map(col => col.toUpperCase());

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, { header: [] });

    if (columns.length) {
      XLSX.utils.sheet_add_aoa(worksheet, [columns], { origin: 'A1' });

      const range = XLSX.utils.decode_range(worksheet['!ref']!);
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ c: C, r: 0 });
        if (!worksheet[cellAddress]) continue;

        worksheet[cellAddress].s = {
          font: { bold: true, sz: 12 },
          alignment: { horizontal: 'center' },
          fill: {
            fgColor: { rgb: 'FFFF00' }
          }
        };
      }

      const columnWidths = columns.map((col, index) => ({
        wch: Math.max(
          col.length,
          ...data.map(row => String(row[Object.keys(row)[index]] || '').length)
        )
      }));

      worksheet['!cols'] = columnWidths;
    }

    return worksheet;
  }


  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
