import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../@core/utils/data.service';
import { NbDialogService, NbIconLibraries } from '@nebular/theme';
import { PregledStavkiComponent } from '../pregled-stavki/pregled-stavki.component';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { formatDate } from '@angular/common';
import { ImportujExcelService } from '../../../@core/services/importuj-excel.service';
import { IzvjestajParcijalnaInventura } from '../../../@core/data/izvjestaj-parcijalna-inventura';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { PregledProdavnicaInventuraComponent } from '../pregled-prodavnica-inventura/pregled-prodavnica-inventura.component';
import { PrebaciUExcelService } from '../../../@core/utils/prebaci-u-Excel.service';
import { PrebaciUExcelParcijalnaInvService } from '../../../@core/utils/prebacuUExcelParcijalnaInv.service';
import { ZahtjevObradaInterna } from '../../../@core/data/zahtjevObradaInterna';
interface Prodavnica {
  brojProd: string;
  datum?: string;
  status?: string;
  brojDokumenta?: string;
  napomena?: string;
  ukupno?: number;
}
@Component({
  selector: 'ngx-pregled-inventure',
  templateUrl: './pregled-inventure.component.html',
  styleUrls: ['./pregled-inventure.component.scss']
})

export class PregledInventureComponent implements OnInit {
  //Varijabla koja označava prvi page u tabeli
  first = 0;
  //Varijabla koja predstavlja broj redova koje korisnik vidi u tabeli
  rows = 10;
  //Varijabla za spremanje role prijavljenog korisnika
  rola: string;
  //Varijabla za spremanje datuma za koji se generise Excel => rola: Interna kontrola
  datum: Date;
  //Array sa objektima za prikaz u tabeli => rola: Područni voditelj
  prod: Prodavnica[] = [];  
  //Array sa objektima za prikaz u tabeli => rola: Interna kontrola
  prodavnice: Prodavnica[] = [];
  //Datum za inventuru
  datumPodrucni: Date;
  //Podaci koji se eksportuju u Excel za parcijalne inventure  => rola: Interna kontrola
  izvjestajParcijalnaInventura: IzvjestajParcijalnaInventura[];
  //Varijabla za spremanje role prijavljenog korisnika na apikaciju
  role: any;
  //Lista za spremanje prodavnica koje nisu zaključile inventuru
  data = [];
  //Varijabla za disable-anje button-a za spremanje dokumenta ukoliko korisnik nije obradio sve zahtjeve
  zakljucajSpremanje: boolean = true;
  //Varijabla koja sprema vrstu inventure za koju se povlaci izvjestaj
  vrstaInv : string;
  //Lista koja sprema podatke prilikom obrade zahtjeva od strane interne kontrole
  obradaZahtjevaInterna: ZahtjevObradaInterna = {} as ZahtjevObradaInterna ;
  //Varijabla koja sprema korisnicko ime prijavljenog korisnika
  korisnickoIme: string;

  constructor(
    private iconService: NbIconLibraries,
    private dialogService: NbDialogService,
    public authService: NbAuthService,
    private excelService: ImportujExcelService,
    private exportExcelService: PrebaciUExcelService,
    private exportExcelParcijalnaService: PrebaciUExcelParcijalnaInvService,
    private dataService: DataService,
    private router: Router) {
    this.iconService.registerFontPack('font-awesome', { packClass: 'fa' });
  }

