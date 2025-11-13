import { formatCurrency } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NbAuthJWTToken, NbAuthService } from "@nebular/auth";
import { LocalDataSource } from "ng2-smart-table";
import Swal from "sweetalert2";
import { ListaOdbijenihArtikala } from "../../../../@core/data/lista-odbijenih-artikala";
import { DataService } from "../../../../@core/utils/data.service";
import { ButtonOdobriComponent } from "./button-odobri/button-odobri.component";
import { KomentarComponent } from "./komentar/komentar.component";
import {isWhitespaceCharacter} from 'is-whitespace-character'
import { NbDialogService } from "@nebular/theme";
import { OdbijOtpisComponent } from "../odbij-otpis/odbij-otpis.component";
@Component({
  selector: "ngx-artikli-detalji-pregled",
  templateUrl: "./artikli-detalji-pregled.component.html",
  styleUrls: ["./artikli-detalji-pregled.component.scss"],
})
export class ArtikliDetaljiPregledComponent implements OnInit {

  data = [];
  dataOdbijeniArtikli = [];
  dataTrenutnoOdbijeniArtikli = [];
  dataTrenutnoOdobreniArtikli = [];
  komentari: Array<string> = [];
  otpisButton = false;
  unos = { brojOtpisa: "", status: 0, komentar: "" };

  // kada se klikne na odbijanje pojedinog artikla dugmad za odobrenje i odbijanje se iskljuce
  iskljucenoDugmeOtpisa: boolean;

  readonly brojOtpisa;

  source: LocalDataSource = new LocalDataSource();
  //Prethodno odbijeni artikli sa otpisa -- view za rolu regionalni
  sourceOdbijeniArtikli: LocalDataSource = new LocalDataSource();

  //Artikli koje podrucni/regionalni trenutno odbije sa otpisa
  sourceTrenutnoOdbijeniArtikli: LocalDataSource = new LocalDataSource();

