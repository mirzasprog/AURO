import { Component, OnInit } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import Swal from "sweetalert2";
import { DataService } from "../../../@core/utils/data.service";
import { ButtonOdbijeniArtikliVoComponent } from "./button-odbijeni-artikli-vo/button-odbijeni-artikli-vo.component";
import { ButtonOdobreniArtikliVoComponent } from "./button-odobreni-artikli-vo/button-odobreni-artikli-vo.component";
import { TabelaDugmeVanredniComponent } from "./tabela-dugme/tabela-dugme-vanredni.component";

@Component({
  selector: "ngx-pregled-vanrednih-otpisa",
  templateUrl: "./pregled-vanrednih-otpisa.component.html",
  styleUrls: ["./pregled-vanrednih-otpisa.component.scss"],
})
export class PregledVanrednihOtpisaComponent implements OnInit {
  settings = {
    actions: false,
    //Kolone za popunjavanje
    columns: {
      brojOtpisa: {
        title: "Broj otpisa",
        type: "string",
      },
      prodavnica: {
        title: "Prodavnica",
        type: "string",
      },
      datumPopunjavanja: {
        title: "Datum prijave",
        type: "Date",
      },
      status: {
        title: "Status",
        type: "string",
      },
      podneseno: {
        title: "Podneseno",
        type: "custom",
        filter: false,
        renderComponent: TabelaDugmeVanredniComponent
      },
      odobreno: {
        title: "Odobreno",
        type: "custom",
        filter: false,
        renderComponent: ButtonOdobreniArtikliVoComponent
      },
      odbijeno: {
        title: "Odbijeno",
        type: "custom",
        filter: false,
        renderComponent: ButtonOdbijeniArtikliVoComponent
      },
  
    },
  };

  data = [];
  unos: { datumOd: Date; datumDo: Date };
 // unos = 
   //{datumOd: null, datumDo : null} 
  
  source: LocalDataSource = new LocalDataSource();

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    this.unos = { datumOd:null, datumDo: null };
    // this.unos = null;
  
  }
  prikaziOtpis(){
    this.dataService.pregledajVanredneOtpise(this.unos.datumOd.toLocaleDateString(), this.unos.datumDo.toLocaleDateString()).subscribe(
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
       // this.ucitavanje = false;
        const greska = err.error.poruka || err.statusText;
        Swal.fire("Greška", "Greška: " + greska, "error");
      }
    );
  }
}
