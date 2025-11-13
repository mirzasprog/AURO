import { formatCurrency, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';
import { DataService } from '../../../@core/utils/data.service';
import { ExportRedovniOtpisService } from '../../../@core/utils/export-redovni-otpis.service';

@Component({
  selector: 'ngx-odobreni-artikli-ro',
  templateUrl: './odobreni-artikli-ro.component.html',
  styleUrls: ['./odobreni-artikli-ro.component.scss']
})
export class OdobreniArtikliROComponent implements OnInit {
  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    //Polja u listi redovnih otpisa :
    columns: {
      sifra: {
        title: "Šifra artikla",
        type: "string",
        editable: false,
      },
      naziv: {
        title: "Naziv artikla",
        type: "string",
        editable: false,
      },
      dobavljac: {
        title: "Dobavljac",
        type: "string",
        editable: false,
      },
      razlogOtpisa: {
        title: "Razlog otpisa",
        type: "string",
        editable: false,
      },
      jedinicaMjere: {
        title: "JM",
        type: "string",
        editable: false,
      },
      kolicina: {
        title: "Količina",
        type: "number",
      },
      nabavnaVrijednost: {
        title: "NV",
        type: "number",
        editable: false,
        valuePrepareFunction: (value, row, cell) => {
          return formatCurrency(value, 'bs-BS', 'KM')
        }
      },
      ukupnaVrijednost: {
        title: "Ukupna vrijednost",
        type: "number",
        editable: false,
        valuePrepareFunction: (value, row, cell) => {
          return formatCurrency(value, 'bs-BS', 'KM')
        }

      },
      datumIstekaRoka: {
        title: "Datum isteka roka",
        type: "Date",
        editable: false,
        valuePrepareFunction: (value, row, cell) => {
          return value == null ? '-' : formatDate(value, 'dd.MM.yyyy', 'bs-BS')
        },
      },
    },
  };
  data = [];
  source: LocalDataSource = new LocalDataSource();
  readonly brojOtpisa: string;

  constructor(private dataService: DataService, private route: ActivatedRoute, private pdf: ExportRedovniOtpisService) {
    this.brojOtpisa = this.route.snapshot.paramMap.get("brojOtpisa");
  }

  ngOnInit(): void {
    // EDIT pozivnaje servisa za pregled odobrenih artikala
    this.dataService.prikaziDetaljeRedovnogOtpisaOdobreno(this.brojOtpisa).subscribe(
      (r) => {
        this.data = r;
        this.source.load(this.data);
      },
      (err) => {
        const greska = err.error?.poruka ?? err.statusText;
        Swal.fire("Greška", "Greška: " + greska, "error");
      }
    );
  }
  exportPDF() {
    let ukupno = 0;

    for (let artikal of this.data) {
      ukupno = ukupno + artikal.ukupnaVrijednost;
    }

    this.pdf.printRedovniOtpisPDF(this.data, ukupno, this.brojOtpisa);
  }
}
