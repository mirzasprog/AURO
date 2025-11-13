import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-button-odobreni-artikli-ro',
  template: `<button nbButton status="success" (click)="onClick()">Odobreno</button>`,
  styles: []
})
export class ButtonOdobreniArtikliRoComponent implements OnInit {

  @Input() rowData: any;
  @Input() value: string | number;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onClick() {
   // this.router.navigate(['/pages/otpis/odobreni-artikli-ro', this.rowData.brojOtpisa]);
   const url = this.router.serializeUrl(this.router.createUrlTree(['/pages/otpis/odobreni-artikli-ro', this.rowData.brojOtpisa]));
   window.open(url, '_blank');
  }

}
