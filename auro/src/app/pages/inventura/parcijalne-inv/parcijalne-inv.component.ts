import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';
import { formatDate } from '@angular/common';
//import Swal from 'sweetalert2';
import { Zaposlenici } from '../../../@core/data/zaposlenici';
import { DataService } from '../../../@core/utils/data.service';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { PodaciParcijalneInventure } from '../../../@core/data/PodaciParcijalneInventure';
import { InventureUposlenici } from '../../../@core/data/inventureUposlenici';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';
import { PdfGeneratorService } from '../../../@core/services/generisiZapisnik.service';
import { CanComponentDeactivate } from '../../../@core/guard/guards/unsaved-changes.guard';
import Toastify from 'toastify-js'
@Component({
  selector: 'ngx-parcijalne-inv',
  templateUrl: './parcijalne-inv.component.html',
  styleUrls: ['./parcijalne-inv.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
/**
 * Komponenta za unos godišnjih (potpunih) i parcijalnih inventura.
 * Od verzije 1.5.0 aplikacije, u sklopu komponente 'ParcijalneInvComponent',
 * implementirana je logika za rad sa oba tipa inventura: godišnjim i parcijalnim.
 * Ova promjena nije zamjena prethodnih komponenata, već objedinjavanje u jednu
 * komponentu radi jednostavnosti korištenja i unificiranog načina rada sa
 * inventurama. Cilj je poboljšanje performansi aplikacije i smanjenje broja
 * komponenti koje je potrebno održavati.
 */
export class ParcijalneInvComponent implements OnInit, CanComponentDeactivate {
  // Lista zaposlenika za parcijalne inventure
  employees: Zaposlenici[] = [];
  //Lista uposlenika za potpune inventure
  employeesPotpuneInv: Zaposlenici[] = [];
  // API za grid tabele
  gridApi: any;
  // Trenutna prva stranica tabele
  first = 0;
  // Broj redova po stranici
  rows = 5;
  // Datum početka
  startDate: Date;
  // Datum završetka
  endDate: Date;
  // Datum za inventuru
  datum: Date;
  // Trenutni korisnik
  user: any;
  // Podaci parcijalne inventure
  podaci: PodaciParcijalneInventure;
  // Varijabla za spremanje vrste inventure
  vrstaInv: string;
  // Varijabla za minimalnu vrijednost datuma koju korisnik može odabrati
  minDate: Date;
  // Varijabla za maksimalnu vrijednost datuma koju korisnik može odabrati
  maxDate: Date;
  //Varijabla za spremanje imena i prezime korisnika za pretragu (Dodavanje uposlenika na inventuru iz druge prodavnice)
  imeZaposlenika: string;
  //Varijabla za spremanje IDHR-a uposlenika koji se dodaje na inventuru
  idhr: number;
  //Varijabla za spremanje Org Jed uposlenika koji se dodaje na inventuru
  orgJed: string;
  //Varijabla za spremanje broj sati uposlenika koji se dodaje na inventuru
  brSati: number;
  //Varijabla za spremanje broj minuta uposlenika koji se dodaje na inventuru
  brMinuta: number = 0;
  //Uposlenici za pretragu  
  listaUposlenika = [];
  //Lista uposlenika
  uposlenici: Array<InventureUposlenici>;
  //Lista koja vraca osnovne podatke o odabranom uposleniku
  podaciUposlenika = [];
  //Varijabla koja sprema ulogu koju je uposlenik imao na inventuri (potpuna inventura)
  uloga: string;
  //Varijabla koja definiše da li je korisnik odabrao ime i prezime uposlenika iz liste koja mu se ponudi
  imeOdabrano: boolean = false;
  //Lista sa podacima za print dokumenta
  listaZaPrint = [{ name: '', hours: '', rola: '', orgJed: '' }];
  //Varijabla za prikaz poruka prilikom validacije unosa broja minuta provedenih na inventuri (potpuna inventura)
  showWarning = false;
  //Varijabla za prikaz poruka prilikom validacije unosa broja minuta provedenih na inventuri (ukoliko je broj negativan)
  showNegativeWarning = false;
  //Varijabla za prikaz poruka prilikom validacije unosa broja minuta provedenih na inventuri (ukoliko je broj veći od 59)
  showOverLimitWarning: boolean = false;
  //Varijabla koja sprema generisani unikatni broj dokumenta (ID) za inventuru
  jedinstveniID: string;
  //Varijabla za disablanje unosa na polje broj sati 
  isBrSatiDisabled = false;
  //Varijabla za disablanje unosa na polje broj minuta 
  isBrMinutaDisabled = false;
  //Varijabla za prikazivanje paginacije u pretrazi uposlenika
  paginacijaVisible: boolean = false;
  //Varijabla za prikaz trenutnog page-a u dropdownu za pretragu uposlenika
  currentPage: number = 1;
  //Varijabla za prikaz koliko ima rezultata po page-a u dropdownu za pretragu uposlenika
  resultsPerPage: number = 10;
  //Varijabla za prikaz ukupnog broja page-ova u dropdownu za pretragu uposlenika
  totalPages: number = 1;
  //Varijabla za spremanje statusa dokumenta
  status: string;

  constructor(
    private iconService: NbIconLibraries,
    private dataService: DataService,
    private authService: NbAuthService,
    private cdr: ChangeDetectorRef,
    private servis: PdfGeneratorService
  ) {
    // Registracija font-awesome ikona
    this.iconService.registerFontPack('font-awesome', { packClass: 'fa' });
    // Dobijanje tokena i postavljanje prijavljenog korisnika
    this.authService.getToken().subscribe((token: NbAuthJWTToken) => {
      this.user = token.getPayload();
    });
  }

  ngOnInit(): void {
    const today = new Date();
    // Postavljanje maksimalnog datuma koji korisnik može odabrati kao datum inventure
    this.maxDate = today;
    // Postavljanje minimalnog datuma koji korisnik može odabrati kao datum inventure (jedan dan unazad)
    this.minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    // Inicijalizacija podataka za parcijalnu inventuru
    this.podaci = {} as PodaciParcijalneInventure;
    // Učitavanje zaposlenika i postavljanje početnih vrijednosti [Paricijalne inventure]
    this.dataService.pregledajZaposlenike(this.user.name).subscribe((r) => {
      this.employees = r;
      this.employees.forEach(employee => {
        employee.naknada = 10;
        employee.brojDana = 0;
        employee.iznosZaIsplatu = 0;
        employee.brojSati = 0;
        employee.rola = 'Uposlenik';
        employee.vrstaInventure = 'Parcijalna';
      });
    });
    // Učitavanje zaposlenika i postavljanje početnih vrijednosti [Potpune inventure]
    this.dataService.pregledajZaposlenike(this.user.name).subscribe((r) => {
      this.employeesPotpuneInv = r;
      this.employeesPotpuneInv.forEach(employee => {
        employee.naknada = 10;
        employee.brojDana = 0;
        employee.iznosZaIsplatu = 0;
        employee.brojSati = 0;
        employee.rola = 'Uposlenik';
        employee.vrstaInventure = 'Potpuna';
      });
    });
    //Servis za kupljenje podataka o Uposlenicima
    this.dataService.getImenaUposlenika().subscribe(
      (r) => {
        this.uposlenici = r;
        this.listaUposlenika = this.uposlenici.map((d: InventureUposlenici) => d.zaposlenik);
      });
    //Inicijalizacija liste za printanje
    this.listaZaPrint = [];
  }

  // Ova funkcija se poziva kada korisnik pokušava napustiti komponentu
  canDeactivate(): Observable<boolean> | boolean {
    if (this.brSati && this.datum && this.vrstaInv) {
      return confirm('Imate nespremljene promjene! Da li zaista želite napustiti stranicu bez spremanja?');
    }
    return true;
  }

  // Potvrda zaključavanja zaposlenika
  confirmLockEmployee(employee: Zaposlenici): void {
    if (confirm("Jeste li sigurni? Potvrdite da uposlenik nije bio na inventuri.")) {
      employee.brojDana = 0;
      employee.brojSati = 0;
      employee.naknada = 0;
      this.zakljucajUposlenika(employee);
    }
  }

  // Zaključavanje zaposlenika
  zakljucajUposlenika(employee: Zaposlenici): void {
    employee.locked = true;
    this.cdr.detectChanges();
  }

  // Funkcija za automatsko dodavanje broja sati na korisnike koji su bili na inventuri
  dodajSateNaUposlenika(employee: Zaposlenici, tip: number): void {
    this.isBrSatiDisabled = true;
    this.isBrMinutaDisabled = true;
    if (tip == 1) {
      employee.brojDana = this.izracunajDane(this.brSati);
      employee.brojSati = this.brSati;
      employee.brojMinuta = this.brMinuta;
      this.izracunajIznosZaIsplatu();
      this.cdr.detectChanges();
    }
    else if (tip == 2) {
      employee.brojDana = this.izracunajDane(this.brSati);
      employee.brojSati = this.brSati;
      employee.brojMinuta = this.brMinuta;
      this.izracunajIznosZaPotpuneInv();
      this.cdr.detectChanges();
    }

    /**  STARA VERZIJA 
    this.dialogService.open(DatumInvComponent, {
      closeOnBackdropClick: false,
      hasScroll: true,
      context: { korisnik: employee.ime + ' ' + employee.prezime }
    }).onClose.subscribe((r) => {
      if (r) {
        const podaci = r;
       
      }
    }); */
  }

  // Funkcija za spremanje unosa korisnika
  spremi(): void {
    // Koristimo ugrađeni confirm() dijalog umjesto Sweet Alerta
    if (confirm("Jeste li sigurni? Potvrdite za spremanje dokumenta.")) {
      if (this.validirajPodatkeUposlenika()) {
        if (this.vrstaInv == 'parcijalna') {
          const requestData = this.mapriajUposlenike(this.employees);
          // Servis za zaključivanje parcijalne inventure
          this.dataService.zakljuciParcijalnuInventuru(requestData).subscribe(
            (_) => {
              this.showSuccessMessage()
            },
            (error) => {
              this.prikaziError(error);
              return;
            }
          );
        }
        else if (this.vrstaInv == 'godisnja') {
          const requestData = this.mapriajUposlenike(this.employeesPotpuneInv);
          // Servis za zaključivanje godišnje inventure
          this.dataService.zakljuciParcijalnuInventuru(requestData).subscribe(
            (_) => {
              this.showSuccessMessage()
            },
            (error) => {
              this.prikaziError(error);
              return;
            }
          );
        }
        else {
          return;
        }
      }
    }
  }

  // Provjera da li svi zaposlenici imaju unesene potrebne podatke
  validirajPodatkeUposlenika(): boolean {
    if (this.vrstaInv == 'parcijalna') {
      for (let employee of this.employees) {
        if (!employee.locked && employee.brojDana === 0 && employee.brojSati === 0) {
          console.log("Usao u funkcijuuu : " + employee)
          this.errorValidacijeUposlenika(employee);
          return false;
        }
       // return true;
      }
      return true;
    }
    else if (this.vrstaInv == 'godisnja') {
      for (let employee of this.employeesPotpuneInv) {
        if (!employee.locked && employee.brojDana === 0 && employee.brojSati === 0) {
          console.log("Usao u funkcijuuu : " + employee)
          this.errorValidacijeUposlenika(employee);
          return false;
        }
      //  return true;
      }
      return true;
    }
    else {
      return;
    }

  }

// Prikazivanje greške ako nisu uneseni svi podaci za zaposlenika
errorValidacijeUposlenika(employee: Zaposlenici): void {
  const message = `Unesite podatke za uposlenika: ${employee.ime} ${employee.prezime}`;

  Toastify({
    text: message,
    duration: 2000,
    newWindow: true,
    close: true, 
    gravity: "top", 
    position: "right", 
    stopOnFocus: true, 
    progressBar: true,
    style: {
      background: "linear-gradient(to right,rgb(251, 119, 130),rgb(224, 50, 64))", 
      color: "white"
    },
    onClick: function(){} 
  }).showToast();
}

  // Prikazivanje poruke da su podaci uspješno spremljeni u bazu
  showSuccessMessage(): void {
    alert("Uspješno spremljeno!");
      window.location.reload();
  }

  // Prikazivanje greške ako dođe do problema pri spremanju
  prikaziError(error: any): void {
    alert(`Greška: Desila se greška: ${error.message}`);
  }

  // Mapiranje zaposlenika na podatke parcijalne inventure
  mapriajUposlenike(employees: Zaposlenici[]): PodaciParcijalneInventure {
    if (this.vrstaInv == 'parcijalna') {
      this.status = 'Na čekanju';

    } else {
      this.status = 'Automatsko odobrenje';
    }
    this.generisiBrojDokumenta(this.user.name);
    const orgJedValue = employees[0].orgJed;
    const pvValue = employees[0].pv;
    const podaci = employees.map(employee => ({
      IznosZaIsplatu: employee.iznosZaIsplatu ?? 0,
      BrojSati: employee.brojSati,
      BrojMinuta: employee.brojMinuta,
      BrojDana: employee.brojDana ?? 0,
      Ime: employee.ime,
      Prezime: employee.prezime,
      RolaNaInventuri: employee.rola,
      BrojIzDESa: parseInt(employee.brojIzDESa),
      OrgJedUposlenika: employee.orgJed,
      VrstaInventure: this.vrstaInv
    }));
    return {
      DatumInventure: formatDate(this.datum, 'MM/yyyy', 'bs-BS'),
      Pv: pvValue,
      OrgJed: orgJedValue,
      Status: this.status,
      BrojProdavnice: this.user.name,
      BrojDokumenta: this.jedinstveniID,
      Podaci: podaci
    };
  }

  // Izračunavanje vrijednosti polja 'Iznos za isplatu' za parcijalnu inventuru
  izracunajIznosZaIsplatu(): void {
    if (this.vrstaInv == 'parcijalna') {
      this.employees.forEach(employee => {
        employee.iznosZaIsplatu = employee.naknada * employee.brojDana;
      });
    } else {
      return;
    }

  }

  // Funkcija za računanje iznosa za isplatu za potpune inventure
  izracunajIznosZaPotpuneInv() {
    this.employeesPotpuneInv.forEach(e => {
      // Pretvaranje sati u minute i sabiranje sa minutama
      const ukupneMinute = (e.brojSati * 60) + e.brojMinuta;
      let iznosPoMinuti = 0;

      // Definisanje naknade po minuti na osnovu uloge
      if (e.rola == 'Administrator') {
        iznosPoMinuti = 7.5 / 60; // Naknada po minuti
      } else if (e.rola == 'Predsjednik') {
        iznosPoMinuti = 8.5 / 60;
      } else if (e.rola == 'Član komisije') {
        iznosPoMinuti = 7 / 60;
      } else {
        // Ako nije navedena specifična rola, koristi broj dana (standardna naknada)
        e.iznosZaIsplatu = e.brojDana * 25;
        return;
      }
      // Računanje ukupnog iznosa za isplatu na osnovu ukupnih minuta i naknade po minuti
      e.iznosZaIsplatu = ukupneMinute * iznosPoMinuti;
    });
  }

  // Dodavanje datuma inventure svim zaposlenicima
  dodajDatumInventure(): void {
    const formattedDate = formatDate(this.datum, 'MM/yyyy', 'bs-BS');
    const currentDate = formatDate(new Date(), 'dd-MM-yyyy', 'bs-BS');
    this.employees.forEach(employee => {
      employee.datumInventure = formattedDate;
      employee.datumUnosa = currentDate;
    });
  }

  // Prelazak na sljedeću stranicu u tabeli
  dalje(): void {
    this.first += this.rows;
  }

  // Povratak na prethodnu stranicu u tabeli
  nazad(): void {
    this.first -= this.rows;
  }

  // Resetovanje na prvu stranicu u tabeli
  reset(): void {
    this.first = 0;
  }

  // Promjena stranice u tabeli
  noviPage(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
  }

  // Provjera da li je trenutna stranica posljednja
  posljednjiPageUtabeli(): boolean {
    return this.employees ? this.first === this.employees.length - this.rows : true;
  }

  // Provjera da li je trenutna stranica prva
  prviPageUtabeli(): boolean {
    return this.employees ? this.first === 0 : true;
  }

  // Čišćenje odabrane vrijednosti u varijabli vrstaInv (Vrsta inventure)
  ocistiVrstuInv(): void {
    this.vrstaInv = null;
    this.datum = null;
    this.brMinuta = 0;
    this.brSati = null;
    this.isBrSatiDisabled = false;
    this.isBrMinutaDisabled = false;
    // Učitavanje zaposlenika i postavljanje početnih vrijednosti [Paricijalne inventure]
    this.dataService.pregledajZaposlenike(this.user.name).subscribe((r) => {
      this.employees = r;
      this.employees.forEach(employee => {
        employee.naknada = 10;
        employee.brojDana = 0;
        employee.iznosZaIsplatu = 0;
        employee.brojSati = 0;
      });
    });
    // Učitavanje zaposlenika i postavljanje početnih vrijednosti [Potpune inventure]
    this.dataService.pregledajZaposlenike(this.user.name).subscribe((r) => {
      this.employeesPotpuneInv = r;
      this.employeesPotpuneInv.forEach(employee => {
        employee.naknada = 10;
        employee.brojDana = 0;
        employee.iznosZaIsplatu = 0;
        employee.brojSati = 0;
        employee.rola = 'Uposlenik';
        employee.vrstaInventure = 'Potpuna';
      });
    });
  }

  // Funkcija za transliteraciju specifičnih slova
  transliterateString(str: string): string {
    return str
      .replace(/dž/g, 'dz')    // prvo zamijeni "dž" sa "dz"
      .replace(/Đ/g, 'Dj')     // zamjena "Đ" sa "Dj"
      .replace(/đ/g, 'dj')     // zamjena "đ" sa "dj"
      .replace(/Dž/g, 'Dz')    // zamjena "Dž" sa "Dz"
      .replace(/č/g, 'c')
      .replace(/Č/g, 'C')
      .replace(/ć/g, 'c')
      .replace(/Ć/g, 'C')
      .replace(/š/g, 's')
      .replace(/Š/g, 'S')
      .replace(/ž/g, 'z')
      .replace(/Ž/g, 'Z');
  }

  // Funkcija za normalizaciju stringa
  normalizeString(str: string): string {
    const transliterated = this.transliterateString(str);
    return transliterated.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  // Funkcija za pretragu podataka u listi uposlenika
  pretraga: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) => this.filterAndPaginate(term))
    );

  // Funkcija za filtriranje i paginaciju rezultata iz liste uposlenika
  filterAndPaginate(term: string): string[] {
    if (term.length < 3) return [];

    const regex = this.createSearchRegex(term);
    const filteredResults = this.listaUposlenika
      .filter(v => regex.test(v.toLowerCase()));

    this.totalPages = Math.ceil(filteredResults.length / this.resultsPerPage);
    this.paginacijaVisible = filteredResults.length > this.resultsPerPage;

    return filteredResults.slice((this.currentPage - 1) * this.resultsPerPage, this.currentPage * this.resultsPerPage);
  }

  // Funkcija za kreiranje Regex-a za pretragu koji prepoznaje specifična slova
  createSearchRegex(term: string): RegExp {
    const normalizedTerm = this.normalizeString(term.toLowerCase());
    const searchPattern = normalizedTerm
      .replace(/dz/g, '(dž|dz)')
      .replace(/dj/g, '(đ|dj)')
      .replace(/s/g, '[sš]')
      .replace(/d/g, '[dđ]')
      .replace(/c/g, '[cčć]')
      .replace(/z/g, '[zž]');

    return new RegExp(searchPattern, 'i');
  }

  // Formatiranje za prikaz rezultata u dropdown-u
  formatResult(result: string): string {
    return `${result}`;
  }

  //Razdvajanje imena i prezimena uposlenika u odvojene varijable
  splitName(imeZaposlenika: string): { ime: string, prezime: string } {
    const prviRazmakIndex = imeZaposlenika.indexOf(' '); 
    const ime = imeZaposlenika.slice(0, prviRazmakIndex); 
    const prezime = imeZaposlenika.slice(prviRazmakIndex + 1); 
    return { ime, prezime };
  }

  //Funkcija za provjeru i prikupljanje podatka o uposleniku koji je bio na inventuri iz druge prodavnice
  provjeri() {
    const { ime, prezime } = this.splitName(this.imeZaposlenika);
    this.podaciUposlenika = [];
    this.dataService.getPodaciUposlenikaPotpunaInv(ime, prezime).subscribe(
      (r) => {
        this.podaciUposlenika = r;
        if (this.podaciUposlenika.length < 1) {
          alert('Info: Nema podataka za odabranog uposlenika.');
          return;
        }
        r.forEach(
          (r) => {
            this.idhr = r.idhr;
            this.orgJed = r.orgJed;
            this.cdr.detectChanges();
          });
      });
  }

  //Funkacija za dodavanje novog uposlenika na inventuru (uposlenik iz druge prodavnice)
  dodajUposlenika(idhr: number, ime: string, prezime: string, brojSati: number, naknada: number, rola: string) {
    // Kreiraj novog uposlenika
    const noviUposlenik: Zaposlenici = {
      orgJed: this.orgJed,
      brojIzDESa: idhr.toString(),
      ime: ime,
      prezime: prezime,
      pv: '-',
      brojSati: brojSati,
      brojMinuta: this.brMinuta,
      brojDana: this.izracunajDane(brojSati),
      naknada: naknada,
      rola: rola,
      vrstaInventure: 'Potpuna'
    };
    // Dodaj uposlenika u listu
    this.employeesPotpuneInv = [...this.employeesPotpuneInv, noviUposlenik]; 
  }

  //Funkcija filtrira ime i prezime uposlenika i poziva funkciju za dodavanje uposlenika u listu
  dodaj() {
    const { ime, prezime } = this.splitName(this.imeZaposlenika);
    const postojiUposlenik = this.employeesPotpuneInv.some((e) => {
      const eBrojIzDESa = e.brojIzDESa.toString().trim();
      const idhrStr = this.idhr.toString().trim();
      return eBrojIzDESa === idhrStr;
    });

    //Provjera da li je uposlenik već dodan u listu
    if (postojiUposlenik) {
      this.idhr = null;
      this.imeZaposlenika = null;
      this.uloga = null;
      this.orgJed = null;
      // Zamijenjeno Swal.fire s običnim alert() za upozorenje
      alert('Upozorenje: Uposlenik sa ovim podacima već postoji u listi.');
      return;
    } else {
      this.dodajUposlenika(this.idhr, ime, prezime, this.brSati, 10, this.uloga);
      this.izracunajIznosZaPotpuneInv();

      // this.brSati = null;
      // this.brMinuta = null;
      this.imeZaposlenika = null;
      this.idhr = null;
      this.orgJed = null;
      this.uloga = null;
    }
  }

  //Funkacija za racunanje broja dana koje je uposlenik proveo na inventuri (dani se računaju na osnovu sati koje korisnik unese)
  izracunajDane(sati: number): number {
    if (sati <= 24) {
      return 1;
    }
    // Računanje broja dana na osnovu 24 sata po danu
    const citavDan = Math.floor(sati / 24);
    const dodatniDani = sati % 24 > 0 ? 1 : 0;
    return citavDan + dodatniDani;
  }

  //Funkcija koja automatski poziva funkciju za dodavanje podataka o zapolseniku [provjeri()] nakon sto korisnik odabere ime i prezime iz liste
  onSelect(event: any) {
    this.imeOdabrano = true;
    this.imeZaposlenika = event.item;
    this.provjeri();
  }

  //Funkcija za provjeru da li je korisnik odabrao ime iz liste
  onBlur() {
    // Provjera da li unos korisnika postoji u listi zaposlenika
    if (!this.listaUposlenika.includes(this.imeZaposlenika)) {
      alert("Nepravilan unos! Pokušajte ponovo.");

      this.imeOdabrano = false;
      this.imeZaposlenika = null;
      this.idhr = null;
      this.orgJed = null;
      // this.brSati = null;
      this.uloga = null;
      return;
    } else {
      this.imeOdabrano = true;
      this.provjeri();
    }
  }

  //Funkcij za printanje dokumenta nakon završetka inventure
  printaj() {
    this.employeesPotpuneInv.forEach(e => {
      this.listaZaPrint.push({
        name: e.ime + ' ' + e.prezime,
        hours: e.brojSati.toString(),
        rola: e.rola,
        orgJed: e.orgJed
      });
    })
    this.servis.generateInventoryReport(this.listaZaPrint);
    this.listaZaPrint = [];
  }

  //Funkcija za validaciju unosa korisnika (Broj minuta provedenih na inventuri)
  onBrMinutaChange() {
    if (this.brMinuta < 0) {
      this.showNegativeWarning = true;
      this.showWarning = false;
      this.showOverLimitWarning = false;
      this.cdr.detectChanges();
      setTimeout(() => {
        this.showNegativeWarning = false;
        this.brMinuta = null;
        this.cdr.detectChanges();
      }, 4000);
    } else if (this.brMinuta > 59) {
      this.showOverLimitWarning = true;
      this.showWarning = false;
      this.showNegativeWarning = false;
      this.cdr.detectChanges();
      setTimeout(() => {
        this.showOverLimitWarning = false;
        this.brMinuta = null;
        this.cdr.detectChanges();
      }, 4000);
    } else if (!this.isValidBrojMinuta()) {
      this.showWarning = true;
      this.showNegativeWarning = false;
      this.showOverLimitWarning = false;
      this.cdr.detectChanges();
      setTimeout(() => {
        this.showWarning = false;
        this.brMinuta = null;
        this.cdr.detectChanges();
      }, 4000);
    } else {
      this.showWarning = false;
      this.showNegativeWarning = false;
      this.showOverLimitWarning = false;
      this.cdr.detectChanges();
    }
  }

  // Funkcija za provjeru validnosti broja sati provedenih na inventuri
  isValidBrojSati(): boolean {
    return Number.isInteger(this.brSati) && this.brSati >= 0;
  }

  // Funkcija za provjeru validnosti broja minuta provedenih na inventuri
  isValidBrojMinuta(): boolean {
    return this.brMinuta > 0 && this.brMinuta <= 59 && Number.isInteger(this.brMinuta);
  }

  //Funkcija za unos prodavnice koja nije imala invneture
  nemaInventure(tipInventure: number) {
    //Parcijalna inventura
    if (tipInventure == 1) {
      // Zamijenjen Swal.fire s običnim confirm()
      if (confirm("Jeste li sigurni? Potvrdite za spremanje dokumenta.")) {
        this.employees.forEach(e => {
          e.brojSati = 0;
          e.brojDana = 0;
          e.brojMinuta = 0;
          e.iznosZaIsplatu = 0;
        });
        const requestData = this.mapriajUposlenike(this.employees);
        // Servis za zaključivanje parcijalne inventure
        this.dataService.zakljuciParcijalnuInventuru(requestData).subscribe(
          (_) => {
            this.showSuccessMessage()
          },
          (error) => {
            this.prikaziError(error);
            return;
          }
        );
        return;
      }
    }
    //Potpuna inventura
    else if (tipInventure == 2) {
      // Zamijenjen Swal.fire s običnim confirm()
      if (confirm("Jeste li sigurni? Potvrdite za spremanje dokumenta.")) {
        this.employeesPotpuneInv.forEach(e => {
          e.brojSati = 0;
          e.brojDana = 0;
          e.brojMinuta = 0;
          e.iznosZaIsplatu = 0;
        });
        const requestData = this.mapriajUposlenike(this.employees); // PAŽNJA: Ovdje je u originalnom kodu 'this.employees', a ne 'this.employeesPotpuneInv'. Pretpostavljam da je to greška i da bi trebalo biti 'this.employeesPotpuneInv' za potpunu inventuru. Ipak, držim se originala.
        // Servis za zaključivanje parcijalne inventure
        this.dataService.zakljuciParcijalnuInventuru(requestData).subscribe(
          (_) => {
            this.showSuccessMessage()
          },
          (error) => {
            this.prikaziError(error);
            return;
          }
        );
        return;
      }
    } else {
      return;
    }
  }

  //Funkcija za generisanje unikatnog broja dokumenta za inventuru
  generisiBrojDokumenta(brojProdavnice: string): void {
    const danasnjiDatum = new Date();
    const godina = danasnjiDatum.getFullYear();
    const mjesec = ('0' + (danasnjiDatum.getMonth() + 1)).slice(-2);
    const dan = ('0' + danasnjiDatum.getDate()).slice(-2);
    const sati = ('0' + danasnjiDatum.getHours()).slice(-2);
    const minute = ('0' + danasnjiDatum.getMinutes()).slice(-2);
    const sekunde = ('0' + danasnjiDatum.getSeconds()).slice(-2);

    const jedinstveniID = `D${godina}${mjesec}${dan}${sati}${minute}${sekunde}${brojProdavnice}`;
    this.jedinstveniID = jedinstveniID;
  }

  // Funkcija za provjeru validnosti
  isValid(): boolean {
    // Provjerava da li je brMinuta cijeli broj i veći ili jednak nuli
    return Number.isInteger(this.brMinuta) && this.brMinuta >= 0;
  }

  //Funkcija za disable i validaciju unosa korisnika za polje broj minuta
  onSatiBlur() {
    if (this.brSati >= 80) {
      // Zamijenjeno Swal.fire s običnim alert()
      alert('Greška!: Uneseni broj sati je prevelik. Pokušajte ponovo.');
      // this.brSati = null;
      this.isBrSatiDisabled = false;
      return;
    } else if (this.brSati == 0) {
      // Zamijenjeno Swal.fire s običnim alert()
      alert('Greška!: Broj sati ne može biti nula. Pokušajte ponovo.');
      // this.brSati = null;
      this.isBrSatiDisabled = false;
      return;
    } else if (this.brSati !== null && this.brSati !== undefined) {
      this.isBrSatiDisabled = true;
    }
  }

  //Funkcija za disable i validaciju unosa korisnika za polje broj minuta
  onMinutaBlur() {
    if (this.brMinuta >= 60) {
      // Zamijenjeno Swal.fire s običnim alert()
      alert('Greška!: Uneseni broj minuta je prevelik. Pokušajte ponovo.');
      this.brMinuta = null;
      this.isBrMinutaDisabled = false;
      return;
    }
    if (this.brMinuta !== null && this.brMinuta !== undefined) {
      this.isBrMinutaDisabled = true;
    }
  }

}
