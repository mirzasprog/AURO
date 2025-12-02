import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import * as FileSaver from 'file-saver';
import { AkcijaStavka } from '../../../@core/data/akcija-stavka';
import { DataService } from '../../../@core/utils/data.service';

@Component({
  selector: 'ngx-akcije-stavke',
  templateUrl: './akcije-stavke.component.html',
  styleUrls: ['./akcije-stavke.component.scss']
})
export class AkcijeStavkeComponent implements OnInit {
  //Input koji se dobija sa parent komponente
  @Input() odabraniRed: any;
  // API za grid tabele
  gridApi: any;
  // Trenutna prva stranica tabele
  first = 0;
  // Broj redova po stranici
  rows = 5;
  //Array koji ucitava podatke iz servisa
  data: AkcijaStavka[] = [];
  ucitavanje = false;
  greska?: string;

  constructor(protected dialogRef: NbDialogRef<AkcijeStavkeComponent>, private dataService: DataService) { }

  ngOnInit(): void {
    this.ucitajStavke();
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

  preuzmiExcel(): void {
    const akcijaId = this.odabraniRed?.id ?? this.odabraniRed?.Id;
    if (!akcijaId) {
      this.greska = 'Nije pronađen ID akcije za eksport.';
      return;
    }

    this.dataService.preuzmiExcelStavkeAkcije(akcijaId).subscribe({
      next: (blob) => {
        FileSaver.saveAs(blob, `akcija_${akcijaId}_stavke.csv`);
      },
      error: (err) => {
        this.greska = err?.error?.poruka ?? 'Greška pri preuzimanju Excel izvještaja.';
      }
    });
  }

  private ucitajStavke(): void {
    const akcijaId = this.odabraniRed?.id ?? this.odabraniRed?.Id;
    if (!akcijaId) {
      this.greska = 'Nije odabrana akcija za prikaz.';
      return;
    }

    this.ucitavanje = true;
    this.greska = undefined;
    this.dataService.preuzmiStavkeAkcije(akcijaId).subscribe({
      next: (stavke) => {
        this.data = stavke.map(s => ({
          id: s.id ?? s.Id ?? 0,
          akcijaId,
          sifra: s.sifra ?? s.Sifra ?? '',
          naziv: s.naziv ?? s.Naziv ?? '',
          kolicina: s.kolicina ?? s.Kolicina ?? 0,
        } as AkcijaStavka));
      },
      error: (err) => {
        this.greska = err?.error?.poruka ?? 'Greška pri preuzimanju stavki akcije.';
      }
    }).add(() => this.ucitavanje = false);
  }



}
