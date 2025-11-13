import { formatCurrency } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LocalDataSource } from "ng2-smart-table";
import Swal from "sweetalert2";
import { PDTartikliRedovnogOtpisa } from "../../../../../@core/data/PDTartikliRedovnogOtpisa";
import { DataService } from "../../../../../@core/utils/data.service";
import { TabelaDatepickerRendererComponent } from "./tabela-datepicker-renderer/tabela-datepicker-renderer.component";
import { TabelaDatepickerComponent } from "./tabela-datepicker/tabela-datepicker.component";
import { NbIconLibraries } from "@nebular/theme";

@Component({
  selector: "ngx-novi-redovni",
  templateUrl: "./novi-redovni.component.html",
  styleUrls: ["./novi-redovni.component.scss"],
})
export class NoviRedovniComponent implements OnInit {
  //Definicije
  razloziOtpisa = [];
  razloziOtpisaPDT = [];
  ucitavanje = false;
  ucitavanjePDT = false;
  ucitavanjeListe = false;
  postaviDatumIstekaRoka = false;
  nemaOtpisaVAR = false;
  unesenaKolicina: string;
  //Polja za unos korisnika
  unos = {
    sifra: "",
    provedenoSnizenje: "",
    razlog: "",
    kolicina: 1,
    datumIstekaRoka: "",
  };
  //Polja za unos sa PDT liste
  unosSaPDTliste = {
    brojDokumenta: "",
    provedenoSnizenje: "",
    razlog: "",
  };
  //Detalji u listi artikala-- podatci za ispis u listu
  settings = {
    actions: {
      add: false,
    },
    //Opcija za brisanje podataka iz liste za otpis
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    //Opcija za edit podataka u listi za otpis
    edit: {
      editButtonContent: '<i class="nb-edit" [Disabled]></i>',
      saveButtonContent: '<i class="fas fa-check-circle"></i>',
      cancelButtonContent: '<i class="fas fa-times-circle"></i>',
      confirmSave: false
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
      provedenoSnizenje: {
        title: "Provedeno sniženje",
        type: "string",
        editable: false,
        /*
        editor: {
          type: 'list',
          config: {
            list: [{ value: 'DA', title: 'DA' }, { value: 'NE', title: 'NE' }],
          },
        },
        */
      },
      razlog: {
        title: "Razlog otpisa",
        type: "string",
        editable: false,
        /*
        editor: {
          type: 'list',
          config: {
            list: [
              { value: 'Lom', title: 'Lom' }, { value: 'Štetočine', title: 'Štetočine' },
              { value: 'Istek roka trajanja', title: 'Istek roka trajanja' }
            ],
          },
        },
        */
      },
      jedinicaMjere: {
        title: "JM",
        type: "string",
        editable: false,
      },
      kolicina: {
        title: "Količina",
        type: "number",
        editable: false
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
      datumIstekaRoka: {
        title: "Datum isteka roka",
        type: "custom",
        renderComponent: TabelaDatepickerRendererComponent,
        editor: {
          type: "custom",
          component: TabelaDatepickerComponent
        }

      },
    },
  };
  data = [];
  source: LocalDataSource = new LocalDataSource();

  constructor(private dataService: DataService, private router: Router,private iconService: NbIconLibraries) {
    this.source.load(this.data);
    this.iconService.registerFontPack('font-awesome', { packClass: 'fa' });
  }
  ngOnInit(): void {
    this.razloziOtpisa = [];
    this.unos.provedenoSnizenje = null;
    if (localStorage.getItem("zavrsen_otpis") == "1") {
      this.nemaOtpisaVAR = true;
    } else {
      this.nemaOtpisaVAR = false;
    }
    this.dataService.provjeriOmogucenOtpis().subscribe(
      (otpis) => {
        // prodavnica prijavila da nema otpisa
        // potrebno je izvršiti redirekciju iako se vidi link za novi otpis
        if (this.nemaOtpisaVAR) {
          this.router.navigate(['/pages/pocetna-stranica/radna-ploca']);
        } else if(!otpis.omogucenUnosOtpisa){
          this.router.navigate(['pages/pocetna-stranica/radna-ploca'])    
        }
        else {
          return;
        }
      },
      (err) => {
        const greska = err.error?.poruka ?? err.statusText;
        Swal.fire("Greška", "Greška: " + greska, "error");
      }
    );
  }
  //Funkcija za potvrdu brisanja unesenih artikala  u listu za otpis
  onDeleteConfirm(event): void {
    if (window.confirm("Želite li obrisati stavku?")) {
      let index = this.data.indexOf(event.data);
      this.data.splice(index, 1);
      // Update the local datasource
      this.source = new LocalDataSource(this.data);
    } else {
      event.confirm.reject();
    }
  }
  onSaveConfirm(event) {
    if(this.razloziOtpisa = ["Lom"]){
      event.isActionEditDisable  = true;
      //console.log("Lom");
    }
    else if(this.razloziOtpisa = ["Štetočine"]){
      event.isActionEditDisable  = true;
      //console.log("Štetočine");
    }
    else if(this.razloziOtpisa = ["Istek roka trajanja"]){
     // console.log("Rok trajanja");
    }
    if (window.confirm("Jeste li sigurni da želite spasiti promijene?")) {
      event.newData["ukupnaVrijednost"] = (
        event.newData["kolicina"] * event.newData["nabavnaVrijednost"]
      ).toFixed(2);
      event.confirm.resolve(event.newData);
    }
    else {
      event.confirm.reject();

    }
  }
  //Funkcija za spremanje artikala u listu za otpis
  spremi(): void {
    this.source.getAll().then((elementi) => {
      //if (unosPostoji) {
      //Swal.fire("Greška", "Artikal sa istom šifrom je već unesen", "error");
      //} else {
      this.ucitavanje = true;
      this.unos.kolicina = parseFloat(this.unesenaKolicina.replace(",", "."));

      this.dataService.dodajOtpis(this.unos).subscribe(
        (r) => {
          if(this.unos.kolicina > 500){
            Swal.fire({
              title: "Greška",
              text: "Pravilno unesite količinu za otpis, maksimalna dozvoljena količina je 500!",
              icon: "error",
              showCancelButton: false,
              showConfirmButton:false,
              timer:3500,
            })
            this.ucitavanje = false;
            return;
          }
          else if (this.unos.kolicina > 100) {
            Swal.fire({
              title: "Jeste li sigurni?",
              text: "Unesena količina je prkeo 100!",
              icon: "info",
              showCancelButton: true,
              cancelButtonText: "Ne",
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Da"
            }).then(async (result) => {
              if (result.isConfirmed) {
                this.source.add(r);
                this.source.refresh();
                this.ucitavanje = false;
               const Toast = Swal.mixin({
                  toast: true,
                  position: "top-end",
                  iconColor: 'white',
                 // title: "Artikal uspješno učitan",
                  showConfirmButton: false,
                  timer: 3000,
                  timerProgressBar: true,
                  background: "#a5dc86" ,
                  didOpen: (toast) => {
                    toast.addEventListener("mouseenter", Swal.stopTimer);
                    toast.addEventListener("mouseleave", Swal.resumeTimer);
                  },
                });
                Toast.fire({
                  icon: "success",
                  title: "<h6 style='color:white'>" + "Artikal uspješno učitan" + "</h6>",
                });
                this.unos.kolicina = 1;
                this.unos.sifra = null;
                this.unesenaKolicina = null;
              }else{
                this.ucitavanje = false;
              return;
              }
            })
          }
          else {
            this.source.add(r);
            this.source.refresh();
            this.ucitavanje = false;
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              background: "#a5dc86" ,
              iconColor: 'white',
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
              },
            });

            Toast.fire({
              icon: "success",
              title: "<h6 style='color:white'>" + "Artikal uspješno učitan" + "</h6>",
            });
            this.unos.kolicina=1;
            this.unos.sifra=null;
            this.unesenaKolicina = null;
          }
        },
        (err) => {
          this.ucitavanje = false;
          const greska = err.error?.poruka ?? err.statusText;
          Swal.fire("Greška", "Greška: " + greska, "error");
        }
      );
    });
  }
  //Funkcija za spremanje PDT liste
  spremiPDT(): void {
    this.ucitavanjePDT = true;
    this.dataService.dodajPDTRedovnogOtpisa(this.unosSaPDTliste).subscribe(
      (r: Array<PDTartikliRedovnogOtpisa>) => {
       if(r.length ==0){
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          background: "#f27474",
          iconColor:'white',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        Toast.fire({
          icon: 'error',
          title: "<h6 style='color:white'>" + "Neispravan broj PDT liste!" + "</h6>"
        })
       /**  Swal.fire({
          icon: 'error',
          title: 'Greška!',
          text: 'Neispravan broj PDT liste!',
          showConfirmButton: false,
          timer: 2500,
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
          hideClass: {
            popup: "animate__animated animate__hinge",
          },
        })*/

        this.ucitavanjePDT = false;
        return;
       }
        this.source.getAll().then((elementi) => {
          this.ucitavanjePDT = false;
          for (let i of r) {
            let unosPostoji = elementi.some((e) => e.sifra == i.sifra);

            if (!unosPostoji) {
              this.source.append(i);
            }
          }
          this.source.refresh();
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            background: "#a5dc86",
            iconColor:'white',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
          Toast.fire({
            icon: 'success',
            title: "<h6 style='color:white'>" + "Lista uspješno učitana" + "</h6>"
          })

        });
        this.ucitavanjePDT = true;
        this.unosSaPDTliste.brojDokumenta=null;
        this.unosSaPDTliste.provedenoSnizenje=null;
        this.unosSaPDTliste.razlog=null;
      },
      (err) => {
        this.ucitavanjePDT = false;
        const greska = err.error?.poruka ?? err.statusText;
        Swal.fire("Greška", "Greška: " + greska, "error");
      }
    );
  }

  //Funkcja za postavljanje razloga otpisa
  postaviRazlogeOtpisa(): void {
    this.unos.razlog = null;
    if (this.unos.provedenoSnizenje === "DA"){
       (this.razloziOtpisa = ["Istek roka trajanja"]),
        (this.postaviDatumIstekaRoka = false)
      //  (this.test=true)
    } else{
      (this.razloziOtpisa = ["Lom", "Štetočine"]),
        (this.postaviDatumIstekaRoka = true),
        (this.unos.datumIstekaRoka = null);
      } // (this.test=false)
  }
  //Funkcja za potavljanje razloga otpisa sa PDT liste
  postaviRazlogeOtpisaPDT(): void {
    this.unosSaPDTliste.razlog = null;
    if (this.unosSaPDTliste.provedenoSnizenje === "DA")
      this.razloziOtpisaPDT = ["Istek roka trajanja"];
    else this.razloziOtpisaPDT = ["Lom", "Štetočine"];
  }
  //Funkcija za čiščenje unosa korisnika
  ocistiUnos() {
    this.unos = {
      sifra: "",
      provedenoSnizenje: "",
      razlog: "",
      kolicina: 1,
      datumIstekaRoka: "",
    };
    this.unesenaKolicina= null;
  }
  //Funkcija za čiščenje unosa sa PDT liste
  ocistiPDT() {
    this.unosSaPDTliste = {
      brojDokumenta: "",
      provedenoSnizenje: "",
      razlog: "",
    };
  }
  //Funkcija za slanje povratne informacije da nije bilo otpisa [Redovni otpis]
  nemaOtpisa() {
    Swal.fire({
      title: "Jeste li sigurni?",
      text: "Potvrdite da nema otpisa!",
      icon: "question",
      showCancelButton: true,
      cancelButtonText: "Ne",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Da",
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataService.prijaviNemaOtpisa().subscribe(
          (_) => {
            Swal.fire(
              "Potvrda!",
              "Uspješno ste prijavili da nema artikala za otpis!",
              "success"
            );
            this.nemaOtpisaVAR = true;
            localStorage.setItem("zavrsen_otpis", "1");
          },
          (err) => {
            const greska = err.error?.poruka ?? err.statusText;
            Swal.fire("Greška", "Greška: " + greska, "error");
          }
        );
      }
    });
  }

  //Funkcija za upis spremljenih aritkala iz liste za otpis
  spremiListuArtikala(): void {

    // validacija unesenih artikala na listi
    for (let artikal of this.data) {
      if (artikal.provedenoSnizenje == "DA" && artikal.datumIstekaRoka == null) {
        Swal.fire("Greška", `Niste unijeli datum isteka roka za artikal ${artikal.sifra && artikal.naziv}`);
        return;
      }else if (artikal.provedenoSnizenje == "DA" && artikal.datumIstekaRoka == undefined ) {
        Swal.fire("Greška", `Niste unijeli datum isteka roka za artikal ${artikal.sifra && artikal.naziv}`);
        return;
      }else if (artikal.provedenoSnizenje == "DA" &&  artikal.datumIstekaRoka == "") {
        Swal.fire("Greška", `Niste unijeli datum isteka roka za artikal ${artikal.sifra && artikal.naziv}`);
        return;
      }
     if (artikal.provedenoSnizenje == "NE" && artikal.datumIstekaRoka == ""){
        artikal.datumIstekaRoka = undefined;
        //Swal.fire("Greška", `Niste unijeli datum isteka roka za artikal Novi test neki ${artikal.sifra && artikal.naziv}`);
       //return;
      }
    }

    if (this.source.count() == 0) {
      Swal.fire("Artikal", "Niste dodali artikal na listu otpisa");
      return;
    }
    Swal.fire({
      title: "Jeste li sigurni?",
      text: "Potvrdite artikle za unos!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Da",
      cancelButtonText: "Ne",
    }).then((result) => {
      if (result.isConfirmed) {
        this.ucitavanjeListe = true;
      //  this.unos.kolicina = parseFloat(this.unos.kolicina);
        this.dataService.spremiListuOtpisa(this.data).subscribe(
          (_) => {
            this.ucitavanjeListe = false;
            Swal.fire({
              icon: "success",
              title: "Uspješno spremljeno",
              showConfirmButton: false,
              timer: 2500,
              showClass: {
                popup: "animate__animated animate__bounceInUp",
              },
              hideClass: {
                popup: "animate__animated animate__bounceOutUp",
              },
            });
            this.data = [];
            this.source.load(this.data);
          },
          (err) => {
            this.ucitavanjeListe = false;
            const greska = err.error?.poruka ?? err.statusText;
            Swal.fire("Greška", "Greška: " + greska, "error");
          }
        );
      }
    });

  }
  //Funkcija za brisanje svih artikala iz liste za otpis
  ocistiListuArtikala() {
    if (this.source.count() !== 0) {
      Swal.fire({
        title: "Jeste li sigurni?",
        text: "Potvrdite da ispraznite listu!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Da",
        cancelButtonText: "Ne",
      }).then((result) => {
        if (result.isConfirmed) {
          for (let i = 0; i < this.data.length; i++) {
            this.data.splice(i);
            this.source.load(this.data);
            Swal.fire({
              icon: "info",
              title: "Lista artikala uspješno ispražnjena",
              showConfirmButton: false,
              timer: 1500,
              showClass: {
                popup: "animate__animated animate__fadeInDown",
              },
              hideClass: {
                popup: "animate__animated animate__hinge",
              },
            });
          }
        }
      });
    }
  }
}
