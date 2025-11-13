import { formatCurrency } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';
import { DataService } from '../../../../@core/utils/data.service';
import { KomentarOdbijenihIzdaticaComponent } from './komentar-odbijenih-izdatica/komentar-odbijenih-izdatica.component';

@Component({
  selector: 'ngx-artikli-izdatnice-detalji',
  templateUrl: './artikli-izdatnice-detalji.component.html',
  styleUrls: ['./artikli-izdatnice-detalji.component.scss']
})
export class ArtikliIzdatniceDetaljiComponent implements OnInit {
  settings = {
    actions: {
      add: false,
      delete: false,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
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
      razlog: {
        title: "Razlog",
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
        UpdateVrijednosti: (cell, row) => {
          return row.kolicina * row.nabavnaVrijednost;
        },
        valuePrepareFunction: (value, row, cell) => {
          return formatCurrency(value, 'bs-BS', 'KM')
        }
      },
      button: {
        title: 'Akcije',
        type: 'custom',
        editable: false,
        renderComponent: KomentarOdbijenihIzdaticaComponent
      }
    },
  };
  //Artikli koji nisu odobreni za otpis
  odbijeniArtikli = {
    actions: {
      add: false,
      edit: false,
      delete: false
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
      razlog: {
        title: "Razlog otpisa",
        type: "string",
        editable: false,
      },
      nabavnaVrijednost: {
        title: "NV",
        type: "number",
        editable: false,
      },
      ukupnaVrijednost: {
        title: "Ukupna Vrijednost",
        type: "number",
        editable: false,
      }
    },
  };

  data = [];
  readonly brojIzdatnice;

  source: LocalDataSource = new LocalDataSource();
  constructor(private dataService: DataService, public activatedRoute: ActivatedRoute) {
    this.brojIzdatnice = activatedRoute.snapshot.paramMap.get('brojIzdatnice');
  }

  ngOnInit(): void {
    this.dataService.prikaziDetaljeZahtjevaIzdatnica(this.brojIzdatnice).subscribe(
      (r) => {
        this.data = r;
        this.source.load(this.data);
      },
      (err) => {
        const greska = err.error.poruka || err.statusText;
        Swal.fire("Greška", "Greška: " + greska, "error");
      }
    );

  }
  //Funkcija za spremanje editovanih podataka u listi za otpis
  onSaveConfirm(event) {
    console.log("Test")
    if (window.confirm('Jeste li sigurni da želite spasiti promijene?')) {
      event.newData['ukupnaVrijednost'] = (event.newData['kolicina'] * event.newData['nabavnaVrijednost']).toFixed(2);
      event.confirm.resolve(event.newData);

    } else {
      event.confirm.reject();
    }
  }

  spremi() {
    //EDIT
  }

  spremiOdobreneArtikle() {

  }
  spremiOdbijeneArtikle() {

  }
}
