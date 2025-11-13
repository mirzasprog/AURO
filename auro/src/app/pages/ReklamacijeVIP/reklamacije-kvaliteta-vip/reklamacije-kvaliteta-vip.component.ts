import { Component, OnInit } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';
import { DataService } from '../../../@core/utils/data.service';
import { ReklamacijaKvaliteta } from '../../../@core/data/reklamacijaKvaliteta';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { ExportServiceReklamacije } from '../../../@core/services/generisiIzvjestajReklamacije.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-reklamacije-kvaliteta-vip',
  templateUrl: './reklamacije-kvaliteta-vip.component.html',
  styleUrls: ['./reklamacije-kvaliteta-vip.component.scss']
})
export class ReklamacijeKvalitetaVIPComponent implements OnInit {
  // Trenutni korisnik
  user: any;
  //Varijabla za spremanje zaprimljene kolicnie artikla
  unesenaKolicina: string = null;
  //Varijabla za spremanje reklamirane kolicnie artikla
  unesenaReklamiranaKolicina: string = null;
  //Varijabla koja sprema generisani unikatni broj dokumenta (ID) za inventuru
  jedinstveniID: string;
  //Lista podataka za unos
  unos = {
    razlog: '',
    komentar: null,
    sifra: null,
    naziv: '',
    jedinicaMjere: '',
    kolicina: 1,
    brojProdavnice: '',
    brojDokumenta: '',
    reklamiranaKolicina: 1,
    lot:'',
    brojZaduzenjaMLP: null,

  };
  datumPrijema: Date;
  //Varijabla za spremanje zadanog pocetnog datum za prikaz podataka
  datumOd: Date;
  //Varijabla za spremanje zadanog zavrsnog datum za prikaz podataka
  datumDo: Date;
  // Tabela za prikaz reklamacija (za prodavnice)
  settings = {
    actions: { add: false, edit: false },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    Paginator: true,
    columns: {
      sifraArtikla: { title: "Šifra artikla", type: "string" },
      naziv: { title: "Naziv", type: "string" },
      datumPrijema: {
        title: "Datum prijema", type: "date", valuePrepareFunction: (date: string) => {
          if (!date) return '';
          const datePipe = new DatePipe('en-GB');
          return datePipe.transform(date, 'dd.MM.yyyy');
        }
      },
      razlog: { title: "Razlog", type: "string" },
      jedinicaMjere: { title: "Jedinica mjere", type: "string" },
      kolicina: { title: "Zaprimljena količina", type: "number" },
      reklamiranaKolicina: { title: "Reklamirana količina", type: "number" },
      lot: { title: 'LOT', type: 'string' },
      brojZaduzenjaMLP: { title: 'Br. zaduženja MLP', type: 'number' },
      komentar: { title: "Komentar", type: "text" },
    },
  };
  // Tabela za prikaz reklamacija (za kontrolu kvaliteta)
  settingsPregled = {
    actions: false,
    Paginator: true,
    columns: {
      datum: {
        title: 'Datum',
        type: 'string',
          valuePrepareFunction: (date: string) => {
          if (!date) return '';
          const datePipe = new DatePipe('en-GB');
          return datePipe.transform(date, 'dd.MM.yyyy');
        }
      },
      brojProdavnice: { title: 'Broj prodavnice', type: 'string' },
      brojDokumenta: { title: 'Broj dokumenta', type: 'string' },
      sifraArtikla: { title: 'Šifra artikla', type: 'string' },
      naziv: { title: 'Naziv artikla', type: 'string' },
      jedinicaMjere: { title: 'Jedinica mjere', type: 'string' },
      kolicina: { title: 'Zaprimljena količina', type: 'number' },
      reklamiranaKolicina: { title: 'Reklamirana količina', type: 'number' },
      lot: { title: 'LOT', type: 'string' },
      brojZaduzenjaMLP: { title: 'Br. zaduženja MLP', type: 'string' },
      datumPrijema: {
        title: "Datum prijema", type: "date", valuePrepareFunction: (date: string) => {
          if (!date) return '';
          const datePipe = new DatePipe('en-GB');
          return datePipe.transform(date, 'dd.MM.yyyy');
        }
      },
      razlog: { title: 'Razlog', type: 'string' },
      komentar: { title: 'Komentar', type: 'string' },
    },
  };
  sourcePregled: LocalDataSource = new LocalDataSource();
  data: ReklamacijaKvaliteta[] = [];
  dataPregledReklamacija: ReklamacijaKvaliteta[] = [];
  source: LocalDataSource = new LocalDataSource();

  constructor(private dataService: DataService,
    private iconService: NbIconLibraries,
    private authService: NbAuthService,
    private exportService: ExportServiceReklamacije
  ) {
    this.iconService.registerFontPack('font-awesome', { packClass: 'fa' });
    // Dobijanje tokena i postavljanje prijavljenog korisnika
    this.authService.getToken().subscribe((token: NbAuthJWTToken) => {
      this.user = token.getPayload();
    });
  }

  ngOnInit(): void {
    this.source.load(this.data);
    this.generisiBrojDokumenta(this.user.name);
  }

  //FUnkcija za brisanje artikla iz liste
  onDeleteConfirm(event): void {
    if (window.confirm("Želite li obrisati stavku?")) {
      const index = this.data.indexOf(event.data);
      if (index > -1) {
        this.data.splice(index, 1);
        this.source.load(this.data);
      }
    } else {
      event.confirm.reject();
    }
  }

