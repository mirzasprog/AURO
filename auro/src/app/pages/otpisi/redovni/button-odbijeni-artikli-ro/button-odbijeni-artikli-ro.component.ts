import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-button-odbijeni-artikli-ro',
  template: `<button nbButton status="danger" (click)="onClick()">Odbijeno</button>`,
  styles: []
})
export class ButtonOdbijeniArtikliRoComponent implements OnInit {

  @Input() rowData: any;
  @Input() value: string | number;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onClick() {
  //  this.router.navigate(['/pages/otpis/odbijeni-artikli-ro', this.rowData.brojOtpisa]);
    const url = this.router.serializeUrl(this.router.createUrlTree(['/pages/otpis/odbijeni-artikli-ro', this.rowData.brojOtpisa]));
    window.open(url, '_blank');
  }

}
