import { Component, OnInit } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';

@Component({
  selector: 'ngx-tabela-datepicker',
  template: `<input [nbDatepicker]="datumIsteka" name="uneseniDatum" id="uneseniDatum" [(ngModel)]="uneseniDatum" [disabled]="iskljucenDatum" readonly nbInput>
             <nb-datepicker #datumIsteka (dateChange)="onChange($event)"></nb-datepicker>`,
  styles: []
})
export class TabelaDatepickerComponent extends DefaultEditor implements OnInit {
  uneseniDatum: Date;
  iskljucenDatum = false;

  constructor() { super(); }

  ngOnInit(): void {

    if (this.cell.getRow().getData().provedenoSnizenje == "NE") {
      this.iskljucenDatum = true;
    }

    if (this.cell.newValue) {
      let cellValue = new Date(this.cell.newValue);
      this.uneseniDatum = cellValue;
      this.cell.newValue = this.uneseniDatum.toISOString();
    }
/*
    if(!this.inputModel) {
      this.cell.newValue = this.inputModel.toLocaleDateString();
    }
*/
  }
 
  onChange(value) {
    //if(this.inputModel) {
     // this.cell.newValue = this.inputModel.toISOString();
     this.cell.newValue = value.toISOString();
     //value.toLocaleDateString();
   // }
  }

}
