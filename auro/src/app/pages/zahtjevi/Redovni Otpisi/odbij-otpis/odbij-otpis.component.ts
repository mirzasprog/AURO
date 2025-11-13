import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NbAuthService } from "@nebular/auth";
import { NbDialogRef } from "@nebular/theme";
import { isWhitespaceCharacter } from "is-whitespace-character";
import { LocalDataSource } from "ng2-smart-table";
import Swal from "sweetalert2";
import { DataService } from "../../../../@core/utils/data.service";

@Component({
  selector: "ngx-odbij-otpis",
  templateUrl: "./odbij-otpis.component.html",
  styleUrls: ["./odbij-otpis.component.scss"],
})
export class OdbijOtpisComponent implements OnInit {
  data = [];
  brojOtpisa: string;
  dataOdbijeniArtikli = [];
  dataTrenutnoOdbijeniArtikli = [];
  dataTrenutnoOdobreniArtikli = [];
  komentari: Array<string> = [];
  otpisButton = false;
  unos = { brojOtpisa: "", status: 0, komentar: "" };
  constructor(
    protected dialogRef: NbDialogRef<OdbijOtpisComponent>,
    private dataService: DataService,
    public activatedRoute: ActivatedRoute,
    private router: Router
  ) {}
  source: LocalDataSource = new LocalDataSource();
  ngOnInit(): void {
    //this.brojOtpisa = this.activatedRoute.snapshot.paramMap.get('brojOtpisa');
  }
  //Funkcija za spremanje komentara odbijanja cijelog otpisa
  //EDIT Potrbno je implementirati zaseban servis za komentar odbijanja na nivou otpisa
  // -- trenutno koristi servis za odbijanje artikla pojedinacno
  spremi() {
    if (this.unos.komentar == undefined || this.unos.komentar == "") {
      Swal.fire("Greška...", "Unesite komentar odbijanja artikla!", "error");
      return;
    }
    if (isWhitespaceCharacter(this.unos.komentar)) {
      Swal.fire("Greška...", "Unesite komentar odbijanja artikla!", "error");
      return;
    }
    Swal.fire({
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
        this.unos.brojOtpisa = this.brojOtpisa;
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
            this.router.navigate(["pages/zahtjevi/redovni-otpis"]);
          },
          (err) => {
            const greska = err.error?.poruka ?? err.statusText;
            Swal.fire("Greška", "Greška: " + greska, "error");
          }
        );
      }
    });
    this.dialogRef.close();
  }
}
