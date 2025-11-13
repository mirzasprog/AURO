import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSearchService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NbAuthJWTToken, NbAuthService, NbTokenService } from '@nebular/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: { name: string };
  //Rola prijavljenog korisnika na aplikaciju
  rola: string;
  currentTheme = 'default';
  private readonly themeStorageKey = 'auro-theme-preference';
  themePreference: 'light' | 'dark' = 'light';
  value = '';
  userMenu = [ { title: 'Odjava', icon: 'log-out' } ];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private authService: NbAuthService,
              private router: Router,
              private tokenService: NbTokenService,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
              private searchService: NbSearchService) {

                this.searchService.onSearchSubmit()
                .subscribe((data: any) => {
                  this.value = data.term;
                })
                this.authService.getToken().subscribe((token: NbAuthJWTToken) => {
                  this.rola = token.getPayload()["role"];
                });
                this.authService.onTokenChange()
                .subscribe((token: NbAuthJWTToken) => {
                  if (token.isValid()) {
                    this.user = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable
                  }
                  else {
                    this.router.navigate(['/auth/login']);
                  }
                });

              this.menuService.onItemClick().subscribe(
                (result) => {
                  if (result.item.title == 'Odjava') {
                   this.tokenService.clear();
                   this.router.navigate(['/auth/login']);
                  }
                }
              );
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;
    const savedTheme = this.getStoredTheme() ?? 'light';
    this.applyTheme(savedTheme);
    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => {
        this.currentTheme = themeName;
        this.themePreference = themeName === 'dark' ? 'dark' : 'light';
        this.setDocumentTheme(this.themePreference);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar(): boolean {
    //this.sidebarService.toggle(true, 'menu-sidebar');
    //this.layoutService.changeLayoutSize();
     this.sidebarService.toggle(false, 'menu-sidebar');
     this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  toggleTheme(): void {
    const nextTheme = this.themePreference === 'dark' ? 'light' : 'dark';
    this.applyTheme(nextTheme);
  }

  get themeIcon(): string {
    return this.themePreference === 'dark' ? 'moon-outline' : 'sun-outline';
  }

  get themeLabel(): string {
    return this.themePreference === 'dark' ? 'Tamni mod' : 'Svijetli mod';
  }

  private applyTheme(preference: 'light' | 'dark'): void {
    this.themePreference = preference;
    const nbTheme = preference === 'dark' ? 'dark' : 'default';
    this.themeService.changeTheme(nbTheme);
    this.currentTheme = nbTheme;
    this.setDocumentTheme(preference);
    this.persistTheme(preference);
  }

  private setDocumentTheme(preference: 'light' | 'dark'): void {
    if (typeof document !== 'undefined' && document.body) {
      document.body.dataset.theme = preference;
    }
  }

  private getStoredTheme(): 'light' | 'dark' | null {
    try {
      const stored = localStorage.getItem(this.themeStorageKey) as 'light' | 'dark' | null;
      return stored === 'dark' ? 'dark' : stored === 'light' ? 'light' : null;
    } catch {
      return null;
    }
  }

  private persistTheme(preference: 'light' | 'dark'): void {
    try {
      localStorage.setItem(this.themeStorageKey, preference);
    } catch {
      // Ignored: storage may be unavailable (private mode, SSR, etc.)
    }
  }
}
