import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';
import { DataService } from '../../../../@core/utils/data.service';
import { NbIconLibraries } from '@nebular/theme';

@Component({
  selector: 'ngx-dinamika-redovnih-otpisa',
  templateUrl: './dinamika-redovnih-otpisa.component.html',
  styleUrls: ['./dinamika-redovnih-otpisa.component.scss']
})
export class DinamikaRedovnihOtpisaComponent implements OnInit {
  settings = {
    actions: false,
    columns: {
      datumOd: {
        title: "Datum početka",
        type: "date",
        valuePrepareFunction: (value, row, cell) => {
          return formatDate(value, 'dd.MM.yyyy', 'bs-BS')
        },
      },
      datumDo: {
        title: "Datum završetka",
        type: "Date",
        valuePrepareFunction: (value, row, cell) => {
          return formatDate(value, 'dd.MM.yyyy', 'bs-BS')
        },
      },

    },
  };

  data = [];
  unos: { datumOd: Date; datumDo: Date };
  source: LocalDataSource = new LocalDataSource();

  constructor(private dataService: DataService,private iconService: NbIconLibraries) {
    this.iconService.registerFontPack('font-awesome', { packClass: 'fa' }); 
  }

  ngOnInit(): void {
    this.unos = { datumOd:null, datumDo: null };
    // this.unos = null;
  
  }
  prikaziOtpis(){
    this.dataService.pregledajDinamikuOtpisa(this.unos.datumOd.toLocaleDateString(), this.unos.datumDo.toLocaleDateString()).subscribe(
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
       // this.ucitavanje = false;
        const greska = err.error.poruka || err.statusText;
        Swal.fire("Greška", "Greška: " + greska, "error");
      }
    );
  }

}