  // Artikli koje je podrucni/regionalni trenutno odobrio
  sourceTrenutnoOdobreniArtikli: LocalDataSource = new LocalDataSource();

  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    //Kolone za popunjavanje
    columns: {
      sifra: {
        title: "Šifra artikla",
        type: "string",
        editable: false,
      },
      nazivArtikla: {
        title: "Naziv artikla",
        type: "string",
        editable: false,
      },
      dobavljac: {
        title: "Dobavljač",
        type: "string",
        editable: false,
      },
      datumPopunjavanja: {
        title: "Datum popunjavanja",
        type: "Date",
        editable: false,
      },
      kolicina: {
        title: "Količina",
        type: "number",
        editable: true,
      },
      razlogOtpisa: {
        title: "Razlog otpisa",
        type: "string",
        editable: false,
      },
      nabavnaVrijednost: {
        title: "NV",
        type: "number",
        editable: false,
        valuePrepareFunction: (value, row, cell) => {
          return formatCurrency(value, 'bs-BS', 'KM')
        }
      },
      ukupnaVrijednost: {
        title: "Ukupna Vrijednost",
        type: "number",
        editable: false,
        valuePrepareFunction: (value, row, cell) => {
          return formatCurrency(value, 'bs-BS', 'KM')
        }
      },
      odobri: {
        title: "Odobri",
        type: "custom",
        valuePrepareFunction: (value, row, cell) => {
          return row.sifra;
        },
        renderComponent: ButtonOdobriComponent,
        onComponentInitFunction: (instance) => {
          //EDIT Izbacivanje artikla iz liste i ubacivanje u listu odobrenih artikala
          instance.uklonjeniRed.subscribe(
            (podaci: { red: object }) => {
               this.dataTrenutnoOdobreniArtikli.push(podaci.red);
                this.sourceTrenutnoOdobreniArtikli.load(this.dataTrenutnoOdobreniArtikli);
                this.source.remove(podaci.red);
                this.otpisButton = true;
                if(this.source.count() ==0){
                  this.iskljucenoDugmeOtpisa = true;
                }
               // this.iskljucenoDugmeOtpisa = true;
            }
          );
        },
      },

      odbij: {
        title: "Odbij",
        type: "custom",
        valuePrepareFunction: (value, row, cell) => {
          return row.sifra;
        },
        renderComponent: KomentarComponent,
        onComponentInitFunction: (instance) => {
          instance.uklonjeniRed.subscribe(
            (podaci: { red: object; komentar: string }) => {
              if(podaci.komentar == undefined || podaci.komentar == ""){
                Swal.fire(
                  'Greška...',
                  'Unesite komentar odbijanja artikla!',
                  'error'
                );
                return;
              }
             if(isWhitespaceCharacter(podaci.komentar)){
                Swal.fire(
                  'Greška...',
                  'Unesite komentar odbijanja artikla!',
                  'error'
                );
                return;
              }
             if (podaci.komentar !== undefined || podaci.komentar !== "") {
                this.dataTrenutnoOdbijeniArtikli.push(podaci.red);
                this.sourceTrenutnoOdbijeniArtikli.load(this.dataTrenutnoOdbijeniArtikli);
                this.source.remove(podaci.red);
                this.komentari.push(podaci.komentar);
                this.otpisButton = true;
                if(this.source.count() ==0){
                  this.iskljucenoDugmeOtpisa = true;
                }
              }
            }
          );
        },
      },
    },
  };
  //Prethodno odbijeni artikli sa otpisa -- view za rolu regionalni
  odbijeniArtikli = {
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    //Polja u listi redovnih otpisa :
    columns: {
      sifra: {
        title: "Šifra artikla",
        type: "string",
        editable: false,
      },
      naziv: {
        title: "Naziv artikla",
        type: "string",
        editable: false,
      },
      razlogOtpisa: {
        title: "Razlog otpisa",
        type: "string",
        editable: false,
      },
      kolicina: {
        title: "Količina",
        type: "number",
      },
      nabavnaVrijednost: {
        title: "NV",
        type: "number",
        editable: false,
        valuePrepareFunction: (value, row, cell) => {
          return formatCurrency(value, 'bs-BS', 'KM')
        }
      },
      ukupnaVrijednost: {
        title: "Ukupna vrijednost",
        type: "number",
        editable: false,
        valuePrepareFunction: (value, row, cell) => {
          return formatCurrency(value, 'bs-BS', 'KM')
        }
      },
      odbio: {
        title: "Odbio",
        type: "string",
        editable: false,
      },
      komentar: {
        title: "Komentar odbijanja",
        type: "string",
        editable: false,
      },
    },
  };

  odobreniArtikli = {
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    //Kolone za popunjavanje
    columns: {
      sifra: {
        title: "Šifra artikla",
        type: "string",
        editable: false,
      },
      nazivArtikla: {
        title: "Naziv artikla",
        type: "string",
        editable: false,
      },
      dobavljac: {
        title: "Dobavljač",
        type: "string",
        editable: false,
      },
      datumPopunjavanja: {
        title: "Datum popunjavanja",
        type: "Date",
        editable: false,
      },
      kolicina: {
        title: "Količina",
        type: "number",
        editable: true,
      },
      razlogOtpisa: {
        title: "Razlog otpisa",
        type: "string",
        editable: false,
      },
      nabavnaVrijednost: {
        title: "NV",
        type: "number",
        editable: false,
        valuePrepareFunction: (value, row, cell) => {
          return formatCurrency(value, 'bs-BS', 'KM')
        }
      },
      ukupnaVrijednost: {
        title: "Ukupna Vrijednost",
        type: "number",
        editable: false,
        valuePrepareFunction: (value, row, cell) => {
          return formatCurrency(value, 'bs-BS', 'KM')
        }
      }

    },
  };
