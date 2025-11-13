import { formatCurrency } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';
import { DataService } from '../../../@core/utils/data.service';
import { NbIconLibraries } from '@nebular/theme';

@Component({
  selector: 'ngx-vanredni',
  templateUrl: './vanredni.component.html',
  styleUrls: ['./vanredni.component.scss']
})
export class VanredniComponent implements OnInit {
  //Definicije
  ucitavanje = false;
  ucitavanjeListe = false;
  ucitavanjePDT = false;
  unesenaKolicina: string;

  razloziOtpisa = ['Uništenje robe uslijed poplave',
    'Uništenje robe uslijed zemljotresa',
    'Uništenje robe uslijed požara',
    'Uništenje robe uslijed kvara frižidera',
    'Uništenje robe uslijed kvara komore',
    'Uništenje robe po nalogu inspekcije',
    'Uništenje robe uslijed nestanka električne energije',
    'Štetočine'
  ];
  //Polja za unos korisnika
  unos = {
    razlog: "",
    potrebnoZbrinjavanje: "",
    potrebanTransport: "",
    komentar: null,
    sifra: "",
    kolicina: 1,
    sifraPDT: ""
  };
  //Unos sa PDT liste
  unosPDTListe = {
    razlog: "",
    potrebnoZbrinjavanje: "",
    potrebanTransport: "",
    brojDokumenta: ""
  };
  //Detalji u listi artikala-- podatci za ispis u listu
  settings = {
    actions: {
      add: false,
      edit:false,
    },
    //Opcija za edit podataka u listi za otpis
 /**   edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
     */
    //Opcija za brisanje podataka iz liste za otpis
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    //Polja u listi vanrednog otpisa
    columns: {
      sifra: {
        title: "Šifra artikla",
        type: "string",
        editable: false
      },
      naziv: {
        title: "Naziv",
        type: "string",
        editable: false
      },
      razlog: {
        title: "Razlog otpisa",
        type: "string",
        editable: false,
        /**  editor: {
           type: 'list',
           config: {
             list: [
               { value: 'Uništenje robe uslijed poplave', title: 'Uništenje robe uslijed poplave' },
               { value: 'Uništenje robe uslijed zemljotresa', title: 'Uništenje robe uslijed zemljotresa' },
               { value: 'Uništenje robe uslijed požara', title: 'Uništenje robe uslijed požara' },
               { value: 'Uništenje robe uslijed kvara frižidera', title: 'Uništenje robe uslijed kvara frižidera' },
               { value: 'Uništenje robe uslijed kvara komore', title: 'Uništenje robe uslijed kvara komore' },
               { value: 'Uništenje robe po nalogu inspekcije', title: 'Uništenje robe po nalogu inspekcije' },
               { value: 'Uništenje robe uslijed nestanka električne energije', title: 'Uništenje robe uslijed nestanka električne energije' },
               { value: 'Štetočine', title: 'Štetočine' }
             ]
           },
         }*/
      },
      potrebnoZbrinjavanje: {
        title: "Potrebno zbrinjavnje",
        type: "string",
        editable: false,
        /**  editor: {
          type: 'list',
          config: {
            list: [{ value: 'DA', title: 'DA' }, { value: 'NE', title: 'NE' },
            ]
          },
        }*/
      },
      potrebanTransport: {
        title: "Potreban transport",
        type: "string",
        editable: false,
        /**  editor: {
           type: 'list',
           config: {
             list: [{ value: 'DA', title: 'DA' }, { value: 'NE', title: 'NE' },
             ]
           },
         }*/
      },
      jedinicaMjere: {
        title: "JM",
        type: "string",
        editable: false
      },
      kolicina: {
        title: "Količina",
        type: "number",
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
        title: "Ukupna vrijednost",
        type: "number",
        editable: false,
        UpdateVrijednosti: (cell, row) => {
          return row.kolicina * row.nabavnaVrijednost;
        },
        valuePrepareFunction: (value, row, cell) => {
          return formatCurrency(value, 'bs-BS', 'KM')
        }
      },
    },
  };

  data = [];

  source: LocalDataSource = new LocalDataSource();

