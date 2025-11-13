import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';
import { DataService } from '../../../@core/utils/data.service';
import { DetaljiNeuslovneRobeComponent } from './detalji-neuslovne-robe/detalji-neuslovne-robe.component';

@Component({
  selector: 'ngx-neuslovna-roba',
  templateUrl: './neuslovna-roba.component.html',
  styleUrls: ['./neuslovna-roba.component.scss']
})
export class NeuslovnaRobaComponent implements OnInit {

  settings = {
    actions: false,
    columns: {
      brojNeuslovneRobe: {
        title: "Broj neuslovne robe",
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
        renderComponent: DetaljiNeuslovneRobeComponent
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

  prikaziNeuslovnuRobuInterna() {
    this.dataService.pregledajNeuslovuRobuInterna(this.unos.datumOd.toLocaleDateString(), this.unos.datumDo.toLocaleDateString()).subscribe(
      (r) => {
        this.data = r;
        this.source.load(this.data);
        if(this.data.length ==0){
          Swal.fire({
            title: "Info",
            text: "Nema podataka za navedeni datum!",
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
