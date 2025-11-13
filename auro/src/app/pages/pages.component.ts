import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import { DataService } from "../@core/utils/data.service";
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { MENU_ITEMS } from "./pages-menu";

@Component({
  selector: "ngx-pages",
  styleUrls: ["pages.component.scss"],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})

export class PagesComponent implements OnInit {
  menu = MENU_ITEMS;
  role: any;
  constructor(private dataService: DataService, public authService: NbAuthService) { }
  //Funkcija za preikaz linkova u side baru u ovisnosti od role
  PregledPoRolama() {
    this.authService.getToken()
      .subscribe((token: NbAuthJWTToken) => {
        this.role = token.getPayload()["role"]
        let rola = token.getPayload()["role"]
        if (rola == "prodavnica") {
          this.menu[1].hidden = false; //Otpis
          this.menu[2].children[0].hidden = true; //Pregled inventure za podrucnog
          this.menu[2].hidden = false; // Inventure
          this.menu[3].hidden = true; //Zahtjevi
          this.menu[4].hidden = true; //Pregled
          this.menu[5].hidden = true; //Unos datuma za redovni otpis
          this.menu[6].hidden = true;  //Dinamika otpisa
          this.menu[7].hidden = true;  //Pregled završenih zahtjeva
          this.menu[8].hidden = true;  //Akcije
          this.menu[9].hidden = false;  //Reklamacije VIP
        }
        else if (rola == "interna") {
          this.menu[1].hidden = true; //Otpis
          this.menu[2].children[1].hidden = true; //Unos inventure
          this.menu[2].hidden = false; // Inventure
          this.menu[3].hidden = true; //Zahtjevi
          this.menu[4].hidden = false; //Pregled
          this.menu[5].hidden = false; //Unos datuma za redovni otpis
          this.menu[6].hidden = false;  //Dinamika otpisa
          this.menu[7].hidden = true;  //Pregled završenih zahtjeva
          this.menu[8].hidden = true;  //Akcije
          this.menu[9].hidden = true;  //Reklamacije VIP
        }
        else if (rola == "podrucni") {
          this.menu[1].hidden = true; //Otpis
          this.menu[2].children[1].hidden = true; //Unos inventure
          this.menu[2].hidden = true; // Inventure
          this.menu[3].hidden = false; //Zahtjevi
          this.menu[4].hidden = true; //Pregled
          this.menu[5].hidden = true; //Unos datuma za redovni otpis
          this.menu[6].hidden = true;  //Dinamika otpisa
          this.menu[7].hidden = false;  //Pregled završenih zahtjeva
          this.menu[8].hidden = true;  //Akcije
          this.menu[9].hidden = true;  //Reklamacije VIP
        }
        else if (rola == "regionalni") {
          this.menu[1].hidden = true; //Otpis
          this.menu[2].hidden = true; // Inventure
          this.menu[3].hidden = false; //Zahtjevi
          this.menu[4].hidden = true; //Pregled
          this.menu[5].hidden = true; //Unos datuma za redovni otpis
          this.menu[6].hidden = true;  //Dinamika otpisa
          this.menu[7].hidden = false;  //Pregled završenih zahtjeva
          this.menu[8].hidden = true;  //Akcije
          this.menu[9].hidden = true;  //Reklamacije VIP
        }        
        else if (rola == "kontrola_kvaliteta") {
          this.menu[1].hidden = true;
          this.menu[2].hidden = true;
          this.menu[3].hidden = true;
          this.menu[4].hidden = true;
          this.menu[5].hidden = true;
          this.menu[6].hidden = true;
          this.menu[7].hidden = true;
          this.menu[8].hidden = true;  
          this.menu[9].hidden = false;  
        }
        else {
          this.menu[1].hidden = true;
          this.menu[2].hidden = true;
          this.menu[3].hidden = true;
          this.menu[4].hidden = true;
          this.menu[5].hidden = true;
          this.menu[6].hidden = true;
          this.menu[7].hidden = true;
          this.menu[8].hidden = true;  
          this.menu[9].hidden = true;  
        }
      })
  }

  ngOnInit(): void {
    this.PregledPoRolama();
    //Servis za provjeru da li je omogućen redovni otpis za rolu : Prodavnica
    this.dataService.provjeriOmogucenOtpis().subscribe(
      (otpis) => {
        if (otpis.omogucenUnosOtpisa) {
          this.menu[1].children[0].children[0].hidden = false;
          if (localStorage.getItem("zavrsen_otpis")) {
            return;
          }
          else {
            if (this.role == 'prodavnica') {
              Swal.fire('Info', 'Imate aktivan redovni otpis koji niste popunili!', 'info');
            }
            else {
              return;
            }

          }

        } else {
          localStorage.setItem("zavrsen_otpis", "0");
          this.menu[1].children[0].children[0].hidden = true;
        }
      },
      (err) => {
        const greska = err.error?.poruka ?? err.statusText;
        console.log(greska);
        Swal.fire("Greška", "Greška: " + greska, "error");
      }
    );
    if (this.role == 'podrucni') {
      //Servis za provjeru da li je omoguceno odobravanje inenture za rolu podrucni
      this.dataService.provjeriOdobrenjeInventure().subscribe(
        (parametar) => {
          if (parametar.unos) {
            this.menu[2].hidden = false;
            return;
          }
          else {
            this.menu[2].hidden = true;
            return;
          }
        },
        (err) => {
          const greska = err.error?.poruka ?? err.statusText;
          console.log(greska);
          Swal.fire("Greška", "Greška: " + greska, "error");
        }
      );
    }
    else {
      return;
    }

  }
}
