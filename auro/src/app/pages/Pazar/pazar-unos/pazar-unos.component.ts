import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
// import { AuthenticationService } from '../_services/authentication.service';
// import { DataService } from '../_services/data.service';

type PredmetUplate = { naziv: string };

@Component({
  selector: 'ngx-pazar-unos',
  templateUrl: './pazar-unos.component.html',
  styleUrls: ['./pazar-unos.component.scss'],
})
export class PazarUnosComponent implements OnInit {

  predmetUplate: string;
  danasnjiDatum: Date;
  iznos: number;
  minimalniDatum: Date;
  listaPredmetaUplate: Array<PredmetUplate>;
  listaPoslovodja: Array<{ id: number; imePrezime: string }>;
  odabraniDatumi: { from: Date; to: Date };
  odabraneElektronskeUplate: boolean;

  unos = {
    ovlastenaOsobaID: null,
    predmetUplate: '',
    datum: '',
    datumOd: '',
    datumDo: '',
    smjena: 1,
    blagajnik: '',
    brojBlagajne: '',
    barkod: '',
    iznos: 0,
    brojKomada200: 0, iznos200: 0,
    brojKomada100: 0, iznos100: 0,
    brojKomada50: 0,  iznos50: 0,
    brojKomada20: 0,  iznos20: 0,
    brojKomada10: 0,  iznos10: 0,
    brojKomada5: 0,   iznos5: 0,
    brojKomada2: 0,   iznos2: 0,
    brojKomada1: 0,   iznos1: 0,
    brojKomada050: 0, iznos050: 0,
    brojKomada020: 0, iznos020: 0,
    brojKomada010: 0, iznos010: 0,
    brojKomada005: 0, iznos005: 0,
  };

  constructor(
    private router: Router,
    // private authenticationService: AuthenticationService,
    // private dataService: DataService,
  ) {}

  ngOnInit(): void {
    this.predmetUplate = '';
    this.iznos = 0;
    this.danasnjiDatum = new Date();
    this.minimalniDatum = new Date();
    this.minimalniDatum.setDate(this.danasnjiDatum.getDate() - 9);
    this.odabraneElektronskeUplate = false;

    // this.brojProdavnice = this.authenticationService.ImeLogiranogKorisnika;

    // DUMMY - zamijeniti sa: this.dataService.getPredmetiUplate().subscribe(...)
    this.listaPredmetaUplate = [
      { naziv: 'Dnevni promet' },
      { naziv: 'Promet elektronskim dopunama' },
      { naziv: 'Avansna uplata' },
      { naziv: 'Ostalo' },
    ];

    // DUMMY - zamijeniti sa: this.dataService.getPoslovodje().subscribe(...)
    this.listaPoslovodja = [
      { id: 1, imePrezime: 'Adnan Hodžić' },
      { id: 2, imePrezime: 'Lejla Bašić' },
      { id: 3, imePrezime: 'Mirza Kovačević' },
    ];
  }

  isNumeric(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  provjeriSpecialneKaraktere(str: any): boolean {
    if (str === null || str === undefined) return false;
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str.toString());
  }

  izracunajIznos(vrijednostApoena: number): void {
    switch (vrijednostApoena) {
      case 200:  this.unos.iznos200 = vrijednostApoena * this.unos.brojKomada200; break;
      case 100:  this.unos.iznos100 = vrijednostApoena * this.unos.brojKomada100; break;
      case 50:   this.unos.iznos50  = vrijednostApoena * this.unos.brojKomada50;  break;
      case 20:   this.unos.iznos20  = vrijednostApoena * this.unos.brojKomada20;  break;
      case 10:   this.unos.iznos10  = vrijednostApoena * this.unos.brojKomada10;  break;
      case 5:    this.unos.iznos5   = vrijednostApoena * this.unos.brojKomada5;   break;
      case 2:    this.unos.iznos2   = vrijednostApoena * this.unos.brojKomada2;   break;
      case 1:    this.unos.iznos1   = vrijednostApoena * this.unos.brojKomada1;   break;
      case 0.5:  this.unos.iznos050 = vrijednostApoena * this.unos.brojKomada050; break;
      case 0.2:  this.unos.iznos020 = vrijednostApoena * this.unos.brojKomada020; break;
      case 0.1:  this.unos.iznos010 = vrijednostApoena * this.unos.brojKomada010; break;
      case 0.05: this.unos.iznos005 = vrijednostApoena * this.unos.brojKomada005; break;
      default:   this.iznos = 0.0;
    }
    this.iznos =
      this.unos.iznos200 + this.unos.iznos100 + this.unos.iznos50  +
      this.unos.iznos20  + this.unos.iznos10  + this.unos.iznos5   +
      this.unos.iznos2   + this.unos.iznos1   + this.unos.iznos050 +
      this.unos.iznos020 + this.unos.iznos010 + this.unos.iznos005;
  }

  spremi() {
    const polja = [
      this.unos.brojKomada005, this.unos.brojKomada010,
      this.unos.brojKomada020, this.unos.brojKomada050,
      this.unos.brojKomada1,   this.unos.brojKomada10,
      this.unos.brojKomada100, this.unos.brojKomada2,
      this.unos.brojKomada20,  this.unos.brojKomada200,
      this.unos.brojKomada5,   this.unos.brojKomada50,
    ];

    for (const p of polja) {
      if (!this.isNumeric(p)) {
        Swal.fire({ icon: 'info', title: 'Info', text: "Pravilno unesite polje 'broj komada'", timer: 3500, showConfirmButton: false });
        return;
      }
      if (this.provjeriSpecialneKaraktere(p)) {
        Swal.fire({ icon: 'info', title: 'Info', text: "Polje 'broj komada' mora biti cijeli broj!", timer: 3500, showConfirmButton: false });
        return;
      }
    }

    if (this.odabraneElektronskeUplate) {
      if (!this.odabraniDatumi || !this.odabraniDatumi.from) {
        Swal.fire('Upozorenje', 'Odaberite raspon datuma!', 'warning'); return;
      }
      this.unos.datumOd = formatDate(this.odabraniDatumi.from, 'dd-MM-yyyy', 'bs-BS');
      if (!this.odabraniDatumi.to) {
        Swal.fire('Upozorenje', 'Predmet uplate treba biti "Dnevni promet elektronskim uplatama"!', 'warning'); return;
      }
      this.unos.datumDo = formatDate(this.odabraniDatumi.to, 'dd-MM-yyyy', 'bs-BS');
    }

    if (this.iznos <= 0) {
      Swal.fire('Upozorenje', 'Niste upisali vrijednosti apoena!', 'warning'); return;
    }

    // this.dataService.spremiPazar(this.unos).subscribe(
    //   (_) => this.router.navigate(['pocetna']),
    //   (error) => Swal.fire('Greška', 'Greška: ' + error, 'error')
    // );

    // DUMMY - ukloniti kada se spoji backend:
    Swal.fire({ icon: 'success', title: 'Uspješno!', text: 'Pazar je uspješno sačuvan.', timer: 2000, showConfirmButton: false })
      .then(() => this.router.navigate(['pages/pazar/pregled']));
  }

  postaviPredmetUplate(odabrano: string) {
    this.predmetUplate = odabrano;
    this.odabraneElektronskeUplate = odabrano === 'Promet elektronskim dopunama';
  }

  postaviPoslovodju(odabraniID: string): void {
    this.unos.ovlastenaOsobaID = Number(odabraniID);
  }
}