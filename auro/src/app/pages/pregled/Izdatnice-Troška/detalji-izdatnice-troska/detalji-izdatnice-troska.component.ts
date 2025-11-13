import { formatCurrency } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';
import { DataService } from '../../../../@core/utils/data.service';

@Component({
  selector: 'ngx-detalji-izdatnice-troska',
  templateUrl: './detalji-izdatnice-troska.component.html',
  styleUrls: ['./detalji-izdatnice-troska.component.scss']
})
export class DetaljiIzdatniceTroskaComponent implements OnInit {
  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    //Polja u listi redovnih otpisa :
    columns: {
      sifra: {
        title: "Šifra artikla",
        type: "string",
      },
      naziv: {
        title: "Naziv artikla",
        type: "string",
      },
      dobavljac: {
        title: "Dobavljač",
        type: "string",
      },
      razlog: {
        title: "Razlog izdatnice",
        type: "string",
      },
      jedinicaMjere: {
        title: "JM",
        type: "string",
      },
      kolicina: {
        title: "Količina",
        type: "number",
      },
      nabavnaVrijednost: {
        title: "NV",
        type: "number",
        valuePrepareFunction: (value, row, cell) => {
          return formatCurrency(value, 'bs-BS', 'KM')
        }
      },
      ukupnaVrijednost: {
        title: "Ukupna vrijednost",
        type: "number",
        valuePrepareFunction: (value, row, cell) => {
          return formatCurrency(value, 'bs-BS', 'KM')
        }
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
      razlog: {
        title: "Razlog izdatnice",
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
      },

    },
  };

  data = [];

  source: LocalDataSource = new LocalDataSource();
  readonly brojIzdatnice: string;

  constructor(private dataService: DataService, private route: ActivatedRoute) {
    this.brojIzdatnice = this.route.snapshot.paramMap.get("brojIzdatnice");
  }

  ngOnInit(): void {
    this.dataService.prikaziDetaljeIzdatnicaTroska(this.brojIzdatnice).subscribe(
      (r) => {
        this.data = r;
        this.source.load(this.data);
      },
      (err) => {
        const greska = err.error.poruka || err.statusText;
        Swal.fire("Greška", "Greška: " + greska, "error");
      }
    );
  }
}
