import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';
import { DataService } from '../../@core/utils/data.service';

@Component({
  selector: 'ngx-unos-datuma-redovnog-otpisa',
  templateUrl: './unos-datuma-redovnog-otpisa.component.html',
  styleUrls: ['./unos-datuma-redovnog-otpisa.component.scss']
})
export class UnosDatumaRedovnogOtpisaComponent implements OnInit {

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
 

  prikazi() {
    this.source.getAll().then((elementi) => {
      this.dataService.unesiDatumOtpisaList(this.unos).subscribe(
        (r) => {
          this.source.load(this.data);
          this.source.refresh();
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
          this.unos={
            datumDo:null,
            datumOd:null
          };
        },
        (err) => {
          const greska = err.error?.poruka ?? err.statusText;
          Swal.fire("Greška", "Greška: " + greska, "error");
        }
      );
    }
   
  )}

}
