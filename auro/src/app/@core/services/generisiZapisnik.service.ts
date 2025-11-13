// pdf-generator.service.ts

import { style } from '@angular/animations';
import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  constructor() {
    // Registracija fontova za pdfMake
    (pdfMake as any).vfs = pdfFonts.vfs;
  }

  generateInventoryReport(employees: { name: string, hours: string, rola: string, orgJed: string}[]) {
    let employeeTableBody = [];
    let komisija = [];

    // Dinamički popuni tabelu sa zaposlenicima
    employees.forEach(employee => {
      if(employee.rola == 'Uposlenik' || employee.rola == 'Ispomoć') {
        employeeTableBody.push([{ text: employee.name }, { text: employee.hours.toString() },{ text: employee.orgJed },{text:employee.rola}]);
      }
      else {
        komisija.push([{ text: employee.name }, { text: employee.hours.toString()}, { text: employee.orgJed }, {text:employee.rola}]);
      }
    });

    const docDefinition = {
      pageOrientation: 'portrait',
      pageSize: 'A4',
      footer: function () { return [{ text: 'Ovaj dokument je vlasništvo Društva Konzum d.o.o. Sarajevo i zabranjeno je njegovo umnožavanje bez saglasnosti vlasnika', fontSize:7,  alignment: "center" }] },
      content: [
        {
          columns: [
            {
              width: 'auto',
              image: 'data:image/png;base64,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',
              fit: [100, 50],
              margin: [0, 8, 0, 10]
            },
            {
              width: 414,
              table: {
                widths: ['*', 'auto'],
                body: [
                    [
                        {
                            text: 'Obrazac',
                            bold: true,
                            fontSize:10,
                            margin: [0, 0, 0, 0]
                        },
                        {
                          text: 'OB-SIK/KZ-011-4',
                          margin: [0, 0, 0, 0],
                          fontSize:10,
                        }
                    ],
                    [
                        {
                            text: 'Zapisnik i izvještaj inventurne komisije o provedenoj potpunoj inventuri',
                            bold: true,
                            fontSize:10,
                            margin: [0, 0, 0, 0]
                        },
                        {
                            text: 'U primjeni od: 15.08.2022.',

                            fontSize:10,
                        }
                    ]
                ]
              },
              alignment: 'center',
              margin: [20, 0, 0, 10]
            }
          ]
        },
        { text: '\nInventura je završena dana _____________________ u _____________________ sati.\n', style: 'regularText' },
        { text: 'Kod prekida navesti tačno sat prekida i ponovnog početka.\n\n', style: 'regularText' },

        { text: 'Članovi Inventurne komisije:', style: 'subheader' }, // Dodavanje naslova ispravno
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*'],
            body: (() => {
              // Prvo pripremi inicijalni body sa zaglavljem tabele
              let tableBody = [
                [
                  { text: 'Ime i prezime', bold: true }, 
                  { text: 'Broj sati.', bold: true }, 
                  { text: 'OrgJed', bold: true }, 
                  { text: 'Rola na inventuri', bold: true }
                ],
                ...komisija // Dodaj stvarne podatke iz liste 'komisija'
              ];
        
              return tableBody;
            })()
          },
          layout: {
            fillColor: function (rowIndex: number) {
              return (rowIndex === 0) ? '#CCCCCC' : null;
            },
            hLineColor: function (i) {
              return (i === 1) ? '#000000' : '#CCCCCC';
            },
            vLineColor: function (i) {
              return (i === 1) ? '#000000' : '#CCCCCC';
            },
            hLineWidth: function (i) {
              return (i === 1) ? 1 : 0.5;
            },
            vLineWidth: function (i) {
              return (i === 1) ? 1 : 0.5;
            }
          },
          margin: [0, 0, 0, 20]
        },

        { text: 'Zaposlenici prodavnice – skladišta:', style: 'subheader' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*'],
            body: [
              [{ text: 'Ime i prezime', bold: true }, { text: 'Broj sati', bold: true }, { text: 'OrgJed', bold: true },{ text: 'Rola na inventuri', bold: true }],
              ...employeeTableBody 
            ]
          },
          layout: {
            fillColor: function (rowIndex: number) {
              return (rowIndex === 0) ? '#CCCCCC' : null;
            },
            hLineColor: function (i) {
              return (i === 1) ? '#000000' : '#CCCCCC';
            },
            vLineColor: function (i) {
              return (i === 1) ? '#000000' : '#CCCCCC';
            },
            hLineWidth: function (i) {
              return (i === 1) ? 1 : 0.5;
            },
            vLineWidth: function (i) {
              return (i === 1) ? 1 : 0.5;
            }
          },
          margin: [0, 0, 0, 20],
          pageBreak: 'after'
        },

      ],


      styles: {
        header: { fontSize: 16, bold: true },
        subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
        regularText: { fontSize: 12, margin: [0, 5, 0, 5] },
        footerText: { fontSize: 10, italics: true },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
      }
    };

    // Generiši PDF i omogući preuzimanje
    pdfMake.createPdf(docDefinition).open();
  }
}