  ngOnInit(): void {
    //Servis za prikupoanje podataka o prijavljenom korisniku
    this.authService.getToken().subscribe((token: NbAuthJWTToken) => {
      this.rola = token.getPayload()["role"];
      this.korisnickoIme = token.getPayload()["name"];
    });
    /**Logika koja osigurava da korisnik ne moze pristupiti komponenti za odobrenje inventure ukoliko
     * nema te ovlasti ili datum nije u okviru predefinisanih datuma za unos i obradu ovih podataka
    */
    if (this.rola == 'podrucni') {
      //Servis za provjeru da li je omoguceno odobravanje inenture za rolu podrucni
      this.dataService.provjeriOdobrenjeInventure().subscribe(
        (parametar) => {
          if (parametar.unos) {
            return;
          }
          else {
            this.router.navigate(['pages/pocetna-stranica/radna-ploca'])
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

  //Funkcija koja prikazuje detale o inventuri
  otvoriModal(objekat: Prodavnica) {
    this.dialogService.open(PregledStavkiComponent, {
      closeOnBackdropClick: false, hasScroll: true,
      context: { objekat: objekat }
    }).onClose.subscribe(
      (podaci) => {
        if(podaci === 'Odobreno') {
          objekat.status = 'Odobreno';
          objekat.napomena = '-';
          this.validacijaUnosaKorisnika(); 
        }
        else if (podaci){
          objekat.status = 'Odbijeno';
          objekat.napomena = podaci;
          this.validacijaUnosaKorisnika();
        }
        else if (!podaci){
          this.validacijaUnosaKorisnika();
         return;
        }
      });
  }

  //Funkacija za zakljucivanje dokumenta => Rola: Područni voditelj 
  spremi() {
    if(this.validacijaUnosaKorisnika()){
      alert("Imate neobrađenih prodavnica!");
      return;
    }
    const formattedDate = formatDate(this.datumPodrucni, 'MM/yyyy', 'bs-BS');
    this.dataService.pregledProdavnicaInventura(formattedDate).subscribe(
      (r) => {
        this.data = r;
    
        if(this.data.length > 0){
          this.dialogService.open(PregledProdavnicaInventuraComponent, {
            closeOnBackdropClick: true,
            hasScroll: true, context: { podaci: this.data }
          });
          return;    
        } 
        else {
          this.dataService.zakljuciDokumentInventura(this.prod).subscribe(
            (_)=> {
              Swal.fire('Uspješno spremljeno!', 'Potvrdili ste parcijelnu inventuru.', 'success');
            });
        }      
      });
  }  

  //Funkacija za provjeru da li su sve prodavnice zakljucile inventuru => Rola: Područni voditelj 
  provjeriBrojProd() {
    const formattedDate = formatDate(this.datumPodrucni, 'MM/yyyy', 'bs-BS');
    this.dataService.pregledProdavnicaInventura(formattedDate).subscribe(
      (r) => {
        this.data = r;
        if(this.data.length > 0){
          this.dialogService.open(PregledProdavnicaInventuraComponent, {
            closeOnBackdropClick: true,
            hasScroll: true, context: { podaci: this.data }
          });
          return;
        }
        else {
          Swal.fire('Info', 'Sve prodavnice su zaključile inventuru.', 'info');
          return;
        }
 
      }
    )
  }

  //Funkcija za spremanje Excela => Rola: Interna kontrola
  preuzmi() {
    if(this.vrstaInv == 'parcijalna') {
      this.dataService
      .preuzmiIzvjestajParcijalneInventure(
        formatDate(this.datum, 'MM/yyyy', 'bs-BS'), this.vrstaInv
      ).subscribe(
        (r) => {
        // Ako nema podataka za taj datum
        if (r.length < 1) {
          Swal.fire({
            title: 'Info',
            text: 'Nema podatka za odabrani datum.',
            timer: 2000,
            icon: 'info'
          });
        return;
       }
          this.izvjestajParcijalnaInventura = r;
          this.exportExcelParcijalnaService.exportAsExcelFile(this.izvjestajParcijalnaInventura, 'Parcijalna Inventura');
        },
        (err) => {
          const greska = err.error.poruka || err.statusText;
          Swal.fire("Greška", "Greška: " + greska, "error");
        }
      );
    }
    else if (this.vrstaInv == 'godisnja') {
      this.dataService
      .preuzmiIzvjestajPotpuneInventure(
        formatDate(this.datum, 'MM/yyyy', 'bs-BS'), this.vrstaInv
      ).subscribe(
        (r) => {
        // Ako nema podataka za taj datum
        if (r.length < 1) {
          Swal.fire({
            title: 'Info',
            text: 'Nema podatka za odabrani datum.',
            timer: 2000,
            icon: 'info'
          });
        return;
       }
          this.izvjestajParcijalnaInventura = r;
          this.exportExcelService.exportAsExcelFile(this.izvjestajParcijalnaInventura, 'Potpuna Inventura');
        },
        (err) => {
          const greska = err.error.poruka || err.statusText;
          Swal.fire("Greška", "Greška: " + greska, "error");
        }
      );
    }

  }

  //Funkcija za provjeru da li je korisnik unio sve tražene podatke prije zaključivanja dokumenta
  validacijaUnosaKorisnika(): boolean {
    for (let prodavnica of this.prod) {
        if (prodavnica.status === 'Na čekanju') {
            this.zakljucajSpremanje = true;
            return true; 
        }
    }
    this.zakljucajSpremanje = false;
    return false;
}

  //Funkcija za import uposlenika => Rola: interna kontrola
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.excelService.readExcel(file).then(data => {
        this.excelService.sendToBackend(data).subscribe(_ => {
          Swal.fire("Info", "Fajl je uspješno učitan!", "info");
        });
      }).catch(error => {
        const greska = error.error.poruka || error.statusText;
        Swal.fire("Greška", "Provjerite da li su uneseni podaci za sve kolone i nazive kolona!", "error");
        console.error("Greska: " + greska);
      });
    }
  }

  //Funkcija za spremanje datuma za koji ce se ispisati podaci => Rola: interna kontrola
  spremiParcijalnuInventuru(): void {
    if(this.validacijaUnosaKorisnika()){
      alert("Nisu uneseni svi podaci!")
      return;
    }

    this.dataService
      .preuzmiIzvjestajParcijalneInventure(
        formatDate(this.datum, 'MM/yyyy', 'bs-BS'), 'parcijalna'
      )
      .subscribe(
        (r) => {
          this.izvjestajParcijalnaInventura = r;
        },
        (err) => {
          const greska = err.error.poruka || err.statusText;
          Swal.fire("Greška", "Greška: " + greska, "error");
        }
      );

  }

  //Funkcija za pregled inventura po mjesecu
  pregledajZahtjev(){
    if(this.rola == 'podrucni') {
      const date = formatDate(this.datumPodrucni, 'MM/yyyy', 'bs-BS');
      this.dataService.getZaglavljePodrucni(date).subscribe(
        (r) => {
          this.prod = r;
          // Ako nema podataka za taj datum
          if (r.length < 1) {
            Swal.fire({
              title: 'Info',
              text: 'Nema podatka za odabrani datum.',
              timer: 2000,
              icon: 'info'
            });
          }
          // Prolazi kroz svaki objekat u `prod` i ažurira `vrstaInventure` zbog preglednosti
          this.prod.forEach((item: any) => {
            if (item.vrstaInventure === 'godisnja') {
              item.vrstaInventure = 'Godišnja';
            } else if (item.vrstaInventure === 'parcijalna') {
              item.vrstaInventure = 'Parcijalna';
            }
          });
      
        });
    }
    else if (this.rola == 'interna') {
      const datum = formatDate(this.datum, 'MM/yyyy', 'bs-BS');
      this.dataService.getZaglavljeInterna(datum).subscribe(
        (r) => {
          this.prodavnice = r;
          // Ako nema podataka za taj datum
          if (r.length < 1) {
            Swal.fire({
              title: 'Info',
              text: 'Nema podatka za odabrani datum.',
              timer: 2000,
              icon: 'info'
            });
          }
          // Prolazi kroz svaki objekat u `prod` i ažurira `vrstaInventure` zbog preglednosti
          this.prodavnice.forEach((item: any) => {
            if (item.vrstaInventure === 'godisnja') {
              item.vrstaInventure = 'Godišnja';
            } else if (item.vrstaInventure === 'parcijalna') {
              item.vrstaInventure = 'Parcijalna';
            }
          });
      
        });
    }
    else {
      return;
    }

    
  }

  // Čišćenje odabrane vrijednosti u varijabli vrstaInv (Vrsta inventure)
  ocistiVrstuInv(): void {
      this.vrstaInv = null;
      this.datum = null;
  }

  //Funkcija za spremanje podatka u excel
  prebaciUExcel() {
    this.exportExcelParcijalnaService.exportAsExcelFile(this.prodavnice, 'Inventura pregled');
  }

  //Funkcija za obradu zahtjeva od strane interne kontrole
  obradi(obrada: number, brojDokumenta: string){
    //Ovjera
    if(obrada == 1) {
      Swal.fire({
            title: "Jeste li sigurni?",
            html: "Potvrdite za ovjeru dokumenta.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Ne",
            confirmButtonText: "Da"
          }).then((result) => {
            if (result.isConfirmed) { 
              this.obradaZahtjevaInterna.brojDokumenta = brojDokumenta;
              this.obradaZahtjevaInterna.odobreno = 1;
               this.obradaZahtjevaInterna.napomena = "Zahtjev odobrio korisnik: " + this.korisnickoIme;
              this.dataService.obradiZahtjevInterna(this.obradaZahtjevaInterna).subscribe(
                (_) => {
                  const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    iconColor: 'white',
                    showConfirmButton: false,
                    timer: 7000,
                    timerProgressBar: true,
                    background: "#28f777",
                    didOpen: (toast) => {
                      toast.addEventListener("mouseenter", Swal.stopTimer);
                      toast.addEventListener("mouseleave", Swal.resumeTimer);
                    },
                  });
                  Toast.fire({
                    icon: "success",
                    title: `<p style='color:white'>Uspješno spremljeno!</p>`,
                    width: 500,
                    padding: "10px",
                  });
                  //Poziv funkcije za ponovo učitavanje podataka
                  this.pregledajZahtjev();
                });
            }
            else {
              return;
            }
          });
    }
    //Odbijanje
    else if (obrada == 2) {
      Swal.fire({
            title: "Jeste li sigurni?",
            html: "Potvrdite za ovjeru dokumenta.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Ne",
            confirmButtonText: "Da"
          }).then((result) => {
            if (result.isConfirmed) {
              this.obradaZahtjevaInterna.brojDokumenta = brojDokumenta;
              this.obradaZahtjevaInterna.odobreno = 2;
              this.obradaZahtjevaInterna.napomena = "Zahtjev odbio korisnik: " + this.korisnickoIme;
              console.log("Podaci: " + JSON.stringify(this.obradaZahtjevaInterna))
              this.dataService.obradiZahtjevInterna(this.obradaZahtjevaInterna).subscribe(
                (_) => {
                  const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    iconColor: 'white',
                    showConfirmButton: false,
                    timer: 7000,
                    timerProgressBar: true,
                    background: "#28f777",
                    didOpen: (toast) => {
                      toast.addEventListener("mouseenter", Swal.stopTimer);
                      toast.addEventListener("mouseleave", Swal.resumeTimer);
                    },
                  });
                  Toast.fire({
                    icon: "success",
                    title: `<p style='color:white'>Uspješno spremljeno!</p>`,
                    width: 500,
                    padding: "10px",
                  });
                  this.pregledajZahtjev();
                });
             }
            else {
              return;
            }
          });
    }
    else {
      return;
    }
    //obradiZahtjevInterna
  }
}
