import { formatCurrency } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import Swal from 'sweetalert2';
import { DataService } from '../../../@core/utils/data.service';
import { ExportVanredniOtpisService } from '../../../@core/utils/export-vanredni-otpis.service';

@Component({
  selector: 'ngx-odobreni-artikli-vo',
  templateUrl: './odobreni-artikli-vo.component.html',
  styleUrls: ['./odobreni-artikli-vo.component.scss']
})
export class OdobreniArtikliVOComponent implements OnInit {
  settings = {
    actions: {
      add: false,
      edit:false,
      delete:false
    },
    //Polja u listi redovnih otpisa :
    columns: {
      sifra: {
        title: "Šifra artikla",
        type: "string",
      },
      naziv: {
        title: "Naziv artikla",
        type: "string",
      },
      dobavljac: {
        title: "Dobavljač",
        type: "string",
      },
      razlogOtpisa: {
        title: "Razlog otpisa",
        type: "string",
      },
      jedinicaMjere: {
        title: "JM",
        type: "string",
      },
      kolicina: {
        title: "Količina",
        type: "number",
      },
      nabavnaVrijednost: {
        title: "NV",
        type: "number",
        valuePrepareFunction: (value, row, cell) => {
          return formatCurrency(value, 'bs-BS', 'KM')
        }
      },
      ukupnaVrijednost: {
        title: "Ukupna vrijednost",
        type: "number",
        valuePrepareFunction: (value, row, cell) => {
          return formatCurrency(value, 'bs-BS', 'KM')
        }
      },
      potrebnoZbrinjavanje: {
        title: "Potrebno zbrinjavanje",
        type: "string",
      },
      potrebanTransport: {
        title: "Potreban transport",
        type: "string",
      },
    },
  };
  data = [];
  source: LocalDataSource = new LocalDataSource();
  readonly brojOtpisa: string;

  constructor(private dataService: DataService, private route: ActivatedRoute, private pdf: ExportVanredniOtpisService) {
    this.brojOtpisa = this.route.snapshot.paramMap.get("brojOtpisa");
   }


  ngOnInit(): void {
    this.dataService.prikaziDetaljeVanrednogOtpisaOdobreno(this.brojOtpisa).subscribe(
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
//EDIT napraviti servis za ispis vanrednog otpisa!
  exportPDF() {
    let ukupno = 0;

    for (let artikal of this.data) {
      ukupno = ukupno + artikal.nabavnaVrijednost;
    }
    //EDIT pozivanje servisa
    this.pdf.printVanredniOtpisPDF(this.data, ukupno, this.brojOtpisa);

  }

}
