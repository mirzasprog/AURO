import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { KomentarOdbijenihOtpisaComponent } from '../../komentar-odbijenih-otpisa/komentar-odbijenih-otpisa.component';

@Component({
  selector: 'ngx-komentar',
  template: `<button nbButton status="danger" (click)="onClick()"><nb-icon icon="close-circle"></nb-icon> </button> `,
  styles: [
  ]
})
export class KomentarComponent implements OnInit {
  @Input() rowData: any;
  //@Input() value: string;
  brojOtpisa: string;
  komentar: string;
  @Output() uklonjeniRed: EventEmitter<any> = new EventEmitter();


  constructor(private dialogService: NbDialogService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.brojOtpisa = this.activatedRoute.snapshot.paramMap.get('brojOtpisa');
  }

  onClick() {
    //this.uklonjeniRed.emit(this.rowData);

    //this.router.navigate(['/pages/zahtjevi/komentar-otpis']);
    //  this.dialogService.open(KomentarOdbijenihOtpisaComponent, { context: { sifraArtikla: this.rowData.sifra }, });

    this.dialogService.open(KomentarOdbijenihOtpisaComponent, { context: { sifraArtikla: this.rowData.sifra, brojOtpisa:  this.brojOtpisa } }).onClose.subscribe((uneseniKomentar) => {
      this.uklonjeniRed.emit( { red: this.rowData, komentar: uneseniKomentar } );
    });
  }
}
