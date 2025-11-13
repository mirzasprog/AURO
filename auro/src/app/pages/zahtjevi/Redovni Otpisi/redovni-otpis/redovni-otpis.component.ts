import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';
import { DataService } from '../../../../@core/utils/data.service';
import { ArtikliDetaljiComponent } from './artikli-detalji/artikli-detalji.component';

@Component({
  selector: 'ngx-redovni-otpis',
  templateUrl: './redovni-otpis.component.html',
  styleUrls: ['./redovni-otpis.component.scss']
})
export class RedovniOtpisComponent implements OnInit {
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
        renderComponent: ArtikliDetaljiComponent
      },
    }
  };

  data = [];
  source: LocalDataSource = new LocalDataSource();
  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    // nakon što se odobri/odbije zahtjev vrši se redirekcija na ovu stranicu
    // naredba ponovo učitava stranicu umjesto da se koristi stranica iz memorije
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.dataService.prikaziZahtjeveRedovnogOtpisa().subscribe(
      (r) => {
        this.data = r;
        this.source.load(this.data);
      },
      (err) => {
       // this.ucitavanje = false;
        const greska = err.error?.poruka ?? err.statusText;
        Swal.fire("Greška", "Greška: " + greska, "error");
      }
    );
 
  }

}
