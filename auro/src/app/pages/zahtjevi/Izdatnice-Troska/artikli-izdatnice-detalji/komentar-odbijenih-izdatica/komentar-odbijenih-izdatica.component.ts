import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-komentar-odbijenih-izdatica',
  template: `<button nbButton status="danger" (click)="onClick()"><nb-icon icon="close-circle"></nb-icon> odbij</button>`,
  styles: [
  ]
})
export class KomentarOdbijenihIzdaticaComponent implements OnInit {
  @Input() rowData: any;
  @Input() value: string | number;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  onClick() {
    this.router.navigate(['/pages/zahtjevi/komentar-izdatnice']); 
  }
}
