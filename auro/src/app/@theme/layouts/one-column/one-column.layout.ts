import { Component } from '@angular/core';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  template: `
    <nb-layout windowMode>
    <nb-layout-header fixed>
    <ngx-header></ngx-header>
    </nb-layout-header>
      <nb-sidebar>
       <div class="logo">
          <nb-user 
             style="margin-bottom:15px;"
             shape="semi-round"
             name="KONZUM d.o.o"
             title="Bosna i Hercegovina"
             picture="../../../../assets/images/KONZUM.png">
           </nb-user>
       </div>
       
      <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>
      <nb-layout-column>
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      <nb-layout-footer fixed>
        <ngx-footer></ngx-footer>
      </nb-layout-footer>
    </nb-layout>
  `,
})
export class OneColumnLayoutComponent {}
