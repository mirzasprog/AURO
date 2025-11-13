import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';
import { DataService } from '../../../@core/utils/data.service';
import { ButtonOdbijeniArtikliRoComponent } from './button-odbijeni-artikli-ro/button-odbijeni-artikli-ro.component';
import { ButtonOdobreniArtikliRoComponent } from './button-odobreni-artikli-ro/button-odobreni-artikli-ro.component';
import { TabelaDugmeRedovniComponent } from './tabela-dugme/tabela-dugme-redovni.component';
import { NbIconLibraries } from '@nebular/theme';

@Component({
  selector: "ngx-redovni",
  templateUrl: "./redovni.component.html",
  styleUrls: ["./redovni.component.scss"],
})
export class RedovniComponent implements OnInit {
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
      podneseniartikli: {
        title: "Podneseno",
        type: "custom",
        filter: false,
        renderComponent: TabelaDugmeRedovniComponent
      },
      odobreniartikli: {
        title: "Odobreno",
        type: "custom",
        filter: false,
        renderComponent: ButtonOdobreniArtikliRoComponent
      },
      odbijeniartikli: {
        title: "Odbijeno",
        type: "custom",
        filter: false,
        renderComponent: ButtonOdbijeniArtikliRoComponent
      },
    }
  };

  data = [];
  unos: { datumOd: Date; datumDo: Date };
  source: LocalDataSource = new LocalDataSource();

  constructor(private dataService: DataService, public router: Router,private iconService: NbIconLibraries) {
    this.iconService.registerFontPack('font-awesome', { packClass: 'fa' });
  }

  ngOnInit(): void {
  this.unos = { datumOd: null, datumDo: null };
  }
  
  prikaziOtpis(){
    this.dataService.pregledajRedovneOtpise(this.unos.datumOd.toLocaleDateString(), this.unos.datumDo.toLocaleDateString()).subscribe(
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
        const greska = err.error.poruka || err.statusText;
        Swal.fire("Greška", "Greška: " + greska, "error");
      }
    );
  }

  onDeleteConfirm(event): void {
    if (window.confirm("Želite li obrisati stavku?")) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
}
