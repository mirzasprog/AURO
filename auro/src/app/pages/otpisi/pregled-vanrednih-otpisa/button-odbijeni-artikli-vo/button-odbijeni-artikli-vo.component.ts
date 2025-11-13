import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-button-odbijeni-artikli-vo',
  template: `<button nbButton status="danger" (click)="onClick()">Odbijeno</button>`,
  styles: []
})
export class ButtonOdbijeniArtikliVoComponent implements OnInit {

  @Input() rowData: any;
  @Input() value: string | number;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onClick() {
   // var url = ('/pages/otpis/odbijeni-artikli-vo', this.rowData.brojOtpisa);
    //var win = window.open(url, '_blank');
    //win.opener = null;
    //win.focus();
   //this.router.navigate(['/pages/otpis/odbijeni-artikli-vo', this.rowData.brojOtpisa], "_blank"  );
   //window.open('/pages/otpis/odbijeni-artikli-vo' + this.rowData.brojOtpisa, "_blank");
   const url = this.router.serializeUrl(this.router.createUrlTree(['/pages/otpis/odbijeni-artikli-vo', this.rowData.brojOtpisa]));
    window.open(url, '_blank');
  }

}
