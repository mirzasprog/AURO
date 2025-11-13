import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { KomentarOdbijenihOtpisaComponent } from '../../../Redovni Otpisi/komentar-odbijenih-otpisa/komentar-odbijenih-otpisa.component';

@Component({
  selector: 'ngx-button-odobri-vo',
  template: `<button nbButton status="success" (click)="onClick()"><nb-icon icon="checkmark-circle-2"></nb-icon></button> `,
  styles: []
})
export class ButtonOdobriVoComponent implements OnInit {
  @Input() rowData: any;
  //@Input() value: string;
  brojOtpisa: string;
 // komentar: string;
  @Output() uklonjeniRed: EventEmitter<any> = new EventEmitter();

  constructor(private dialogService: NbDialogService, private activatedRoute: ActivatedRoute) { }
//EDIT Izbacivanje artikala sa liste u listu odobrenih artikala

  ngOnInit(): void {
    this.brojOtpisa = this.activatedRoute.snapshot.paramMap.get('brojOtpisa');
  }

  onClick() {
    this.uklonjeniRed.emit( { red: this.rowData});
    // this.router.navigate(['/pages/zahtjevi/vanredni-komentar-otpis']);

    /*
    this.dialogService.open(KomentarOdbijenihOtpisaComponent, { context: { sifraArtikla: this.rowData.sifra, brojOtpisa:  this.brojOtpisa } }).onClose.subscribe((uneseniKomentar) => {
      this.uklonjeniRed.emit( { red: this.rowData, komentar: uneseniKomentar } );
    });
    */

  }

}
