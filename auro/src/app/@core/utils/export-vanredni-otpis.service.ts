import { Injectable } from '@angular/core';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { PDFVanredniOtpis } from "../data/pdf-vanredni-otpis";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { formatCurrency } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ExportVanredniOtpisService {
  readonly LOGO =
    "data:image/png;base64,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";

  stavke: Array<PDFVanredniOtpis>;
  korisnik: { name: string };
  brojOtpisa: string;

  constructor(private authService: NbAuthService) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    // broj prodavnice
    this.authService.onTokenChange().subscribe((token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.korisnik = token.getPayload();
      }
    });

   }


   printVanredniOtpisPDF(podaci: PDFVanredniOtpis[], ukupnaVrijednost: number, brojOtpisa: string) {
    this.brojOtpisa = brojOtpisa;

    this.stavke = podaci;
    let dd = this.getDocumentDefinition(ukupnaVrijednost);
    pdfMake.createPdf(dd).print();
  }

  getDocumentDefinition(ukupnaVrijednost: number) {
    let dokument = {
      pageOrientation: "landscape",
      pageSize: "A4",
     // pageMargins: [10, 10, 10, 10],
      /*
      footer: function (currentPage, pageCount) {
        return [
          {
            text: currentPage.toString() + " / " + pageCount,
            alignment: "right",
            margin: [0,0,20,0]
          },
        ];
      },
      */

      footer: {
        text: "Ovaj dokument je vlasništvo Društva Konzum d.o.o. Sarajevo i zabranjeno je njegovo umnožavanje bez saglasnosti vlasnika",
        alignment: "center",
      },

      content: [
        {
          table: {
            widths: ["*", "*", "*"],
            body: [
              [
                {
                  image: this.LOGO,
                  width: 95,
                  margin: [0, 28, 0, 0],
                  rowSpan: 4,
                  alignment: "center",
                },
                {
                  text: "\n\Vanredni otpis robe",
                  rowSpan: 4,
                  alignment: "center",
                  bold: true,
                  fontSize: 14,
                },
                { text: "OB-SIK/KZ-013-01" },
              ],
              [{ text: "" }, { text: "" }, { text: "Izdanje: 1" }],
              [{ text: "" }, { text: "" }, { text: "Stranica: 1/1" }],
              [
                { text: "" },
                { text: "" },
                { text: "U primjeni od (datum): 20.04.2016." },
              ],
            ],
          },
        },

        {
          margin: [0, 5],
          table: {
            widths: ["*", "auto", "*", "*"],
            body: [
              [
                { text: "Broj prodavnice: ", fillColor: "#dddddd", bold: true },
                { text: this.korisnik.name },
                {
                  text: "Poslovođa/zamjenik poslovođe prodavnice: ",
                  fillColor: "#dddddd",
                  bold: true,
                },
                { text: "" },
              ],

              [
                {
                  text: "Datum popunjavanja obrasca - otpis: ",
                  fillColor: "#dddddd",
                  bold: true,
                },
                { text: "05.12.2022" },
                {
                  text: "Područni voditelj prodavnice: ",
                  fillColor: "#dddddd",
                  bold: true,
                },
                { text: "" },
              ],

              [
                {
                  text: "Datum provođenja otpisa: ",
                  fillColor: "#dddddd",
                  bold: true,
                },
                { text: "05.12.2022" },
                {
                  text: "Broj najavljenog otpisa - Aplikacija AURO ",
                  fillColor: "#dddddd",
                  bold: true,
                },
                { text: this.brojOtpisa },
              ],

              [
                {
                  text: "Datum provođenja posljednjeg otpisa\u00B9: ",
                  fillColor: "#dddddd",
                  bold: true,
                },
                { text: "05.12.2022" },
                {
                  text: "Broj odobrenja otpisa - Aplikacija AURO ",
                  fillColor: "#dddddd",
                  bold: true,
                },
                { text: "" },
              ],
            ],
          },
        },

        {
          margin: [0, 5],
          table: {
            headerRows: 2,
            widths: ["auto", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
            body: [
              [
                {
                  text: "Podaci o najavljenom vanrednom otpisu i artiklima za otpis ",
                  bold: true,
                  colSpan: 10,
                  alignment: "center",
                  fontSize: 16,
                  fillColor: "#dddddd",
                },
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {}
              ],

              [
                { text: "Rd.br.", bold: true, fillColor: "#dddddd" },
                { text: "Šifra artikla", bold: true, fillColor: "#dddddd" },
                { text: "Naziv artikla", bold: true, fillColor: "#dddddd" },
                {
                  text: "Potrebno zbrinjavanje",
                  bold: true,
                  fillColor: "#dddddd",
                },
                {
                  text: "Potreban transport",
                  bold: true,
                  fillColor: "#dddddd",
                },
                { text: "Razlog otpisa", bold: true, fillColor: "#dddddd" },
                { text: "Jedinica mjere", bold: true, fillColor: "#dddddd" },
                { text: "Količina za otpis", bold: true, fillColor: "#dddddd" },
                { text: "Cijena artikla", bold: true, fillColor: "#dddddd" },
                { text: "Ukupna vrijednost", bold: true, fillColor: "#dddddd" },
              ],

              // INSERT
                ...this.generisiStavke()

            ],
          },
        }, // kraj table


        {
          columns: [
            { width: "*", text: "" },
            {
              width: "auto",
              table: {
                body: [
                  [
                    {
                      text: "Ukupna vrijednost otpisa: ",
                      fillColor: "#dddddd",
                    },
                    // EDIT
                    { text: formatCurrency(ukupnaVrijednost, 'bs-BS', 'KM', '1.2-2')  },
                  ],
                ],
              },
            },
          ],
          pageBreak: 'before'
          // kraj columns
        },

        {
          columns: [
          //  width: ['*', '*', '*'],
          [
          {
             margin: [0, 25, 0, 30],
             width: '40%',
              text: 'Artikle za otpis prijavio - poslovođa/zamjenik poslovođe/administrator\u00B2:',
              bold: true
          },

          {
              text: '________________________________________________________'
          },
          {
               text: '(ime i prezime potpis)', alignment: 'center'
          }
          ],
              { width: '25%', margin: [90,85,40,0], text: 'M.P.' },
          [

              { width: '25%', margin:[30,35,0,0], text: 'Otpis odobrio - područni voditelj:'},
              { width: '25%', margin:[15,35,0,0], text: '__________________________________________'},
              {text: '(ime i prezime potpis)', alignment: 'center'}
          ]

          ] // kraj columns

},

        { text: "Napomena", decoration: "underline", fontSize: 9 },
        {
          text: "\n\u00B9Navesti tačan datum posljednjeg realizovanog periodičnog komisijskog otpisa;",
          fontSize: 9,
        },
        {
          text: "\u00B2U slučaju da otpis prijavljuje zamjenik poslovođe ili administrator mora postojati saglasnot poslovođe za prijavu otpisa",
          fontSize: 9,
        },
      ],
    };
    return dokument;
  }

  generisiStavke(): Array<any> {
    let ispisStavke = [];
    let rezultat: Array<Array<object>> = [];
    let redniBroj = 1;

    for (let s of this.stavke) {
      ispisStavke.push({ text: redniBroj, alignment: "center" });
      ispisStavke.push({ text: s.sifra, alignment: "center" });
      ispisStavke.push({ text: s.naziv,  alignment: "center"});
      ispisStavke.push({ text: s.potrebanTransport, alignment: "center" });
      ispisStavke.push({ text: s.potrebnoZbrinjavanje, alignment: "center" });
      ispisStavke.push({ text: s.razlogOtpisa, alignment: "center" });
      ispisStavke.push({ text: s.jedinicaMjere, alignment: "center" });
      ispisStavke.push({ text: s.kolicina, alignment: "center" });
      ispisStavke.push({ text:  formatCurrency(s.nabavnaVrijednost, 'bs-BS', 'KM', '1.2-2'), alignment: "center" });
      ispisStavke.push({ text: formatCurrency(s.ukupnaVrijednost, 'bs-BS', 'KM', '1.2-2'), alignment: "center" });

      ++redniBroj;
      rezultat.push(ispisStavke);
      ispisStavke = [];
    }
    return rezultat;
  }
}
