import { Component, Input, OnInit } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import Swal from "sweetalert2";
import { DataService } from "../../../../@core/utils/data.service";

@Component({
  selector: "ngx-komentar-odbijenih-otpisa",
  templateUrl: "./komentar-odbijenih-otpisa.component.html",
  styleUrls: ["./komentar-odbijenih-otpisa.component.scss"],
})
export class KomentarOdbijenihOtpisaComponent implements OnInit {

  @Input() sifraArtikla: string;
  @Input() brojOtpisa: string;
  uneseniKomentar: string;

  /*
  unos = {
    komentar: ""
  };
*/
  constructor(private dataService: DataService, protected dialogRef: NbDialogRef<KomentarOdbijenihOtpisaComponent>) {}

  ngOnInit(): void {
    this.uneseniKomentar = null;
  }
  //Funkcija za spremanje komentara odbijanja redovnog otpisa

  spremi() {
   // this.unos.sifraArtikla = this.sifraArtikla;
   // this.unos.brojOtpisa = this.brojOtpisa;

    this.dialogRef.close(this.uneseniKomentar);
/*
    this.dataService.odobriOdbijOtpis(this.unos).subscribe(
      (_) => {
      //  this.dialogRef.close(this.unos.sifraArtikla);
      this.dialogRef.close();
      },
      (err) => {
        const greska = err.error?.poruka ?? err.statusText;
        Swal.fire("Greška", "Greška: " + greska, "error");
      }
    );
    */
  }
}
