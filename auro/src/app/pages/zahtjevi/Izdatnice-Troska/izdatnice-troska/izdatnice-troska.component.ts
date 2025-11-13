import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';
import { DataService } from '../../../../@core/utils/data.service';
import { IzdatniceArtikliComponent } from './izdatnice-artikli/izdatnice-artikli.component';

@Component({
  selector: 'ngx-izdatnice-troska',
  templateUrl: './izdatnice-troska.component.html',
  styleUrls: ['./izdatnice-troska.component.scss']
})
export class IzdatniceTroskaComponent implements OnInit {
  settings= {
    actions: false,
//Kolone za popunjavanje
    columns: {
      brojIzdatnice: {
        title: "Broj izdatnice",
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
        renderComponent: IzdatniceArtikliComponent
      },
  
    }
  };

  data = [];
  source: LocalDataSource = new LocalDataSource();
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    //Pozivanje servisa za ispis zahtjeva koji cekaju na ovjeru u vanrednom otpisu   EDIT!!!!!!!!
    this.dataService.prikaziZahtjeveIzdatnice().subscribe(
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
