import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'ngx-kontrolne-inventure',
  templateUrl: './kontrolne-inventure.component.html',
  styleUrls: ['./kontrolne-inventure.component.scss']
})
export class KontrolneInventureComponent implements OnInit {

  settings = {
    actions: {
      add: false,
      edit: false,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },

    //Polja u listi redovnih otpisa :
    columns: {
      redniBroj: {
        title: "Redni broj",
        type: "number",
        valuePrepareFunction: (value, row, cell) => {
          return cell.row.index + 1;
        },
      },
      brojInventure: {
        title: "Broj inventure",
        type: "number",
      },
      datumInventure: {
        title: "Datum inventure",
        type: "string",
      },
      inventurnaVrijednost: {
        title: "Inventurna vrijednost",
        type: "number",
      },
      knjigovodstvenaVrijednost: {
        title: "Knjigovodstvena vrijednost",
        type: "string",
      },
      inventurnaRazlika: {
        title: "Inventurna razlika",
        type: "number",
      },
      klasifikacija: {
        title: "Klasifikacija",
        type: "string",
      },
      grupa: {
        title: "Grupa",
        type: "string",
      },
    },
  };

  data = [];

  source: LocalDataSource = new LocalDataSource();
  unos: { datumOd: Date; datumDo: Date };
  constructor() { }

  ngOnInit(): void {
    this.unos = { datumOd: null, datumDo: null };
  }

    //Funkcija za potvrdu brisanja unesenih artikala  u listu za otpis
    onDeleteConfirm(event): void {
      if (window.confirm("Želite li obrisati stavku?")) {
        this.source.remove(event.data);
        event.confirm.resolve();
      } else {
        event.confirm.reject();
      }
    }

    spremi(){
      // EDIT ######################
    }
  

}
