import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import Swal from 'sweetalert2';
// import { DataService } from '../_services/data.service';
// import { ExportService } from '../_services/export.service';
import * as JsBarcode from 'jsbarcode';

type SpremljeniPazari = {
  uplatnicaID: number;
  idNaloga: string;
  brojProdavnice: string;
  datum: Date;
  iznos: number;
  ukupnoTransakcija: number;
};

@Component({
  selector: 'ngx-pazar-pregled',
  templateUrl: './pazar-pregled.component.html',
  styleUrls: ['./pazar-pregled.component.scss'],
})
export class PazarPregledComponent implements OnInit {

  rows: Array<SpremljeniPazari> = [];
  temp: Array<SpremljeniPazari> = [];

  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

  constructor(
    private router: Router,
    // private dataService: DataService,
    // private exportService: ExportService,
  ) {}

  ngOnInit(): void {
    // DUMMY - zamijeniti sa:
    // this.dataService.getSpremljeniPazari().subscribe(
    //   (r) => { this.rows = r; this.temp = [...r]; },
    //   (err) => Swal.fire('Greška', 'Greška: ' + err, 'error')
    // );
    this.rows = [
      { uplatnicaID: 1,  idNaloga: 'NAL-2024-001', brojProdavnice: 'PRD-101', datum: new Date('2024-03-01'), iznos: 3450.50, ukupnoTransakcija: 48 },
      { uplatnicaID: 2,  idNaloga: 'NAL-2024-002', brojProdavnice: 'PRD-102', datum: new Date('2024-03-02'), iznos: 1780.20, ukupnoTransakcija: 22 },
      { uplatnicaID: 3,  idNaloga: 'NAL-2024-003', brojProdavnice: 'PRD-103', datum: new Date('2024-03-03'), iznos: 5200.00, ukupnoTransakcija: 61 },
      { uplatnicaID: 4,  idNaloga: 'NAL-2024-004', brojProdavnice: 'PRD-101', datum: new Date('2024-03-04'), iznos: 980.75,  ukupnoTransakcija: 15 },
      { uplatnicaID: 5,  idNaloga: 'NAL-2024-005', brojProdavnice: 'PRD-104', datum: new Date('2024-03-05'), iznos: 2340.00, ukupnoTransakcija: 33 },
      { uplatnicaID: 6,  idNaloga: 'NAL-2024-006', brojProdavnice: 'PRD-102', datum: new Date('2024-03-06'), iznos: 6780.30, ukupnoTransakcija: 77 },
      { uplatnicaID: 7,  idNaloga: 'NAL-2024-007', brojProdavnice: 'PRD-105', datum: new Date('2024-03-07'), iznos: 420.50,  ukupnoTransakcija: 8  },
      { uplatnicaID: 8,  idNaloga: 'NAL-2024-008', brojProdavnice: 'PRD-103', datum: new Date('2024-03-08'), iznos: 3100.00, ukupnoTransakcija: 41 },
      { uplatnicaID: 9,  idNaloga: 'NAL-2024-009', brojProdavnice: 'PRD-101', datum: new Date('2024-03-09'), iznos: 1560.80, ukupnoTransakcija: 19 },
      { uplatnicaID: 10, idNaloga: 'NAL-2024-010', brojProdavnice: 'PRD-104', datum: new Date('2024-03-10'), iznos: 4450.25, ukupnoTransakcija: 52 },
      { uplatnicaID: 11, idNaloga: 'NAL-2024-011', brojProdavnice: 'PRD-102', datum: new Date('2024-03-11'), iznos: 890.00,  ukupnoTransakcija: 11 },
      { uplatnicaID: 12, idNaloga: 'NAL-2024-012', brojProdavnice: 'PRD-105', datum: new Date('2024-03-12'), iznos: 7200.60, ukupnoTransakcija: 88 },
    ];
    this.temp = [...this.rows];
  }

  filtriraj(event: any): void {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter(d =>
      d.idNaloga.toLowerCase().indexOf(val) !== -1 || !val
    );
    this.rows = temp;
    this.table.offset = 0;
  }

  dodajPazar(): void {
    this.router.navigate(['pages/pazar/unos']);
  }

  osvjeziStranicu(): void {
    window.location.reload();
  }

  textToBase64Barcode(text: string): string {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, text, { format: 'CODE39' });
    return canvas.toDataURL('image/png');
  }

  ispis(podaci: { uplatnicaID: number; idNaloga: string }): void {
    // this.dataService.getPodaciZaIspis(podaci.uplatnicaID).subscribe(
    //   (r) => {
    //     const dataUrlBarkod = this.textToBase64Barcode(podaci.idNaloga);
    //     const podaciPrint = { ...this.prodavnica, ...r, dataUrlBarkod };
    //     this.exportService.izvozPdf(podaciPrint);
    //   },
    //   (err) => alert('Greska: ' + err)
    // );

    // DUMMY - ukloniti kada se spoji backend:
    Swal.fire({
      icon: 'info',
      title: 'Ispis',
      text: `Ispis naloga ${podaci.idNaloga}`,
      confirmButtonText: 'OK'
    });
  }
}