  //  Funkcija za dodavanje artikla u listu
  spremi(): void {
    if (!this.unos.sifra?.trim()) {
      Swal.fire("Upozorenje", "Molimo unesite šifru artikla!", "warning");
      return;
    }

    if (!this.unesenaKolicina?.trim()) {
      Swal.fire("Upozorenje", "Molimo unesite zaprimljenu količinu!", "warning");
      return;
    }

    if (!this.unesenaReklamiranaKolicina?.trim()) {
      Swal.fire("Upozorenje", "Molimo unesite reklamiranu količinu!", "warning");
      return;
    }

    if (!this.unos.komentar?.trim()) {
      Swal.fire("Upozorenje", "Molimo unesite komentar!", "warning");
      return;
    }

    const kolicina = parseFloat(this.unesenaKolicina.replace(',', '.'));
    const reklamiranaKolicina = parseFloat(this.unesenaReklamiranaKolicina.replace(',', '.'));

    if (isNaN(kolicina) || isNaN(reklamiranaKolicina)) {
      Swal.fire("Greška", "Unesite ispravne numeričke vrijednosti za količine!", "error");
      return;
    }

    if (reklamiranaKolicina >= kolicina) {
      Swal.fire("Upozorenje", "Reklamirana količina mora biti manja od zaprimljene!", "warning");
      return;
    }

    this.unos.razlog = "Narušen kvalitet voća i povrća";
    this.unos.kolicina = kolicina;
    this.unos.reklamiranaKolicina = reklamiranaKolicina;

    const postoji = this.data.some(x => x.sifraArtikla === this.unos.sifra.trim());
    if (postoji) {
      alert("Artikal sa istom šifrom je već unesen!")
      return;
    }
    this.dataService.getArtikalReklamacije(this.unos.sifra.trim()).subscribe({
      next: (r: any) => {
        if (!r || r.length === 0) {
          Swal.fire("Greška", "Odabrani artikal nije pronađen!", "error");
          return;
        }


        const artikal = r[0];
        const noviRed = {
          sifraArtikla: this.unos.sifra.trim(),
          naziv: artikal.naziv,
          razlog: this.unos.razlog,
          jedinicaMjere: artikal.jedinicaMjere,
          kolicina: this.unos.kolicina,
          reklamiranaKolicina: this.unos.reklamiranaKolicina,
          komentar: this.unos.komentar,
          lot: this.unos.lot,
          brojZaduzenjaMLP : this.unos.brojZaduzenjaMLP,
          datum: new Date(),
          brojProdavnice: this.user.name,
          brojDokumenta: this.jedinstveniID,
          datumPrijema: this.datumPrijema,
        } as ReklamacijaKvaliteta;

        this.data.push(noviRed);
        this.source.load(this.data);
        this.source.refresh();
        Swal.fire({
          toast: true,
          icon: 'success',
          title: 'Artikal uspješno dodan u listu!',
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          background: '#a5dc86',
          iconColor: 'white',
        });

        this.resetUnos();
      },
      error: (err) => {

        alert(JSON.stringify(err.error));
        console.error("Greška backend:", err);
      }
    });
  }

  // FUnkcija za spremanje liste u bazu
  spremiReklamacije(): void {
    if (this.data.length === 0) {
      alert("Nema artikala za spremanje!")
      return;
    }
    this.dataService.spremiReklamacijuKvaliteta(this.data).subscribe({
      next: () => {
        alert("Reklamacija uspješno spremljena!");
        this.data = [];
        this.source.load(this.data);
      },
      error: (err) => {
        alert("Došlo je do greške prilikom spremanja!")
        console.error(err);
      }
    });
  }

  //Funkcija koja onemogucava korisnika da unosi karaktere osim brojeva
  onlyNumbers(event: any) {
  const input = event.target as HTMLInputElement;
  input.value = input.value.replace(/[^0-9]/g, '');
  this.unos.brojZaduzenjaMLP = input.value;
}


  //Funkcija za resetovanje unosa korisnika
  resetUnos(): void {
    this.unos = { razlog: '', komentar: '', sifra: '', naziv: '', jedinicaMjere: '', kolicina: 1, brojProdavnice: '',
     brojDokumenta: '', reklamiranaKolicina: 1, lot:'', brojZaduzenjaMLP: 0,};
    this.unesenaKolicina = '';
    this.unesenaReklamiranaKolicina = '';
    this.datumPrijema = null;
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
    //Dokument počinje sa RK => Reklamacija kvaliteta
    const jedinstveniID = `RK${godina}${mjesec}${dan}${sati}${minute}${sekunde}${brojProdavnice}`;
    this.jedinstveniID = jedinstveniID;
  }

  // Funkcija za pregled reklamacija (za kontrolu kvaliteta)
  pregledajReklamacije(): void {
    if (!this?.datumOd || !this?.datumDo) {
      Swal.fire("Upozorenje", "Molimo unesite oba datuma!", "warning");
      return;
    }
    this.dataService.pregledajReklamacijeKvalitete(this.datumOd.toLocaleDateString(), this.datumDo.toLocaleDateString()).subscribe(
      (rezultat) => {

        this.dataPregledReklamacija = rezultat;
        this.sourcePregled.load(this.dataPregledReklamacija);

        if (!rezultat || rezultat.length === 0) {
          Swal.fire("Info", "Nema pronađenih reklamacija za zadani period.", "info");
        }
      error: (err) => {
  
        const backendPoruka = err?.error?.message || err?.error || "Došlo je do greške pri učitavanju reklamacija.";
        Swal.fire("Greška", backendPoruka, "error");
        console.error("Greška pregled:", err);
      }
    });
  }

  //Funkcija za export u Excel
  exportExcel(): void {
    this.sourcePregled.getAll().then((podaci) => {
      if (!podaci || podaci.length === 0) {
        Swal.fire('Info', 'Nema podataka za export.', 'info');
        return;
      }
      this.exportService.exportReklamacijeKvalitetaExcel(podaci);
    });

  }
}
