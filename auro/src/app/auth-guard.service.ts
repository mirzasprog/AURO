import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbAccessChecker } from '@nebular/security';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: NbAuthService, private router: Router, public accessChecker: NbAccessChecker) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    //this.trenutnaRola$ =
    return this.authService.getToken().pipe(
      map((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          let rola = token.getPayload()["role"];
          // provjerava da li je rola u listi dozvoljenih koji mogu vidjeti link
          // lista dozvoljenih rola se definise u routing fajlu
          if (route.data.roles && route.data.roles.indexOf(rola) === -1) {
            this.router.navigate(['/pages/pocetna-stranica/radna-ploca']);
            return false;
          }
          return true;
        }
        // this.router.navigate(['/login']);
        return false;
      })
    );
  }
}