//Artikli koje podrucni/regionalni trenutno odbije sa otpisa
  trenutnoOdbijeniArtikli = {
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    //Kolone za popunjavanje
    columns: {
      sifra: {
        title: "Šifra artikla",
        type: "string",
        editable: false,
      },
      nazivArtikla: {
        title: "Naziv artikla",
        type: "string",
        editable: false,
      },
      dobavljac: {
        title: "Dobavljač",
        type: "string",
        editable: false,
      },
      datumPopunjavanja: {
        title: "Datum prijave",
        type: "Date",
        editable: false,
      },
      kolicina: {
        title: "Količina",
        type: "number",
        editable: true,
      },
      razlogOtpisa: {
        title: "Razlog otpisa",
        type: "string",
        editable: false,
      },
      nabavnaVrijednost: {
        title: "NV",
        type: "number",
        editable: false,
        valuePrepareFunction: (value, row, cell) => {
          return formatCurrency(value, 'bs-BS', 'KM')
        }
      },
      ukupnaVrijednost: {
        title: "Ukupna Vrijednost",
        type: "number",
        editable: false,
        valuePrepareFunction: (value, row, cell) => {
          return formatCurrency(value, 'bs-BS', 'KM')
        }
      },
    },
  };
  //EDITOVATI tabelu za odobrene artikle trenuto korisi isti servis i ista polja kao i tabela za odbijene artikle

  rola: string;

  constructor(
    private dataService: DataService,
    public activatedRoute: ActivatedRoute,
    private authService: NbAuthService,
    private router: Router,
    private dialogService: NbDialogService
  ) {
    this.brojOtpisa = activatedRoute.snapshot.paramMap.get("brojOtpisa");
    this.unos.brojOtpisa = this.brojOtpisa;
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.iskljucenoDugmeOtpisa = false;
    this.sourceOdbijeniArtikli.load(this.dataOdbijeniArtikli);
    this.sourceTrenutnoOdbijeniArtikli.load(this.dataTrenutnoOdbijeniArtikli);
    this.authService.getToken().subscribe((token: NbAuthJWTToken) => {
      this.rola = token.getPayload()["role"];
    });

    this.dataService
      .prikaziDetaljeZahtjevaRedovnogOtpisa(this.brojOtpisa)
      .subscribe(
        (r) => {
          //this.data = r;
          this.data = r.odobreniArtikli;
          this.dataOdbijeniArtikli = r.odbijeniArtikli;

          this.source.load(this.data);
          this.sourceOdbijeniArtikli.load(this.dataOdbijeniArtikli);
          this.sourceTrenutnoOdbijeniArtikli.load(
          this.dataTrenutnoOdbijeniArtikli
          );
        },
        (err) => {
          const greska = err.error?.poruka ?? err.statusText;
          Swal.fire("Greška", "Greška: " + greska, "error");
        }
      );
  }

  izdvojiArtikalID(): Array<number> {
    let artikli = [];
    for (const artikal of this.dataTrenutnoOdbijeniArtikli) {
      artikli.push(artikal.artikalId);
    }
    return artikli;
  }

  //Funkcija za spremanje liste arikala koji su odobreni za otpis
  odobriOtpis() {
    Swal.fire({
      title: "Jeste li sigurni?",
      text: "Potvrdite artikle za otpis!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Da",
      cancelButtonText: "Ne",
    }).then((result) => {
      if (result.isConfirmed) {
        this.unos.status = 2;

        this.dataService.odobriOdbijOtpis(this.unos).subscribe(
          (_) => {
            Swal.fire({
              icon: "success",
              title: "Uspješno spremljeno",
              showConfirmButton: false,
              timer: 1500,
              showClass: {
                popup: "animate__animated animate__fadeInDown",
              },
              hideClass: {
                popup: "animate__animated animate__hinge",
              },
            });
            this.data = [];
            this.source.load(this.data);
            this.router.navigate(["pages/zahtjevi/redovni-otpis"]);
          },
          (err) => {
            const greska = err.error?.poruka ?? err.statusText;
            Swal.fire("Greška", "Greška: " + greska, "error");
          }
        );
      }
    });
  }
  //Funkcija za odbijanje svih artikala sa zahtjeva na otpisu
  odbijOtpis() {

    this.dialogService.open(OdbijOtpisComponent,{ context: {  brojOtpisa:  this.brojOtpisa } });
  /**  Swal.fire({
      title: "Jeste li sigurni?",
      text: "Potvrdite odbijanje artikala sa otpisa!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Da",
      cancelButtonText: "Ne",
    }).then((result) => {
      if (result.isConfirmed) {
        this.unos.status = 3;
        this.dataService.odobriOdbijOtpis(this.unos).subscribe(
          (_) => {
            Swal.fire({
              icon: "success",
              title: "Uspješno spremljeno",
              showConfirmButton: false,
              timer: 1500,
              showClass: {
                popup: "animate__animated animate__fadeInDown",
              },
              hideClass: {
                popup: "animate__animated animate__hinge",
              },
            });
            this.data = [];
            this.source.load(this.data);
            this.router.navigate(["pages/zahtjevi/redovni-otpis"]);
          },
          (err) => {
            const greska = err.error?.poruka ?? err.statusText;
            Swal.fire("Greška", "Greška: " + greska, "error");
          }
        );
      }
    });
     */
    this.iskljucenoDugmeOtpisa = false;
  }

  spremiOdbijeneArtikle() {
    let idOdbijenihArtikala = this.izdvojiArtikalID();
    let listaArtikala = {} as ListaOdbijenihArtikala;
    listaArtikala.artikli = idOdbijenihArtikala;
    listaArtikala.brojOtpisa = this.brojOtpisa;
    listaArtikala.komentari = this.komentari;

    this.dataService.odbijArtikle(listaArtikala).subscribe(
      (_) => {
       // this.dataTrenutnoOdbijeniArtikli = [];
      //  this.dataOdbijeniArtikli = [];
        Swal.fire("", "Uspješno spremljeno!", "success");
        this.router.navigate(["pages/zahtjevi/redovni-otpis"]);
      },
      (err) => {
        const greska = err.error?.poruka ?? err.statusText;
        Swal.fire("Greška", "Greška: " + greska, "error");
      }
    );
  }
}
