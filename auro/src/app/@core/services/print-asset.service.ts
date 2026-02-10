
import { formatDate } from "@angular/common";
import { Injectable } from "@angular/core";
import { NbAuthJWTToken, NbAuthService } from "@nebular/auth";
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

@Injectable({ providedIn: "root" })
export class ExportPDFService {
  korisnik: any = { name: "" };

  constructor(private authService: NbAuthService) {
    try {
      const vfs = pdfFonts && pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : (pdfFonts as any).vfs;
      (pdfMake as any).vfs = vfs;
    } catch (e) {}
    this.authService.onTokenChange().subscribe((token: NbAuthJWTToken) => {
      if (token && token.isValid()) this.korisnik = token.getPayload();
    });
  }

  exportZaduzenjePdf(assets: any[], predaoSig?: string, preuzeoSig?: string) {
    // Osiguravamo da je assets uvijek niz i da nije prazan
    const items = Array.isArray(assets) ? assets : [assets];
    
    const documentDefinition: any = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [30, 60, 30, 40], // Smanjene margine da tabela "prodiše"
      
      header: (currentPage: number) => {
        return {
          margin: [30, 20, 30, 0],
          stack: [
            { text: 'REVERS / POTVRDA O ZADUŽENJU OPREME', style: 'docTitle' },
            { text: `Datum izdavanja: ${formatDate(new Date(), 'dd.MM.yyyy HH:mm', 'en-US')}`, alignment: 'center', fontSize: 9 }
          ]
        };
      },

      content: [
        {
          style: 'tableExample',
          table: {
            headerRows: 1,
            // Definisane fiksne širine za ključne kolone da se tabela ne bi "raspadala"
            widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              // ZAGLAVLJE TABELE
              [
                { text: 'Inv. br.', style: 'tableHeader' },
                { text: 'Naziv sredstva', style: 'tableHeader' },
                { text: 'Serijski br.', style: 'tableHeader' },
                { text: 'Nabavna cijena', style: 'tableHeader' },
                { text: 'Amort. (god)', style: 'tableHeader' },
                { text: 'Trenutna vrijednost', style: 'tableHeader' },
                { text: 'Lokacija', style: 'tableHeader' },
                { text: 'Zadužuje', style: 'tableHeader' },
                { text: 'Status', style: 'tableHeader' }
              ],
              // STAVKE - Generisanje redova
              ...items.map(item => [
                { text: item.inventoryNumber || '-', fontSize: 8, alignment: 'center' },
                { text: item.name || '-', fontSize: 8 },
                { text: item.serialNumber || '-', fontSize: 8 },
                { text: `${(item.purchasePrice || 0).toFixed(2)} KM`, fontSize: 8, alignment: 'right' },
                { text: item.amortizationYears || '-', fontSize: 8, alignment: 'center' },
                { text: `${(item.calculatedAmortization || 0).toFixed(2)} KM`, fontSize: 8, bold: true, alignment: 'right' },
                { text: item.location || '-', fontSize: 8 },
                { text: item.assignedTo || '-', fontSize: 8 },
                { text: item.status || '-', fontSize: 8 }
              ])
            ]
          },
          layout: {
            hLineWidth: (i: number, node: any) => 0.5,
            vLineWidth: (i: number, node: any) => 0.5,
            hLineColor: (i: number, node: any) => '#aaaaaa',
            vLineColor: (i: number, node: any) => '#aaaaaa'
          }
        },
        // SEKCIJA ZA POTPISE
        this.generisiSekcijuPotpisa(predaoSig, preuzeoSig, items[0]?.assignedTo)
      ],

      styles: {
        docTitle: { fontSize: 16, bold: true, alignment: 'center', margin: [0, 0, 0, 5] },
        tableHeader: { bold: true, fontSize: 9, fillColor: '#eeeeee', alignment: 'center', margin: [0, 2, 0, 2] },
        tableExample: { margin: [0, 5, 0, 15] }
      }
    };

    pdfMake.createPdf(documentDefinition).open();
  }

  private generisiSekcijuPotpisa(pSigImg?: string, rSigImg?: string, ime?: string) {
    // Slike potpisa sa fiksnim dimenzijama
    const p = pSigImg ? { image: pSigImg, width: 140, height: 50, alignment: 'center' } : { text: '', height: 50 };
    const r = rSigImg ? { image: rSigImg, width: 140, height: 50, alignment: 'center' } : { text: '', height: 50 };

    return {
      margin: [0, 40, 0, 0],
      unbreakable: true,
      columns: [
        // LIJEVA STRANA: Predao
        {
          width: '*',
          stack: [
            { text: 'Opremu predao:', alignment: 'center', margin: [0, 0, 0, 5], bold: true },
            p,
            { text: '__________________________', alignment: 'center' },
            { text: '(Ime, prezime i potpis)', fontSize: 8, alignment: 'center', italics: true }
          ]
        },
        // SREDINA: Pečat
        {
          width: 80,
          stack: [
            { text: 'M.P.', alignment: 'center', margin: [0, 40, 0, 0], bold: true, fontSize: 12 }
          ]
        },
        // DESNA STRANA: Preuzeo
        {
          width: '*',
          stack: [
            { text: 'Opremu preuzeo:', alignment: 'center', margin: [0, 0, 0, 5], bold: true },
            r,
            { text: '__________________________', alignment: 'center' },
            { text: `(${ime || 'Ime i prezime'})`, fontSize: 8, alignment: 'center', italics: true }
          ]
        }
      ]
    };
  }
}