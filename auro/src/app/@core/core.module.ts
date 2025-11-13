import {
  Injectable,
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  NbAuthJWTToken,
  NbAuthModule,
  NbAuthService,
  NbPasswordAuthStrategy,
} from "@nebular/auth";
import { NbSecurityModule, NbRoleProvider } from "@nebular/security";
import { Role } from "./data/role";

import { throwIfAlreadyLoaded } from "./module-import-guard";
import {
  AnalyticsService,
  LayoutService,
  PlayerService,
  SeoService,
  StateService,
} from "./utils";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";


@Injectable()
export class NbSimpleRoleProvider extends NbRoleProvider {
  constructor(private authService: NbAuthService) {
    super();
  }

  getRole(): Observable<string> {
    // here you could provide any role based on any auth flow
    // return observableOf('prodavnica');

    return this.authService.onTokenChange().pipe(
      map((token: NbAuthJWTToken) => {
        return token.isValid() ? token.getPayload()["role"] : Role.prodavnica;
      })
    );
  }
}

export const NB_CORE_PROVIDERS = [
  // ...MockDataModule.forRoot().providers,
  //...DATA_SERVICES,
  ...NbAuthModule.forRoot({
    strategies: [
     NbPasswordAuthStrategy.setup({
      name: 'prijava',
      token: {
        class: NbAuthJWTToken,
        key: 'token'
      },
      baseEndpoint: '',
      login: {
        method: "post",
        endpoint: environment.loginEndpoint,
        redirect: {
         success: '/pages/pocetna-stranica/radna-ploca',
          failure: null
        }
      },

        errors: {
          getter: (
            module: string | number,
            res: { error: { poruka: string } },
            options: { [x: string]: { defaultErrors: any } }
          ) => {
            return res.error ? res.error.poruka : options[module].defaultErrors;
          },
        },
      }),
    ],
    forms: {
      login: {
        rememberMe: false,

      },
    },
  }).providers,

  NbSecurityModule.forRoot({
    /*
    accessControl: {
      prodavnica: {
        view: [
          //"snizenja",
          "otpis",
          //"kontrolneInventure",
          "izdatniceTroska",
          "neuslovnaRoba",
          "izvjestaji",
          "inventure"
        ],
        create: ["otpis"],
      },
      interna: {
        // parent: 'guest',
        view: [
          "pregled",
         // "zahtjevi",
         // "otpis",
         // "kontrolneInventure", EDIT
         //"izdatniceTroska",
         //"neuslovnaRoba",
        ],
        create: "pregled",
        //edit: '*',
        //remove: '*',
      },
      podrucni: {
        // parent: 'guest',
        view: [
          "zahtjevi",
        //"izvjestaji",
        //"otpis",
        // "kontrolneInventure", EDIT
        //"izdatniceTroska",
        //"neuslovnaRoba",
        ],
        create: "",
        //edit: '*',
        //remove: '*',
      },
      regionalni: {
        // parent: 'guest',
        view: [
          "zahtjevi",
          //"izvjestaji",
          //"otpis",
          //"kontrolneInventure", EDIT
          //"izdatniceTroska",
          //"neuslovnaRoba",
        ],
        create: "",
        //edit: '*',
        //remove: '*',
      },
      trejding: {
        // parent: 'guest',
        view: [
          "zahtjevi",
          //"izvjestaji",
          //"otpis",
          //"kontrolneInventure", EDIT
          "izdatniceTroska",
          //"neuslovnaRoba",
        ],
        create: "",
        //edit: '*',
        //remove: '*',
      },
    },
    */
  }).providers,


  {
    provide: NbRoleProvider,
    useClass: NbSimpleRoleProvider,
  },
  AnalyticsService,
  LayoutService,
  PlayerService,
  SeoService,
  StateService,
];

@NgModule({
  imports: [CommonModule],
  exports: [NbAuthModule],
  declarations: [],
})

export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, "CoreModule");
  }

  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [...NB_CORE_PROVIDERS],
    };
  }
}
