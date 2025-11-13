import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';
import { DataService } from '../../../../@core/utils/data.service';
import { VanredniArtikliComponent } from './vanredni-artikli/vanredni-artikli.component';

@Component({
  selector: 'ngx-zahtjevi-vanredni-otpisi',
  templateUrl: './zahtjevi-vanredni-otpisi.component.html',
  styleUrls: ['./zahtjevi-vanredni-otpisi.component.scss']
})
export class ZahtjeviVanredniOtpisiComponent implements OnInit {
  settings= {
    actions: false,
  //Kolone za popunjavanje
    columns: {
      brojOtpisa: {
        title: "Broj otpisa",
        type: "string",
      },
      prodavnica: {
        title: "Podnosilac",
        type: "string",
      },
      datumPopunjavanja: {
        title: "Datum Popunjavanja",
        type: "date",
      },
      status: {
        title: "Status",
        type: "string",
      },
      artikli: {
        title: "Artikli",
        type: 'custom',
        renderComponent: VanredniArtikliComponent
      },
    }
  };

  data = [];
  source: LocalDataSource = new LocalDataSource();
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
//Pozivanje servisa za ispis zahtjeva koji cekaju na ovjeru u vanrednom otpisu
    this.dataService.prikaziZahtjeveVanrednogOtpisa().subscribe(
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
}
