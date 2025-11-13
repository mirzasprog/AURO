import { Injectable, NgModule } from '@angular/core';
import { NbAlertModule, NbButtonModule, NbDialogModule, NbFormFieldModule, NbIconModule, NbInputModule, NbMenuModule, NbProgressBarModule, NbTimepickerModule, NbTooltipModule } from '@nebular/theme';
import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { NgxLoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import 'animate.css';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { HttpClientModule } from '@angular/common/http';


@NgModule({

  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    MiscellaneousModule,
    FormsModule,
    NbInputModule,
    NbButtonModule,
    NbAlertModule,
    NbTooltipModule,
    NbDialogModule,
    NbTimepickerModule.forChild(),
    NbProgressBarModule,
    HttpClientModule,
    NbIconModule,
    NbFormFieldModule,
    NgHttpLoaderModule.forRoot()
  ],
  declarations: [
    PagesComponent,
    NgxLoginComponent,
    
  ],
  providers: [],
})
@Injectable({providedIn: 'root'})
export class PagesModule {
}
