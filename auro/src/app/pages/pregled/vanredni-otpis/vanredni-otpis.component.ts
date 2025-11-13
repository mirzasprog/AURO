import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';
import { DataService } from '../../../@core/utils/data.service';
import { DetaljiVoComponent } from './detalji-vo/detalji-vo.component';

@Component({
  selector: 'ngx-vanredni-otpis',
  templateUrl: './vanredni-otpis.component.html',
  styleUrls: ['./vanredni-otpis.component.scss']
})
export class VanredniOtpisComponent implements OnInit {

  settings= {
    actions: false,
//Kolone za popunjavanje
    columns: {
      brojOtpisa: {
        title: "Broj otpisa",
        type: "number",
      },
      prodavnica: {
        title: "Prodavnica",
        type: "string",
      },
      datumPopunjavanja: {
        title: "Datum prijave",
        type: "date",
      },
      status: {
        title: "Status",
        type: "string",
      },
      artikli: {
        title: "Detalji",
        type: "custom",
        filter: false,
        renderComponent: DetaljiVoComponent
      },
    }
  };
  
  data = [];

  source: LocalDataSource = new LocalDataSource();
  unos: { datumOd: Date; datumDo: Date };

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.unos = { datumOd: null, datumDo: null };
  }
  //Metoda za brisanje podataka/stavki
  onDeleteConfirm(event): void{
    if (window.confirm("Želite li obrisati stavku?")) {
      event.confirm.resolve();
    }else{
      event.confirm.reject();
    }
  }
  prikaziVanredneOtpiseInterna() {
    this.dataService.pregledajVanredneOtpiseInterna(this.unos.datumOd.toLocaleDateString(), this.unos.datumDo.toLocaleDateString()).subscribe(
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
