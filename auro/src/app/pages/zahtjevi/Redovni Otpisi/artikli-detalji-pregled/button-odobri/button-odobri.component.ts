import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { KomentarOdbijenihOtpisaComponent } from '../../komentar-odbijenih-otpisa/komentar-odbijenih-otpisa.component';

@Component({
  selector: 'ngx-button-odobri',
  template: `<button nbButton status="success" (click)="onClick()"><nb-icon icon="checkmark-circle-2"></nb-icon></button> `,
  styles: []
})
export class ButtonOdobriComponent implements OnInit {

  @Input() rowData: any;
  //@Input() value: string;
  brojOtpisa: string;
  //komentar: string;
  @Output() uklonjeniRed: EventEmitter<any> = new EventEmitter();


  constructor(private dialogService: NbDialogService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.brojOtpisa = this.activatedRoute.snapshot.paramMap.get('brojOtpisa');
  }

  onClick() {
    this.uklonjeniRed.emit( { red: this.rowData});

   // this.dialogService.open(KomentarOdbijenihOtpisaComponent, { context: { sifraArtikla: this.rowData.sifra, brojOtpisa:  this.brojOtpisa } }).onClose.subscribe(() => {
   //   this.uklonjeniRed.emit( { red: this.rowData } );
   // });
  }

}
