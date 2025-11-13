import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';
import { DataService } from '../../../@core/utils/data.service';
import { NbIconLibraries } from '@nebular/theme';

@Component({
  selector: 'ngx-nema-otpisa',
  templateUrl: './nema-otpisa.component.html',
  styleUrls: ['./nema-otpisa.component.scss']
})
export class NemaOtpisaComponent implements OnInit {
  settings = {
    actions: false,
    columns: {
      brojProdavnice: {
        title: "Prodavnica",
        type: "string"
      },
      datumUnosa: {
        title: "Datum popunjavanja",
        type: "string"
      },
    }
  }

  data = [];

  source: LocalDataSource = new LocalDataSource();
  unos: { datumOd: Date; datumDo: Date };

  constructor(private dataService: DataService,private iconService: NbIconLibraries) {
    this.iconService.registerFontPack('font-awesome', { packClass: 'fa' });
   }

  ngOnInit(): void {
    this.unos = { datumOd: null, datumDo: null };
  }

  prikazi() {
    this.dataService.ProdavnicaBezOtpisa(this.unos.datumOd.toLocaleDateString(), this.unos.datumDo.toLocaleDateString()).subscribe(
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