  constructor(private dataService: DataService,private iconService: NbIconLibraries) {
    this.source.load(this.data);
    this.iconService.registerFontPack('font-awesome', { packClass: 'fa' });
  }
  ngOnInit(): void {
    this.unos.potrebanTransport = null;
    this.unos.potrebnoZbrinjavanje = null;
  }
  //Funkcija za potvrdu brisanja dodanih artikala u listu
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
  //Funkcija za spremanje editovanih podataka u listi za otpis
  onSaveConfirm(event) {
    if (window.confirm('Jeste li sigurni da želite spasiti promijene?')) {
      event.newData['ukupnaVrijednost'] = (event.newData['kolicina'] * event.newData['nabavnaVrijednost']).toFixed(2);
      event.confirm.resolve(event.newData);

    } else {
      event.confirm.reject();
    }
  }
  //Funkcija za čiščenje unosa korisnika
  ocistiUnos() {
    this.unos = {
      razlog: "",
      potrebnoZbrinjavanje: "",
      potrebanTransport: "",
      komentar: null,
      sifra: "",
      kolicina: null,
      sifraPDT: null
    };
    this.unesenaKolicina=null;
  }
  //Funkcija za čiščenje unosa sa PDT liste
  ocistiPDT() {
    this.unosPDTListe = {
      razlog: "",
      potrebnoZbrinjavanje: "",
      potrebanTransport: "",
      brojDokumenta: ""
    };
  }
  //Funkcija za spremanje unesenih vrijednosti/podataka
  spremi(): void {
    this.unos.kolicina = parseFloat(this.unesenaKolicina.replace(",", "."));

    this.source.getAll().then((elementi) => {
      let unosPostoji = elementi.some((e) => e.sifra == this.unos.sifra.trim());
      this.dataService.dodajVanredniOtpis(this.unos).subscribe(
        (r) => {
          if (this.unos.kolicina > 500) {
            Swal.fire({
              title: "Greška",
              text: "Pravilno unesite količinu za otpis, maksimalna dozvoljena količina je 500!",
              icon: "error",
              showCancelButton: false,
              showConfirmButton: false,
              timer: 3500,
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
            }).then((result) => {
              if (result.isConfirmed) {
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
              /**  const Toast = Swal.mixin({
                  toast: true,
                  position: "top-end",
                  showConfirmButton: false,
                  timer: 3000,
                  timerProgressBar: true,
                  didOpen: (toast) => {
                    toast.addEventListener("mouseenter", Swal.stopTimer);
                    toast.addEventListener("mouseleave", Swal.resumeTimer);
                  },
                });

                Toast.fire({
                  icon: "success",
                  title: "Artikal uspješno učitan",
                }); */
                this.unos.kolicina = 1;
                this.unesenaKolicina = null;
                this.unos.sifra = null
              }
            })
          }
          else if (unosPostoji) {
            Swal.fire("Greška", "Artikal sa istom šifrom je već unesen", "error");
          }
          else {
            this.ucitavanje = true;
            this.dataService.dodajVanredniOtpis(this.unos).subscribe(
              (r) => {
                this.data.push(r);
                this.source.load(this.data);
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
                /*  const Toast = Swal.mixin({
                  toast: true,
                  position: 'top-end',
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
                  title: 'Artikal spremljen u listu'
                })*/
              },
            );
            this.unos.kolicina = 1;
            this.unos.sifra = null;
            this.unesenaKolicina = null;
          }
        },
        (err) => {
          this.ucitavanje = false;
          const greska = err.error.poruka || err.statusText;
          Swal.fire("Greška", "Greška: " + greska, "error");
        }
      );
    });
  }
  //Funkcija za spremanje unesenih vrijednosti/podataka sa PDT liste
  spremiPDT(): void {
    this.source.getAll().then((elementi) => {
      this.ucitavanjePDT = true;
      this.dataService.dodajPDTVanrednogOtpisa(this.unosPDTListe).subscribe(
        (r) => {
          if (r.length == 0) {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              background: "#f27474",
              iconColor:'white',
              showConfirmButton: false,
              timer: 4000,
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
            /*    Swal.fire({
              icon: 'error',
              title: 'Greška!',
              text: 'Neispravan broj PDT liste!',
              showConfirmButton: false,
              timer: 2500,
              showClass: {
                popup: "animate__animated animate__zoomInUp",
              },
              hideClass: {
                popup: "animate__animated animate__zoomOutUp",
              },
            })*/
            this.ucitavanjePDT = false;
            return;
          }
          for (let i = 0; i < r.length; i++) {
            this.data.push(r[i]);
          }
          this.source.load(this.data);
          this.ucitavanjePDT = false;
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
          /*  const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
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
            title: 'Lista uspješno učitana'
          })*/
          this.unosPDTListe.brojDokumenta = null;
          this.unosPDTListe.potrebanTransport = "";
          this.unosPDTListe.potrebnoZbrinjavanje = "";
          this.unosPDTListe.razlog = "";

        },

        (err) => {
          this.ucitavanjePDT = false;
          const greska = err.error.poruka || err.statusText;
          Swal.fire("Greška", "Greška: " + greska, "error");
        }
      );
    }
    );

  }
  //Funkcija za spremanje liste dodatih artikala za vanredni otpis
  spremiListuVArtikala(): void {
    if (this.source.count() == 0) {
      Swal.fire("Artikal", "Niste dodali artikal na listu otpisa");
      return;
    }
    Swal.fire({
      title: 'Jeste li sigurni?',
      text: "Potvrdite artikle za unos!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Da',
      cancelButtonText: 'Ne'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ucitavanjeListe = true;
        this.dataService.spremiListuVOtpisa(this.data).subscribe(
          (_) => {
            this.ucitavanjeListe = false;
            Swal.fire({
              icon: 'success',
              title: 'Uspješno spremljeno',
              showConfirmButton: false,
              timer: 2500,
              showClass: {
                popup: 'animate__animated animate__zoomInUp'
              },
              hideClass: {
                popup: 'animate__animated animate__zoomOutUp'
              }
            });
            this.data = [];
            this.source.load(this.data);
          },
          (err) => {
            this.ucitavanjeListe = false;
            const greska = err.error.poruka || err.statusText;
            Swal.fire("Greška", "Greška: " + greska, "error");
          }
        );
      }
    })
  }
  //Funkcija za brisanje svih artikala iz liste za otpis
  ocistiListuArtikala() {
    if (this.source.count() !== 0) {
      Swal.fire({
        title: 'Jeste li sigurni?',
        text: "Potvrdite da ispraznite listu!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Da',
        cancelButtonText: 'Ne'
      }).then((result) => {
        if (result.isConfirmed) {
          for (let i = 0; i < this.data.length; i++) {
            this.data.splice(i)
            this.source.load(this.data)
            Swal.fire({
              icon: 'info',
              title: 'Lista artikala uspješno ispražnjena',
              showConfirmButton: false,
              timer: 1500,
              showClass: {
                popup: 'animate__animated animate__fadeInDown'
              },
              hideClass: {
                popup: 'animate__animated animate__hinge'
              }
            });
          }
        }
      })
    }
  }
}

