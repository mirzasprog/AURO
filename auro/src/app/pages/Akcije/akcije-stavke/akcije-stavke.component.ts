import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-akcije-stavke',
  templateUrl: './akcije-stavke.component.html',
  styleUrls: ['./akcije-stavke.component.scss']
})
export class AkcijeStavkeComponent implements OnInit {
  //Input koji se dobija sa parent komponente 
  @Input() odabraniRed;
  // API za grid tabele
  gridApi: any;
  // Trenutna prva stranica tabele
  first = 0;
  // Broj redova po stranici
  rows = 5;
  //Array koji ucitava podatke iz servisa
  data: any = [];

  constructor(protected dialogRef: NbDialogRef<AkcijeStavkeComponent>) { }

  ngOnInit(): void {
    //TODO: Temp Data
    this.data = [
      {
        sifra: '88744',
        naziv: 'Test',
        kolicina: 0
      }, {
        sifra: '558698',
        naziv: 'Test',
        kolicina: 0
      }, {
        sifra: '442245',
        naziv: 'Test',
        kolicina: 0
      }, {
        sifra: '3215887',
        naziv: 'Test',
        kolicina: 0
      }, 
      {
        sifra: '6630246',
        naziv: 'Test',
        kolicina: 0
      },      {
        sifra: '6630246',
        naziv: 'Test',
        kolicina: 0
      },      {
        sifra: '6630246',
        naziv: 'Test',
        kolicina: 0
      },      {
        sifra: '6630246',
        naziv: 'Test',
        kolicina: 0
      },      {
        sifra: '6630246',
        naziv: 'Test',
        kolicina: 0
      },
    ];
  }

  // Promjena stranice u tabeli
  noviPage(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
  }

  //Funkcija za validaciju unosa korisnika (polje 'Količina')
  onKolicinaChange(data: any) {
    const maxKolicina = 9999; // Maksimalna vrijednost
    const minKolicina = 0; // Minimalna vrijednost
    const parsedValue = Number(data.kolicina);

    // Provjera da li je unos prazan ili nije broj
    if (data.kolicina === '' || data.kolicina === null || isNaN(parsedValue)) {
      data.kolicina = 0; // Postavi na 0 ako je prazan ili nevalidan unos
    } else if (parsedValue < minKolicina || parsedValue > maxKolicina) {
      data.kolicina = 0; // Postavi na 0 ako je broj van opsega
    } else if (!Number.isFinite(parsedValue)) {
      data.kolicina = 0; // Postavi na 0 ako je vrijednost beskonačna
    }
  }

  //Validacija da li je korisnik pravilno unio količinu
  validirajBroj(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Delete'];
    if (allowedKeys.indexOf(event.key) !== -1) {
      return;
    }
    if (!/^[0-9]*$/.test(event.key)) {
      event.preventDefault();
    }
  }

  //Funkcija za zatvaranje modal-a
  zatvoriModal() {
    this.dialogRef.close();
  }

  //Funkcija za spremanje unosa korsnika
  spremi() {
    console.log("Podaci: " + JSON.stringify(this.data));
  }



}
