import { Component, Input, OnInit } from '@angular/core';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { DataService } from '../../../@core/utils/data.service';
import { CurrencyPipe } from '@angular/common';
import { ParcijalnaInvZahtjev } from '../../../@core/data/parcijalnaInvZahtjev';
import { ParcijalneInvComponent } from '../parcijalne-inv/parcijalne-inv.component';
import { KomentarOdbijanjaComponent } from '../pregled-inventure/komentar-odbijanja/komentar-odbijanja.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'ngx-pregled-stavki',
  templateUrl: './pregled-stavki.component.html',
  styleUrls: ['./pregled-stavki.component.scss'],
  providers: [CurrencyPipe]
})
export class PregledStavkiComponent implements OnInit {
  @Input() objekat;
  settings = {
    actions: false,
    //Polja u listi izdatnica troškova
    columns: {
      brojIzDESa: {
        title: "Broj iz DES-a",
        type: "string"
      },
      orgJed: {
        title: "Org-jed",
        type: "string",
      },
      ime: {
        title: "Ime",
        type: "string",
      },
      prezime: {
        title: "Prezime",
        type: "string",
      },     
      brojDana: {
        title: "Broj dana",
        type: "string",
      },      
      brojSati: {
        title: "Broj sati",
        type: "string",
      },       
      rolaNaInventuri: {
        title: "Rola na inventuri",
        type: "string",
      },      
      iznosZaIsplatu: {
        title: "Iznos za isplatu",
        type: "string",
        valuePrepareFunction: (cell, row) => {
          return this.currencyPipe.transform(cell, 'BAM', 'symbol', '1.2-2');
        },
      },
    },
  };
  data = [];
  rola: string;
  podaci: ParcijalnaInvZahtjev;
  source: LocalDataSource = new LocalDataSource();
  napomena: string;
  brojDokumenta: string;
  
  constructor(protected dialogRef: NbDialogRef<PregledStavkiComponent>,
    public authService: NbAuthService,
    private dataService: DataService,
    private dialogService: NbDialogService,
    private currencyPipe: CurrencyPipe) { }

  ngOnInit(): void {
    this.dataService.getParcijalneInvPodrucni(this.objekat.datum, this.objekat.brojProd, this.objekat.brojDokumenta).subscribe(
      (r) => {
        this.data = r;
        this.source.load(this.data);
    });  
    this.authService.getToken().subscribe((token: NbAuthJWTToken) => {
      this.rola = token.getPayload()["role"];
    });
    this.podaci = {} as ParcijalnaInvZahtjev;
  }

  spremi(odobri: number){
    if(odobri == 1) {
      this.podaci.brojProdavnice = this.objekat.brojProd;
      this.podaci.datum = this.objekat.datum;
      this.podaci.status = 'Odobreno';
      this.podaci.napoemna = 'Odobreno';
      this.dialogRef.close('Odobreno');
    } 
    else if (odobri == 2) {
      this.dialogService.open(KomentarOdbijanjaComponent, {
        closeOnBackdropClick: false, hasScroll: true,
        context: { }
      }).onClose.subscribe(
        (r) => {
          if (r) {
            this.podaci.napoemna = r;
            this.dialogRef.close( this.podaci.napoemna); 
          }
          else {
            return;
          }
        });

    }
  }

}
