import { formatCurrency } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';
import { DataService } from '../../../../@core/utils/data.service';

@Component({
  selector: 'ngx-vanredni-otpis-pregled',
  templateUrl: './vanredni-otpis-pregled.component.html',
  styleUrls: ['./vanredni-otpis-pregled.component.scss']
})
export class VanredniOtpisPregledComponent implements OnInit {
  odobreniArtikli = {
    actions: false,
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
      datumIsteka: {
        title: "Datum isteka roka",
        type: "string",
        editable: false,
      },
    },

  };

  odbijeniArtikli = {
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
      razlogOtpisa: {
        title: "Razlog otpisa",
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
      odbio: {
        title: "Odbio",
        type: "string",
        editable: false,
      },
      komentar: {
        title: "Komentar odbijanja",
        type: "string",
        editable: false,
      }
    }
  };

  data = [];
  dataOdbijeniArtikli = [];
  sourceOdbijeniArtikli: LocalDataSource = new LocalDataSource();
  source: LocalDataSource = new LocalDataSource();
  readonly brojOtpisa: string;
  constructor(private dataService: DataService, public router: Router,private route: ActivatedRoute) {
    this.brojOtpisa = this.route.snapshot.paramMap.get("brojOtpisa");
  }

  ngOnInit(): void {
    //EDIT pozivanje servisa
    this.dataService.prikaziDetaljeVanrednogOtpisaOdobreno(this.brojOtpisa).subscribe(
      (r) => {
        this.data = r;
        //this.dataOdbijeniArtikli = r.odbijeniArtikli;

        this.source.load(this.data);
        //this.sourceOdbijeniArtikli.load(this.dataOdbijeniArtikli);
      },
      (err) => {
        const greska = err.error?.poruka ?? err.statusText;
        Swal.fire("Greška", "Greška: " + greska, "error");
      }
    );

    this.dataService.prikaziDetaljeVanrednogOtpisaOdbijeno(this.brojOtpisa).subscribe(
      (r) => {
        this.dataOdbijeniArtikli = r;
        this.sourceOdbijeniArtikli.load(this.dataOdbijeniArtikli);
      },
      (err) => {
        const greska = err.error?.poruka ?? err.statusText;
        Swal.fire("Greška", "Greška: " + greska, "error");
      }
    );
  }
}
