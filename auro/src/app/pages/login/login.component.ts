import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbAuthResult, NbAuthService, NbLoginComponent, NbTokenService, NB_AUTH_OPTIONS } from '@nebular/auth';
import { environment } from '../../../environments/environment';
import { NbIconLibraries } from '@nebular/theme';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class NgxLoginComponent extends NbLoginComponent implements OnInit {
  user: { korisnickoIme: string, lozinka: string };
  trenutnaVerzija: string;

  constructor(service: NbAuthService, public tokenService: NbTokenService,
    @Inject(NB_AUTH_OPTIONS) options:{},
     cd: ChangeDetectorRef, router: Router, private iconService: NbIconLibraries) {
    super(service, options, cd, router);
    this.iconService.registerFontPack('font-awesome', { packClass: 'fa' });
  }

  ngOnInit(): void {
    this.tokenService.clear();
    //super.login();
    this.trenutnaVerzija = environment.verzija;
  }

  prijava(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    this.service.authenticate('prijava', this.user).subscribe(
      (result: NbAuthResult) => {
        this.submitted = false;

        if (result.isSuccess())
          this.messages = result.getMessages();
        else this.errors = result.getErrors();

        const redirect = result.getRedirect();

        if (redirect)
          return this.router.navigateByUrl(redirect);
      }
    );
  }

}
