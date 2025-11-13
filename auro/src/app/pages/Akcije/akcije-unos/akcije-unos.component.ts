import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ButtonPregledAkcijeComponent } from '../button-pregled-akcije/button-pregled-akcije.component';

@Component({
  selector: 'ngx-akcije-unos',
  templateUrl: './akcije-unos.component.html',
  styleUrls: ['./akcije-unos.component.scss']
})
export class AkcijeUnosComponent implements OnInit {
  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    //Kolone u tabeli
    columns: {
      opis: {
        title: "Opis",
        type: "string",
        editable: false,
      },
      pocetak: {
        title: "Početak",
        type: "string",
        editable: false,
      },
      kraj: {
        title: "Kraj",
        type: "string",
        editable: false,
      },
      stavke: {
        title: "Stavke",
        type: "number",
      },
      pregled: {
        title: "Pregled",
        type: "custom",
        filter: false,
        renderComponent: ButtonPregledAkcijeComponent
      },
    },
  };
  data = [];
  source: LocalDataSource = new LocalDataSource();

  constructor() {

   }

  ngOnInit(): void {
    //TODO: izbrisati temp podatke
    this.data = [
      {
        opis: 'Aktivna prodaja Pakirana 29.01.-31.01.; N1 01.02.-04.02.2024.',
        pocetak: '23.09.2024',
        kraj: '30.09.2024',
        stavke: 30
      },     
      {
        opis: 'Vikend akcija Konzum-Mercator 01.02-04.02.2024',
        pocetak: '23.09.2024',
        kraj: '30.09.2024',
        stavke: 22
      },     
      {
        opis: 'VA 08.02.-11.02.2024.',
        pocetak: '23.09.2024',
        kraj: '30.09.2024',
        stavke: 15
      },     
      {
        opis: 'Aktivna prodaja N1 14.03.-17.03.; Pakirana 11.03.-13.03.2024.',
        pocetak: '23.09.2024',
        kraj: '30.09.2024',
        stavke: 49
      },
    ];
    this.source.load(this.data);
  }

}
