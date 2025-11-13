import { formatCurrency } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';
import { DataService } from '../../../../@core/utils/data.service';


@Component({
  selector: 'ngx-detalji-neuslovne-roba',
  templateUrl: './detalji-neuslovne-roba.component.html',
  styleUrls: ['./detalji-neuslovne-roba.component.scss']
})
export class DetaljiNeuslovneRobaComponent implements OnInit {
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
      barkod: {
        title: "Barkod",
        type: "string",
      },
      razlogNeuslovnosti: {
        title: "Razlog neuslovnosti",
        type: "string",
      },
      razlogPrisustva: {
        title: "Razlog prisustva",
        type: "string",
      },
      otpisPovrat: {
        title: "Otpis ili povrat",
        type: "string",
      },
      dobavljac: {
        title: "Dobavljač",
        type: "string",
      },
      napomena: {
        title: "Napomena",
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
        title: "UV",
        type: "number",
        valuePrepareFunction: (value, row, cell) => {
          return formatCurrency(value, 'bs-BS', 'KM')
        }
      },
    },
  };
  data = [];

  source: LocalDataSource = new LocalDataSource();
  readonly brojNeuslovneRobe: string;

  constructor(private dataService: DataService, private route: ActivatedRoute) {
    this.brojNeuslovneRobe = this.route.snapshot.paramMap.get("brojNeuslovneRobe");
  }

  ngOnInit(): void {
    this.dataService.prikaziDetaljeNeuslovnaRoba(this.brojNeuslovneRobe).subscribe(
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
