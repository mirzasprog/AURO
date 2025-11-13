/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { Spinkit } from 'ng-http-loader';

@Component({
  selector: 'ngx-app',
  template: `<router-outlet></router-outlet>
  <ng-http-loader
  [backdrop]="true"
  [backgroundColor]="'#ff0000'"
  [debounceDelay]="100"
  [extraDuration]="300"
  [minDuration]="300"
  [opacity]=".6"
  [backdropBackgroundColor]="'#777777'"
  [spinner]="spinkit.skCubeGrid">
  </ng-http-loader>`,
})
export class AppComponent implements OnInit {
  trenutnaVerzija: string;
  public spinkit = Spinkit; 
  // private analytics: AnalyticsService, private seoService: SeoService
  constructor() {
  }

  ngOnInit(): void {
    // this.analytics.trackPageViews();
    //this.seoService.trackCanonicalChanges();
  }
}
