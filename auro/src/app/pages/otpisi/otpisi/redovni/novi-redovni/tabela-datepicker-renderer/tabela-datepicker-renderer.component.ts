import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'ngx-tabela-datepicker-renderer',
  template: `{{value | date:'shortDate'}}`,
  styles: []
})
export class TabelaDatepickerRendererComponent implements ViewCell, OnInit {
  @Input() rowData: any;
  @Input() value: string | number;

  constructor() { }

  ngOnInit(): void {
  }

}
