import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-izdatnice-artikli',
  template: `<button nbButton status="info" (click)="onClick()"><nb-icon icon="copy-outline"></nb-icon> Artikli</button>`,
  styles: []
})
export class IzdatniceArtikliComponent implements OnInit {
  @Input() rowData: any;
  @Input() value: string | number;
  constructor(private router: Router) { }
 
  ngOnInit(): void {
  }

  onClick() {
    this.router.navigate(['/pages/zahtjevi/izdatnice-artikli', this.rowData.brojIzdatnice]); 
  }
}
