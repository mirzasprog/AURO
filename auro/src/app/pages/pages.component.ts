import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import { DataService } from "../@core/utils/data.service";
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { MENU_ITEMS } from "./pages-menu";
import { NbMenuItem } from "@nebular/theme";
import { VikendAkcija } from "../@core/data/vikend-akcija";

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

  private findMenuItem(path: string[]): NbMenuItem | undefined {
    let items: NbMenuItem[] | undefined = this.menu;
    let current: NbMenuItem | undefined;

    for (const segment of path) {
      current = items?.find(item => item.title === segment);
      if (!current) {
        return undefined;
      }
      items = current.children as NbMenuItem[] | undefined;
    }

    return current;
  }

  private setMenuHidden(path: string[], hidden: boolean): void {
    const item = this.findMenuItem(path);
    if (item) {
      item.hidden = hidden;
    }
  }

  private setVikendAkcijeBadge(aktivna: boolean): void {
    const vikendAkcijeItem = this.findMenuItem(["Vikend akcije"]);

    if (!vikendAkcijeItem) {
      return;
    }

    vikendAkcijeItem.badge = aktivna
      ? { text: '', status: 'success', dotMode: true }
      : undefined;
  }

  private postaviVikendAkcijeNotifikaciju(): void {
    this.dataService.preuzmiVikendAkcije().subscribe({
      next: (akcije: VikendAkcija[]) => {
        const postojiAktivna = akcije?.some(akcija => this.jeVikendAkcijaAktivna(akcija));
        this.setVikendAkcijeBadge(!!postojiAktivna);
      },
      error: () => this.setVikendAkcijeBadge(false),
    });
  }

  private jeVikendAkcijaAktivna(akcija: VikendAkcija): boolean {
    const status = (akcija.status ?? '').toLowerCase();
    if (status) {
      return status === 'aktivna' || status === 'aktivno';
    }

    const sada = new Date();
    const pocetak = new Date(akcija.pocetak);
    const kraj = new Date(akcija.kraj);

    if (isNaN(pocetak.getTime()) || isNaN(kraj.getTime())) {
      return false;
    }

    return sada >= pocetak && sada <= kraj;
  }

  //Funkcija za preikaz linkova u side baru u ovisnosti od role
  PregledPoRolama() {
    this.authService.getToken()
      .subscribe((token: NbAuthJWTToken) => {
        this.role = token.getPayload()["role"]
        let rola = token.getPayload()["role"]
        if (rola == "prodavnica") {
          this.setMenuHidden(["Dnevni zadaci"], false);
          this.setMenuHidden(["Otpis"], false);
          this.setMenuHidden(["Inventure", "Pregled"], true);
          this.setMenuHidden(["Inventure"], false);
          this.setMenuHidden(["Zahtjevi"], true);
          this.setMenuHidden(["Pregled"], true);
          this.setMenuHidden(["Datumi"], true);
          this.setMenuHidden(["Pregled dinamike otpisa"], true);
          this.setMenuHidden(["Završeni zahtjevi"], true);
          this.setMenuHidden(["Akcije"], true);
          this.setMenuHidden(["Vikend akcije"], false);
          this.setMenuHidden(["Kvaliteta VIP-a"], false);
         // this.setMenuHidden(["Fakturisanje"], true);
        }
        else if (rola == "interna") {
          this.setMenuHidden(["Dnevni zadaci"], false);
          this.setMenuHidden(["Otpis"], true);
          this.setMenuHidden(["Inventure", "Unos"], true);
          this.setMenuHidden(["Inventure"], false);
          this.setMenuHidden(["Zahtjevi"], true);
          this.setMenuHidden(["Pregled"], false);
          this.setMenuHidden(["Datumi"], false);
          this.setMenuHidden(["Pregled dinamike otpisa"], false);
          this.setMenuHidden(["Završeni zahtjevi"], true);
          this.setMenuHidden(["Akcije"], true);
          this.setMenuHidden(["Vikend akcije"], true);
          this.setMenuHidden(["Kvaliteta VIP-a"], true);
         // this.setMenuHidden(["Fakturisanje"], true);
        }
        else if (rola == "podrucni") {
          this.setMenuHidden(["Dnevni zadaci"], false);
          this.setMenuHidden(["Otpis"], true);
          this.setMenuHidden(["Inventure", "Unos"], true);
          this.setMenuHidden(["Inventure"], true);
          this.setMenuHidden(["Zahtjevi"], false);
          this.setMenuHidden(["Pregled"], true);
          this.setMenuHidden(["Datumi"], true);
          this.setMenuHidden(["Pregled dinamike otpisa"], true);
          this.setMenuHidden(["Završeni zahtjevi"], false);
          this.setMenuHidden(["Akcije"], true);
          this.setMenuHidden(["Vikend akcije"], true);
          this.setMenuHidden(["Kvaliteta VIP-a"], true);
        //  this.setMenuHidden(["Fakturisanje"], true);
        }
        else if (rola == "regionalni") {
          this.setMenuHidden(["Dnevni zadaci"], false);
          this.setMenuHidden(["Otpis"], true);
          this.setMenuHidden(["Inventure"], true);
          this.setMenuHidden(["Zahtjevi"], false);
          this.setMenuHidden(["Pregled"], true);
          this.setMenuHidden(["Datumi"], true);
          this.setMenuHidden(["Pregled dinamike otpisa"], true);
          this.setMenuHidden(["Završeni zahtjevi"], false);
          this.setMenuHidden(["Akcije"], true);
          this.setMenuHidden(["Vikend akcije"], true);
          this.setMenuHidden(["Kvaliteta VIP-a"], true);
        //  this.setMenuHidden(["Fakturisanje"], true);
        }
        else if (rola == "kontrola_kvaliteta") {
          this.setMenuHidden(["Dnevni zadaci"], false);
          this.setMenuHidden(["Otpis"], true);
          this.setMenuHidden(["Inventure"], true);
          this.setMenuHidden(["Zahtjevi"], true);
          this.setMenuHidden(["Pregled"], true);
          this.setMenuHidden(["Datumi"], true);
          this.setMenuHidden(["Pregled dinamike otpisa"], true);
          this.setMenuHidden(["Završeni zahtjevi"], true);
          this.setMenuHidden(["Akcije"], true);
          this.setMenuHidden(["Vikend akcije"], true);
          this.setMenuHidden(["Kvaliteta VIP-a"], false);
         // this.setMenuHidden(["Fakturisanje"], true);
        }
        else if (rola == "uprava") {
          this.setMenuHidden(["Dnevni zadaci"], false);
          this.setMenuHidden(["Otpis"], true);
          this.setMenuHidden(["Inventure"], true);
          this.setMenuHidden(["Zahtjevi"], true);
          this.setMenuHidden(["Pregled"], true);
          this.setMenuHidden(["Datumi"], true);
          this.setMenuHidden(["Pregled dinamike otpisa"], true);
          this.setMenuHidden(["Završeni zahtjevi"], true);
          this.setMenuHidden(["Akcije"], true);
          this.setMenuHidden(["Vikend akcije"], false);
          this.setMenuHidden(["Kvaliteta VIP-a"], true);
         // this.setMenuHidden(["Fakturisanje"], true);
        }
        else if(rola == "finansije") {
          this.setMenuHidden(["Dnevni zadaci"], false);
          this.setMenuHidden(["Otpis"], true);
          this.setMenuHidden(["Inventure"], true);
          this.setMenuHidden(["Zahtjevi"], true);
          this.setMenuHidden(["Pregled"], true);
          this.setMenuHidden(["Datumi"], true);
          this.setMenuHidden(["Pregled dinamike otpisa"], true);
          this.setMenuHidden(["Završeni zahtjevi"], true);
          this.setMenuHidden(["Akcije"], true);
          this.setMenuHidden(["Vikend akcije"], true);
          this.setMenuHidden(["Kvaliteta VIP-a"], true);
          this.setMenuHidden(["Fakturisanje"], false);
        }       
        else {
          this.setMenuHidden(["Dnevni zadaci"], false);
          this.setMenuHidden(["Otpis"], true);
          this.setMenuHidden(["Inventure"], true);
          this.setMenuHidden(["Zahtjevi"], true);
          this.setMenuHidden(["Pregled"], true);
          this.setMenuHidden(["Datumi"], true);
          this.setMenuHidden(["Pregled dinamike otpisa"], true);
          this.setMenuHidden(["Završeni zahtjevi"], true);
          this.setMenuHidden(["Akcije"], true);
          this.setMenuHidden(["Vikend akcije"], true);
          this.setMenuHidden(["Kvaliteta VIP-a"], true);
          this.setMenuHidden(["Fakturisanje"], true);
        }
      })
  }

  ngOnInit(): void {
    this.PregledPoRolama();
    this.postaviVikendAkcijeNotifikaciju();
    //Servis za provjeru da li je omogućen redovni otpis za rolu : Prodavnica
    this.dataService.provjeriOmogucenOtpis().subscribe(
      (otpis) => {
        if (otpis.omogucenUnosOtpisa) {
          this.setMenuHidden(["Otpis", "Redovni", "Novi redovni otpis"], false);
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
          this.setMenuHidden(["Otpis", "Redovni", "Novi redovni otpis"], true);
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
            this.setMenuHidden(["Inventure"], false);
            return;
          }
          else {
            this.setMenuHidden(["Inventure"], true);
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
