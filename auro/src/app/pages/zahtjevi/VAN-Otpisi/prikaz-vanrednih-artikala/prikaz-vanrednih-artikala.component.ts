import { formatCurrency } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NbAuthJWTToken, NbAuthService } from "@nebular/auth";
import { NbDialogService } from "@nebular/theme";
import { isWhitespaceCharacter } from "is-whitespace-character";
import { LocalDataSource } from "ng2-smart-table";
import Swal from "sweetalert2";
import { ListaOdbijenihArtikala } from "../../../../@core/data/lista-odbijenih-artikala";
import { DataService } from "../../../../@core/utils/data.service";
import { OdbijanjeVanrednogOtpisaComponent } from "../odbijanje-vanrednog-otpisa/odbijanje-vanrednog-otpisa.component";
import { ButtonOdobriVoComponent } from "./button-odobri-vo/button-odobri-vo.component";
import { VanredniKomentarComponent } from "./vanredni-komentar/vanredni-komentar.component";

@Component({
  selector: "ngx-prikaz-vanrednih-artikala",
  templateUrl: "./prikaz-vanrednih-artikala.component.html",
  styleUrls: ["./prikaz-vanrednih-artikala.component.scss"],
})
export class PrikazVanrednihArtikalaComponent implements OnInit {
  data = [];
  dataOdbijeniArtikli = [];
  dataOdobreniArtikli = [];

  dataTrenutnoOdbijeniArtikli = [];

  komentari: Array<string> = [];

  unos = { brojOtpisa: "", status: 0, komentar: "" };

  // kada se klikne na odbijanje pojedinog artikla dugmad za odobrenje i odbijanje se iskljuce
  iskljucenoDugmeOtpisa: boolean;

  readonly brojOtpisa;

  source: LocalDataSource = new LocalDataSource();
  sourceOdbijeniArtikli: LocalDataSource = new LocalDataSource();
  sourceTrenutnoOdbijeniArtikli: LocalDataSource = new LocalDataSource();
  sourceTrenutnoOdobreniArtikli: LocalDataSource = new LocalDataSource();


  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    //Kolone za popunjavanje
    columns: {
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
      kolicina: {
        title: "Količina",
        type: "number",
        editable: true,
      },
      potrebnoZbrinjavanje: {
        title: "Potrebno zbrinjavanje",
        type: "string",
        editable: true,
      },
      potrebanTransport: {
        title: "Potreban transport",
        type: "string",
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
      /*
      button: {
        title: 'Akcije',
        type: 'custom',
        renderComponent: VanredniKomentarComponent
      }*/
      odobri: {
        title: "Odobri",
        type: "custom",
        valuePrepareFunction: (value, row, cell) => {
          return row.sifra;
        },
        renderComponent: ButtonOdobriVoComponent,
        onComponentInitFunction: (instance) => {
          instance.uklonjeniRed.subscribe(
            (podaci: { red: object}) => {
                this.dataOdobreniArtikli.push(podaci.red);
                this.sourceTrenutnoOdobreniArtikli.load(this.dataOdobreniArtikli);
                this.source.remove(podaci.red);
                this.iskljucenoDugmeOtpisa = true;
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
        renderComponent: VanredniKomentarComponent,
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


              if (podaci.komentar !== undefined) {
                this.dataTrenutnoOdbijeniArtikli.push(podaci.red);
                this.sourceTrenutnoOdbijeniArtikli.load(
                  this.dataTrenutnoOdbijeniArtikli
                );
                this.source.remove(podaci.red);
                this.iskljucenoDugmeOtpisa = true;
                this.komentari.push(podaci.komentar);
              }
            }
          );
        },
      },
    },
  };
  //Artikli koji nisu odobreni za otpis
  odbijeniArtikli = {
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
      naziv: {
        title: "Naziv artikla",
        type: "string",
        editable: false,
      },
      dobavljac: {
        title: "Dobavljač",
        type: "string",
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

  ngOnInit(): void {
    this.iskljucenoDugmeOtpisa = false;
    this.sourceOdbijeniArtikli.load(this.dataOdbijeniArtikli);
    this.sourceTrenutnoOdbijeniArtikli.load(this.dataTrenutnoOdbijeniArtikli);
    this.unos.brojOtpisa = this.brojOtpisa;
    this.authService.getToken().subscribe((token: NbAuthJWTToken) => {
      this.rola = token.getPayload()["role"];
    });

    this.dataService
      .prikaziDetaljeZahtjevaVanrednogOtpisa(this.brojOtpisa)
      .subscribe(
        (r) => {
          this.data = r.odobreniArtikli;
          this.dataOdbijeniArtikli = r.odbijeniArtikli;

          this.source.load(this.data);
          this.sourceOdbijeniArtikli.load(this.dataOdbijeniArtikli);
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
      artikli.push(artikal.artikalID);
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
            this.router.navigate(["pages/zahtjevi/vanredni-otpis"]);
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
   this.dialogService.open(OdbijanjeVanrednogOtpisaComponent, { context: {  brojOtpisa:  this.brojOtpisa } });

   /** Swal.fire({
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
            this.router.navigate(["pages/zahtjevi/vanredni-otpis"]);
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
        this.dataTrenutnoOdbijeniArtikli = [];
        this.dataOdbijeniArtikli = [];
        Swal.fire("", "Uspješno spremljeno!", "success");
        this.router.navigate(["pages/zahtjevi/vanredni-otpis"]);
      },
      (err) => {
        const greska = err.error?.poruka ?? err.statusText;
        Swal.fire("Greška", "Greška: " + greska, "error");
      }
    );
  }
}
