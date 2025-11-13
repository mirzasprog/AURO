import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';
import { DataService } from '../../@core/utils/data.service';

@Component({
  selector: 'ngx-pregled-dinamike-otpisa',
  templateUrl: './pregled-dinamike-otpisa.component.html',
  styleUrls: ['./pregled-dinamike-otpisa.component.scss']
})
export class PregledDinamikeOtpisaComponent implements OnInit {
  settings = {
    actions: false,
    columns: {
      datumOd: {
        title: "Datum početka",
        type: "Date"
      },
      datumDo: {
        title: "Datum završetka",
        type: "Date"
      },
    }
  }

  data = [];
  source: LocalDataSource = new LocalDataSource();
  unos: { datumOd: Date; datumDo: Date };

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.unos = { datumOd: null, datumDo: null };
  }

  prikaziIzdatniceTroskaInterna() {
    //EDiT pozivanje servisa
    this.dataService.pregledajIzdatniceTroskaInterna(this.unos.datumOd.toLocaleDateString(), this.unos.datumDo.toLocaleDateString()).subscribe(
      (r) => {
        this.data = r;
        this.source.load(this.data);
      },
      (err) => {
        const greska = err.error?.poruka ?? err.statusText;
        Swal.fire("Greška", "Greška: " + greska, "error");
      }
    );
  }

}
