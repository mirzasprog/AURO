import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
    <b>Copyright © {{this.currentYear}} Aplikativna podrška Konzum Bosna i Hercegovina </b>
    </span>
    <div style="margin-left:5px;">
    <label style="float:right;" id="text" class="label col-sm7 col-form-label"> Konzum360</label>
    <br>
    <label style="float:right;" id="text"  class="label col-sm7 col-form-label"> Verzija :  {{trenutnaVerzija}}</label>
    </div>  
  `,
})
export class FooterComponent implements OnInit {
  trenutnaVerzija: string;
  currentYear: number = new Date().getFullYear();
  ngOnInit(): void {
    this.trenutnaVerzija = environment.verzija;
  }

}
