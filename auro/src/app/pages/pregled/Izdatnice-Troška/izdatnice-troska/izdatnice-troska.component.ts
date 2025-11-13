import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';
import { DataService } from '../../../../@core/utils/data.service';
import { DetaljiIzdatniceComponent } from '../detalji-izdatnice/detalji-izdatnice.component';

@Component({
  selector: 'ngx-izdatnice-troska',
  templateUrl: './izdatnice-troska.component.html',
  styleUrls: ['./izdatnice-troska.component.scss']
})
export class IzdatniceTroskaComponent implements OnInit {
  settings = {
    actions: false,
    columns: {
      brojIzdatnice: {
        title: "Broj izdatnice troška",
        type: "string"
      },
      prodavnica: {
        title: "Prodavnica",
        type: "string"
      },
      datumPopunjavanja: {
        title: "Datum popunjavanja",
        type: "Date"
      },
      button: {
        title: "Akcije",
        type: "custom",
        filter: false,
       renderComponent: DetaljiIzdatniceComponent   
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

  prikaziIzdatniceTroskaInterna() {
    this.dataService.pregledajIzdatniceTroskaInterna(this.unos.datumOd.toLocaleDateString(), this.unos.datumDo.toLocaleDateString()).subscribe(
      (r) => {
        this.data = r;
        this.source.load(this.data);
        if(this.data.length ==0){
          Swal.fire({
            title: "Info",
            text: "Nema izdatnica troška za navedeni datum!",
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
