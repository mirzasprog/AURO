import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewCell } from 'ng2-smart-table';

@Component({
  template: `<button nbButton status="info" (click)="onClick()">Artikli</button>`,
  styles: []
})
export class TabelaDugmeVanredniComponent implements ViewCell, OnInit {
  @Input() rowData: any;
  @Input() value: string | number;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onClick() {
   // this.router.navigate(['/pages/otpis/artikli-vanredni', this.rowData.brojOtpisa]);
   const url = this.router.serializeUrl(this.router.createUrlTree(['/pages/otpis/artikli-vanredni', this.rowData.brojOtpisa]));
   window.open(url, '_blank');
  }

}
