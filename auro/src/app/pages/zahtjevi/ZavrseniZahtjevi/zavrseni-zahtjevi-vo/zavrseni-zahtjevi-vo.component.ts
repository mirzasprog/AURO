import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';
import { DataService } from '../../../../@core/utils/data.service';
import { ZahtjeviDetaljiVoComponent } from './zahtjevi-detalji-vo/zahtjevi-detalji-vo.component';

@Component({
  selector: 'ngx-zavrseni-zahtjevi-vo',
  templateUrl: './zavrseni-zahtjevi-vo.component.html',
  styleUrls: ['./zavrseni-zahtjevi-vo.component.scss']
})
export class ZavrseniZahtjeviVoComponent implements OnInit {
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
        renderComponent: ZahtjeviDetaljiVoComponent
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

  //EDIT POZIVANJE SERVISA -- trenutno se poziva servis za pregled otpisa za internu kontrolu!!!!!
  prikaziOtpisePodrucniRegionalni() {
    //EDIT
    this.dataService.pregledajZavrseneZahtjeveVanrednogOtpisa(this.unos.datumOd.toISOString(), this.unos.datumDo.toISOString()).subscribe(
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
