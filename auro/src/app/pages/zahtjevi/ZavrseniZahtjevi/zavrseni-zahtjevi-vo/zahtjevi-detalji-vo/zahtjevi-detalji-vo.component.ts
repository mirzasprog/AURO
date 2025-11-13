import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-zahtjevi-detalji-vo',
  template: `<button nbButton status="success" (click)="onClick()"><nb-icon icon="options-2-outline"></nb-icon> Detalji</button>`,
  styles: []
})
export class ZahtjeviDetaljiVoComponent implements OnInit {
  @Input() rowData: any;
  @Input() value: string | number;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onClick() {
    //this.router.navigate(['/pages/pregled/redovni-otpis-detalji', this.rowData.brojOtpisa]);
    const url = this.router.serializeUrl(this.router.createUrlTree(['/pages/zahtjevi/detalji-vo', this.rowData.brojOtpisa]));
    window.open(url, '_blank');
  }

}
