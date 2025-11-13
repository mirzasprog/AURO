import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';
import { DataService } from '../../../../@core/utils/data.service';
import { DetaljiRedovnogOtpisaComponent } from './detalji-redovnog-otpisa/detalji-redovnog-otpisa.component';

@Component({
  selector: 'ngx-redovni-otpis',
  templateUrl: './redovni-otpis.component.html',
  styleUrls: ['./redovni-otpis.component.scss']
})
export class RedovniOtpisComponent implements OnInit {

  settings = {
    actions: false,
    columns: {
      brojOtpisa: {
        title: "Broj otpisa",
        type: "string"
      },
      prodavnica: {
        title: "Prodavnica",
        type: "string"
      },
      datumPopunjavanja: {
        title: "Datum prijave",
        type: "Date"
      },
      status: {
        title: "Status",
        type: "string"
      },
      datumOvjerePodrucnog: {
        title: "Datum ovjere područnog",
        type: "Date"
      },
      datumOvjereRegionalnog: {
        title: "Datum ovjere regionalnog",
        type: "Date"
      },
      button: {
        title: "Detalji",
        type: "custom",
        filter: false,
        renderComponent: DetaljiRedovnogOtpisaComponent
      },
    }
  }

  data = [];

  source: LocalDataSource = new LocalDataSource();
  unos: { datumOd: Date; datumDo: Date };

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.unos = { datumOd: null, datumDo: null };
  }

  prikaziOtpiseInterna() {
    this.dataService.pregledajRedovneOtpiseInterna(this.unos.datumOd.toLocaleDateString(), this.unos.datumDo.toLocaleDateString()).subscribe(
      (r) => {
        this.data = r;
        this.source.load(this.data);
        if(this.data.length ==0){
          Swal.fire({
            title: "Info",
            text: "Nema otpisa za navedeni datum!",
            icon: "info",
            showCancelButton: false,
            showConfirmButton:false,
            timer:3500,
          })
          return;
        }
      },
      (err) => {
        const greska = err.error?.poruka ?? err.statusText;
        Swal.fire("Greška", "Greška: " + greska, "error");
      }
    );
  }
}
