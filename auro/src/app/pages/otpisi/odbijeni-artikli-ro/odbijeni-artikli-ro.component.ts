import { formatCurrency } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';
import { DataService } from '../../../@core/utils/data.service';

@Component({
  selector: 'ngx-odbijeni-artikli-ro',
  templateUrl: './odbijeni-artikli-ro.component.html',
  styleUrls: ['./odbijeni-artikli-ro.component.scss']
})
export class OdbijeniArtikliROComponent implements OnInit {
  komentarOtpis: string;
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
      },
    },
  };
  dataOdbijeniArtikli = [];
  sourceOdbijeniArtikli: LocalDataSource = new LocalDataSource();
  readonly brojOtpisa: string;
  constructor(private dataService: DataService, private route: ActivatedRoute) {
    this.brojOtpisa = this.route.snapshot.paramMap.get("brojOtpisa");
  }

  ngOnInit(): void {
    //Edit pozvati servis za prikaz odbijenih artikla sa otpisa
    this.dataService.prikaziDetaljeRedovnogOtpisaOdbijeno(this.brojOtpisa).subscribe(
      (r) => {
        this.dataOdbijeniArtikli = r;
        this.sourceOdbijeniArtikli.load(this.dataOdbijeniArtikli);
        this.komentarOtpis = r[0].komentarOtpis;
      },
      (err) => {
        const greska = err.error?.poruka ?? err.statusText;
        Swal.fire("Greška", "Greška: " + greska, "error");
      }
    );
  }

}
