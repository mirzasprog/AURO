import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import * as FileSaver from 'file-saver';
import { AkcijaStavka } from '../../../@core/data/akcija-stavka';
import { DataService } from '../../../@core/utils/data.service';

interface StavkaPregled {
  akcijaId: number;
  sifra: string;
  naziv: string;
}

@Component({
  selector: 'ngx-akcije-stavke-pregled',
  templateUrl: './akcije-stavke-pregled.component.html',
  styleUrls: ['./akcije-stavke-pregled.component.scss']
})
export class AkcijeStavkePregledComponent implements OnInit {
  @Input() odabraniRed: any;

  data: StavkaPregled[] = [];
  ucitavanje = false;
  greska?: string;

  constructor(private dialogRef: NbDialogRef<AkcijeStavkePregledComponent>, private dataService: DataService) { }

  ngOnInit(): void {
    this.ucitajStavke();
  }

  zatvoriModal(): void {
    this.dialogRef.close();
  }

  preuzmiExcel(): void {
    const akcijaId = this.odabraniRed?.id ?? this.odabraniRed?.Id;
    if (!akcijaId) {
      this.greska = 'Nije pronađen ID akcije za eksport.';
      return;
    }

    this.dataService.preuzmiExcelStavkeAkcije(akcijaId).subscribe({
      next: (blob) => FileSaver.saveAs(blob, `akcija_${akcijaId}_stavke.csv`),
      error: (err) => {
        this.greska = err?.error?.poruka ?? 'Greška pri preuzimanju Excel izvještaja.';
      }
    });
  }

  private ucitajStavke(): void {
    const akcijaId = this.odabraniRed?.id ?? this.odabraniRed?.Id;
    if (!akcijaId) {
      this.greska = 'Nije odabrana akcija za prikaz.';
      return;
    }

    this.ucitavanje = true;
    this.greska = undefined;
    this.dataService.preuzmiStavkeAkcije(akcijaId).subscribe({
      next: (stavke) => {
        this.data = stavke.map((s: AkcijaStavka) => ({
          akcijaId,
          sifra: s.sifra ?? s.Sifra ?? '',
          naziv: s.naziv ?? s.Naziv ?? ''
        }));
      },
      error: (err) => {
        this.greska = err?.error?.poruka ?? 'Greška pri preuzimanju stavki akcije.';
      }
    }).add(() => this.ucitavanje = false);
  }
}
