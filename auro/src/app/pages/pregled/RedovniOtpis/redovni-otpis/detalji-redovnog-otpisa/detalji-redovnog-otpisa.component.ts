import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-detalji-redovnog-otpisa',
  template: `<button nbButton status="success" (click)="onClick()"><nb-icon icon="options-2-outline"></nb-icon> Detalji</button>`,
  styles: []
})
export class DetaljiRedovnogOtpisaComponent implements OnInit {
  @Input() rowData: any;
  @Input() value: string | number;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onClick() {
    //this.router.navigate(['/pages/pregled/redovni-otpis-detalji', this.rowData.brojOtpisa]); --version 0.1
    const url = this.router.serializeUrl(this.router.createUrlTree(['/pages/pregled/redovni-otpis-detalji', this.rowData.brojOtpisa]));
    window.open(url, '_blank');
  }
}
