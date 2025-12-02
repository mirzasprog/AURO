import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Akcija } from '../../../@core/data/akcija';
import { DataService } from '../../../@core/utils/data.service';
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
      nazivAkcije: {
        title: "Opis",
        type: "string",
        editable: false,
      },
      pocetak: {
        title: "Početak",
        type: "string",
        editable: false,
        valuePrepareFunction: (value) => new Date(value).toLocaleString('bs-BA')
      },
      kraj: {
        title: "Kraj",
        type: "string",
        editable: false,
        valuePrepareFunction: (value) => new Date(value).toLocaleString('bs-BA')
      },
      pregled: {
        title: "Pregled",
        type: "custom",
        filter: false,
        renderComponent: ButtonPregledAkcijeComponent
      },
    },
  };
  data: Akcija[] = [];
  source: LocalDataSource = new LocalDataSource();
  loading = false;
  greska?: string;

  constructor(private dataService: DataService) {

   }

  ngOnInit(): void {
    this.ucitajAkcije();
  }

  private ucitajAkcije(): void {
    this.loading = true;
    this.greska = undefined;
    this.dataService.preuzmiAkcije().subscribe({
      next: (akcije) => {
        const mapped = akcije.map(a => ({
          id: a.id ?? a.Id ?? 0,
          nazivAkcije: a.nazivAkcije ?? a.NazivAkcije ?? '',
          pocetak: a.pocetak ?? a.Pocetak ?? '',
          kraj: a.kraj ?? a.Kraj ?? ''
        } as Akcija));

        this.data = mapped;
        this.source.load(mapped);
      },
      error: (err) => {
        this.greska = err?.error?.poruka ?? 'Greška pri preuzimanju akcija.';
      }
    }).add(() => this.loading = false);
  }

}
