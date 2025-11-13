import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-zahtjevi-detalji-ro',
  template: `<button nbButton status="success" (click)="onClick()"><nb-icon icon="options-2-outline"></nb-icon> Detalji</button>`,
  styles: []

})
export class ZahtjeviDetaljiRoComponent implements OnInit {
  @Input() rowData: any;
  @Input() value: string | number;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onClick() {
    //this.router.navigate(['/pages/pregled/redovni-otpis-detalji', this.rowData.brojOtpisa]);
   
   
   //EDIT putanju
    const url = this.router.serializeUrl(this.router.createUrlTree(['/pages/zahtjevi/detalji-ro', this.rowData.brojOtpisa]));
    window.open(url, '_blank');
  }
}
