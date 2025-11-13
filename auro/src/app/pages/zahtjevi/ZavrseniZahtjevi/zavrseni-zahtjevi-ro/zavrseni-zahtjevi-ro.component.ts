import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';
import { DataService } from '../../../../@core/utils/data.service';
import { ZahtjeviDetaljiRoComponent } from './zahtjevi-detalji-ro/zahtjevi-detalji-ro.component';

@Component({
  selector: 'ngx-zavrseni-zahtjevi-ro',
  templateUrl: './zavrseni-zahtjevi-ro.component.html',
  styleUrls: ['./zavrseni-zahtjevi-ro.component.scss']
})
export class ZavrseniZahtjeviRoComponent implements OnInit {
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
      button: {
        title: "Akcije",
        type: "custom",
        filter: false,
        renderComponent: ZahtjeviDetaljiRoComponent
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

  //EDIT POZIVANJE SERVISA
  prikaziOtpisePodrucniRegionalni() {
    //EDIT
    this.dataService.pregledajZavrseneZahtjeveRedovnogOtpisa(this.unos.datumOd.toISOString(), this.unos.datumDo.toISOString()).subscribe(
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
