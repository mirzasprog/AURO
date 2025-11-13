import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbIconLibraries } from '@nebular/theme';
import { ArtikliDetaljiPregledComponent } from '../../artikli-detalji-pregled/artikli-detalji-pregled.component';
@Component({
  selector: 'ngx-artikli-detalji',
  template: `<button nbButton status="info" (click)="onClick()" size="small"><nb-icon icon="shopping-cart"></nb-icon> Artikli</button>`,
  styles: []

})
export class ArtikliDetaljiComponent implements OnInit {
  @Input() rowData: any;
  @Input() value: string | number;

  constructor(private router: Router,
    private dialogService: NbDialogService
  ) { }

 
  ngOnInit(): void {
  }

  onClick() {
    this.router.navigate(['/pages/zahtjevi/artikli', this.rowData.brojOtpisa]); 
  }

}
