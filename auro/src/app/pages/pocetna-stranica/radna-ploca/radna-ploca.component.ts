import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import Swal from 'sweetalert2';
import { DataService } from '../../../@core/utils/data.service';
import { NbDialogService, NbIconLibraries } from '@nebular/theme';
import Chart from 'chart.js';
import { catchError, debounceTime, distinctUntilChanged, finalize, switchMap, takeUntil } from 'rxjs/operators';
import { forkJoin, of, Subject, Subscription } from 'rxjs';
import { DashboardTrendPoint } from '../../../@core/data/dashboard/dashboard-summary';
import { PrometHistoryRow } from '../../../@core/data/promet-history';
import { DailyTaskService } from '../../../@core/utils/daily-task.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PreuzmiUExcelService } from '../../../@core/utils/preuzmiExcel.service';
import { LocalDataSource } from 'ng2-smart-table';

interface QuickAction {
  title: string;
  description: string;
  icon: string;
  cta: string;
  accent: 'primary' | 'success' | 'warning';
  action: string;
}
interface DashboardChartDescriptor {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface AggregatedPrometMetrics {
  promet: number;
  prometProslaGodina: number;
  brojKupaca: number;
  brojKupacaProslaGodina: number;
  netoKvadratura: number;
  brojZaposlenih: number;
  prometPoNetoKvadraturi: number;
  prometProslaGodinaPoNetoKvadraturi: number;
}

interface CategoryShareItem {
  category: string;
  share: number;
  promet: number;
}
type KpiCard = {
  key: string;
  label: string;
  formattedValue: string;
  unit?: string;
  value?: number;
  previousValue?: number;
  delta?: number;
  trend?: DashboardTrendPoint[];
  icon?: string; 
};

@Component({
  selector: 'ngx-radna-ploca',
  templateUrl: './radna-ploca.component.html',
  styleUrls: ['./radna-ploca.component.scss']
})

export class RadnaPlocaComponent implements OnInit, OnDestroy {
  @ViewChild('visitorsDetail', { static: false }) visitorsDetail?: TemplateRef<any>;
  @ViewChild('turnoverDetail', { static: false }) turnoverDetail?: TemplateRef<any>;
  @ViewChild('shrinkageDetail', { static: false }) shrinkageDetail?: TemplateRef<any>;
  @ViewChild('basketDetail', { static: false }) basketDetail?: TemplateRef<any>;
  @ViewChild('categoryDetail', { static: false }) categoryDetail?: TemplateRef<any>;
  private readonly PAGE_SIZE = 15;
  dashboardSummary?: any;
  isDashboardLoading = false;
  isStoreChartsLoading = false;
  private charts: { [key: string]: Chart } = {};
  korisnickoIme: any;
  data: any[] = [];
  redovni = 0;
  vanredni = 0;
  izdatnice = 0;
  neuslovnaRoba = 0;
  rola: string = '';
  prometTableRows: any[] = [];
  stores: any[] = [];
  positiveFilterActive = false;
  negativeFilterActive = false;
  selectedStoreId: number | string | null = null;
  showColumnSettings = false;
  allSelected: boolean = false;
  columnRows: string[][] = [];
  columnKeys: string[] = [];
  columnStates: any = {};
  prometHistoryRows: PrometHistoryRow[] = [];
  prometHistoryPage = 1;
  prometHistoryPageSize = 7;
  isPrometHistoryLoading = false;
  categoryOptions: CategoryShareItem[] = [];
  selectedCategories: string[] = [];
  categoryShareValue = 0;
  settings: any = {
    actions: false,
    pager: { display: true, perPage: 20 },
    attr: { class: 'smart-table compact-table' },
    columns: {
      brojProdavnice: { title: 'Broj prodavnice', filter: true, hide: false },
      adresa: { title: 'Adresa', filter: true, hide: false },
      regija: { title: 'Regija', filter: true, hide: false },
      format: { title: 'Format', filter: true, hide: false },
      promet: { title: 'Promet', type: 'number', hide: false, valuePrepareFunction: v => this.currencyFormat(v) },
      prometProslaGodina: { title: 'Promet PG', type: 'number', hide: false, valuePrepareFunction: v => this.currencyFormat(v) },
      razlikaPromet: { title: 'Razlika prometa KM', type: 'number', hide: false, valuePrepareFunction: v => this.currencyFormat(v) },
      postotakPromet: { title: 'Razlika prometa %', type: 'html', hide: false, valuePrepareFunction: v => this.percentFormat(v)},
      brojKupaca: { title: 'Kupci', type: 'number', hide: false },
      brojKupacaProslaGodina: { title: 'Kupci PG', type: 'number', hide: false },
      prosjecnaKorpa: { title: 'Prosječna korpa', type: 'number', hide: false, valuePrepareFunction: v => this.currencyFormat(v) },
      prosjecnaKorpaProslaGodina: { title: 'Prosj. korpa PG', type: 'number', hide: false, valuePrepareFunction: v => this.currencyFormat(v) },
      razlikaKorpa: { title: 'Razlika korpe KM', type: 'number', hide: false, valuePrepareFunction: v => this.currencyFormat(v) },
      postotakKorpa: { title: 'Razlika korpe %', type: 'html', hide: false, valuePrepareFunction: v => this.percentFormat(v)}
    },

    rowClassFunction: row => {
      const diff = row.data.razlikaPromet;
      if (diff > 0) return 'row-green';
      if (diff < 0) return 'row-red';
      return 'row-yellow';
    }
  };
  dataTable: any[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  source: LocalDataSource = new LocalDataSource();
  storeSearch = '';
  filteredStores = [];
  rolesWithStoreSelection: string[] = ['uprava', 'podrucni', 'regionalni'];
  private destroy$ = new Subject<void>();
  private storeSelection$ = new Subject<string>();
  private storeSelectionSubscription?: Subscription;

  constructor(
    private router: Router,
    public authService: NbAuthService,
    private dataService: DataService,
    private iconService: NbIconLibraries,
    private dialogService: NbDialogService,
    private readonly dailyTaskService: DailyTaskService,
    private excel: PreuzmiUExcelService
  ) {
    this.iconService.registerFontPack('font-awesome', { packClass: 'fa' });
  }


  ngOnInit(): void {
    this.setupStoreSelectionBalancer();
    this.initializeCategoryShareData();

    this.authService.getToken().subscribe((token: NbAuthJWTToken) => {
      this.rola = token.getPayload()['role'] ?? this.rola;
      this.korisnickoIme = token.getPayload()['name'] ?? this.korisnickoIme;
      this.filteredStores = this.stores;
      if (this.rola === 'prodavnica') {
        const storeId = String(parseInt(this.korisnickoIme, 10)).padStart(3, '0');
        this.selectedStoreId = storeId;
        this.storeSelection$.next(storeId);
        return;
      }
      else if (this.rola === 'uprava') {
        this.columnKeys = Object.keys(this.settings.columns);
        this.columnKeys.forEach(col => {
          this.columnStates[col] = !this.settings.columns[col].hide;
        });
        const mid = Math.ceil(this.columnKeys.length / 2);
        this.columnRows = [
          this.columnKeys.slice(0, mid),
          this.columnKeys.slice(mid)
        ];
        this.loadStores();
        this.loadGodisnjiPromet();
        this.loadSviPrometi();
        this.loadStoreCharts();
        this.source.load(this.dataTable);
      }
    });
  }

  toggleColumn(colKey: string, visible: boolean) {
    if (this.settings.columns[colKey]) {
      this.settings.columns[colKey].hide = !visible;
      this.settings = { ...this.settings };
    }
  }

  toggleAllColumns(checked: boolean) {
    this.allSelected = checked;
    this.columnKeys.forEach(col => {
      this.settings.columns[col].hide = !checked;
    });
    this.settings = { ...this.settings };
  }

  onPositiveToggleChange(state: boolean) {
    this.positiveFilterActive = state;
    if (state) {
      this.negativeFilterActive = false;
    }
    this.applyFilters();
  }

  onNegativeToggleChange(state: boolean) {
    this.negativeFilterActive = state;
    if (state) {
      this.positiveFilterActive = false;
    }
    this.applyFilters();
  }

  resetFilter() {
    this.positiveFilterActive = false;
    this.negativeFilterActive = false;
    this.source.load(this.dataTable);
    this.toggleAllColumns(true);
  }

  applyFilters() {
    if (this.positiveFilterActive) {
      this.source.load(this.dataTable.filter(r => r.razlikaPromet > 0));
    } else if (this.negativeFilterActive) {
      this.source.load(this.dataTable.filter(r => r.razlikaPromet < 0));
    } else {
      this.source.load(this.dataTable);
    }
  }

  currencyFormat = (value: any) => {
    if (value == null) return '0,00 KM';
    return Number(value).toLocaleString('bs-BA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' KM';
  };

  percentFormat = (value: any) => {
    if (value == null) return '0%';
    const color = value > 0 ? 'green' : value < 0 ? 'red' : 'orange';
    return `<span style="color:${color}; font-weight:600">${value.toFixed(1)}%</span>`;
  };

  getPrometRowClass(row: PrometHistoryRow): string {
    if (!row) return '';
    if (row.difference > 0) return 'delta-positive';
    if (row.difference < 0) return 'delta-negative';
    return 'delta-neutral';
  }

  get totalPrometHistoryPages(): number {
    if (!this.prometHistoryRows?.length) return 1;
    return Math.ceil(this.prometHistoryRows.length / this.prometHistoryPageSize);
  }

  get paginatedPrometHistoryRows(): PrometHistoryRow[] {
    const start = (this.prometHistoryPage - 1) * this.prometHistoryPageSize;
    return this.prometHistoryRows.slice(start, start + this.prometHistoryPageSize);
  }

  private setupStoreSelectionBalancer(): void {
    this.storeSelectionSubscription = this.storeSelection$
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        switchMap(storeCode => {
          this.isDashboardLoading = true;
          this.isStoreChartsLoading = true;

          return forkJoin({
            promet: this.dataService.getPromet(storeCode),
            stats: this.getStoreChartsObservable(storeCode),
          }).pipe(
            finalize(() => {
              this.isDashboardLoading = false;
              this.isStoreChartsLoading = false;
            }),
            catchError(err => {
              const greska = err?.error?.poruka ?? err?.statusText ?? err?.message;
              Swal.fire('Greška', 'Greška prilikom učitavanja prodavnice: ' + greska, 'error');
              return of({ promet: null, stats: [] });
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: ({ promet, stats }) => {
          if (promet) {
            this.applyPrometResponse(promet);
            this.loadPrometDetalji();
          }

          this.applyStoreChartsData(stats);
        }
      });
  }

  private loadSviPrometi(): void {
    this.isDashboardLoading = true;

    this.dataService.getSviPrometi()
      .pipe(finalize(() => (this.isDashboardLoading = false)))
      .subscribe({
        next: (response: any[]) => {
          if (!response || !Array.isArray(response)) {
            this.dataTable = this.getEmptyRows(this.PAGE_SIZE);
            return;
          }
          const aggregatedMetrics = response.length ? this.calculateAggregatedMetrics(response) : null;
          // mapiramo backend rezultate u tabelu
          let mappedData = response.map(item => {
            const razlikaPromet = item.promet - item.prometProslaGodina;
            const postotakPromet = item.prometProslaGodina
              ? ((item.promet - item.prometProslaGodina) / item.prometProslaGodina) * 100
              : 0;

            const prosjecnaKorpa =
              item.brojKupaca ? item.promet / item.brojKupaca : 0;

            const prosjecnaKorpaProsla =
              item.brojKupacaProslaGodina
                ? item.prometProslaGodina / item.brojKupacaProslaGodina
                : 0;

            const razlikaKorpa = prosjecnaKorpa - prosjecnaKorpaProsla;
            const postotakKorpa = prosjecnaKorpaProsla
              ? ((prosjecnaKorpa - prosjecnaKorpaProsla) / prosjecnaKorpaProsla) * 100
              : 0;

            return {
              ...item,
              razlikaPromet,
              postotakPromet,
              prosjecnaKorpa,
              prosjecnaKorpaProslaGodina: prosjecnaKorpaProsla,
              razlikaKorpa,
              postotakKorpa
            };
          });

          // dodajemo prazne redove da uvijek bude PAGE_SIZE
          if (mappedData.length < this.PAGE_SIZE) {
            mappedData = [...mappedData, ...this.getEmptyRows(this.PAGE_SIZE - mappedData.length)];
          }

          this.dataTable = mappedData;
          this.source.load(this.dataTable);

          if (!this.selectedStoreId && aggregatedMetrics) {
            this.applyAggregatedMetrics(aggregatedMetrics);
          }
        },
        error: () => {
          this.dataTable = this.getEmptyRows(this.PAGE_SIZE);
        }
      });
  }

  private calculateAggregatedMetrics(stores: any[]): AggregatedPrometMetrics {
    const initial: AggregatedPrometMetrics = {
      promet: 0,
      prometProslaGodina: 0,
      brojKupaca: 0,
      brojKupacaProslaGodina: 0,
      netoKvadratura: 0,
      brojZaposlenih: 0,
      prometPoNetoKvadraturi: 0,
      prometProslaGodinaPoNetoKvadraturi: 0,
    };

    const totals = stores.reduce((acc: AggregatedPrometMetrics, item: any) => {
      const promet = Number(item.promet ?? 0);
      const prometProsla = Number(item.prometProslaGodina ?? 0);
      const kupaca = Number(item.brojKupaca ?? 0);
      const kupacaProsla = Number(item.brojKupacaProslaGodina ?? 0);
      const neto = Number(item.netoKvadraturaObjekta ?? 0);
      const zaposlenih = Number((item as any).brojZaposlenih ?? item['brojZaposlenih'] ?? 0);

      acc.promet += promet;
      acc.prometProslaGodina += prometProsla;
      acc.brojKupaca += kupaca;
      acc.brojKupacaProslaGodina += kupacaProsla;
      acc.netoKvadratura += neto;
      acc.brojZaposlenih += zaposlenih;

      return acc;
    }, initial);

    totals.prometPoNetoKvadraturi = totals.netoKvadratura
      ? Number((totals.promet / totals.netoKvadratura).toFixed(2))
      : 0;

    totals.prometProslaGodinaPoNetoKvadraturi = totals.netoKvadratura
      ? Number((totals.prometProslaGodina / totals.netoKvadratura).toFixed(2))
      : 0;

    return totals;
  }

  private applyAggregatedMetrics(metrics: AggregatedPrometMetrics): void {
    if (!this.dashboardSummary) {
      this.dashboardSummary = {};
    }

    const currency = this.dashboardSummary.currency ?? 'KM';
    const promet = Number(metrics.promet.toFixed(2));
    const prometProslaGodina = Number(metrics.prometProslaGodina.toFixed(2));
    const brojKupaca = metrics.brojKupaca;
    const brojKupacaProslaGodina = metrics.brojKupacaProslaGodina;
    const brojZaposlenih = metrics.brojZaposlenih;
    const prometPoUposleniku = brojZaposlenih
      ? Number((promet / brojZaposlenih).toFixed(2))
      : 0;
    const averageBasketValue = brojKupaca ? Number((promet / brojKupaca).toFixed(2)) : 0;
    const averageBasketPrevious = brojKupacaProslaGodina
      ? Number((prometProslaGodina / brojKupacaProslaGodina).toFixed(2))
      : 0;

    this.dashboardSummary = {
      ...this.dashboardSummary,
      promet,
      prometProslaGodina,
      brojKupaca,
      brojKupacaProslaGodina,
      currency,
      turnover: { value: promet, previousValue: prometProslaGodina },
      visitors: { value: brojKupaca, previousValue: brojKupacaProslaGodina },
      netoKvadraturaObjekta: Number(metrics.netoKvadratura.toFixed(2)),
      brojZaposlenih,
      prometPoUposleniku,
      prometPoNetoKvadraturi: metrics.prometPoNetoKvadraturi,
      prometProslaGodinaPoNetoKvadraturi: metrics.prometProslaGodinaPoNetoKvadraturi,
      averageBasket: {
        value: averageBasketValue,
        previousValue: averageBasketPrevious,
      },
    };

    this.updateCategoryShareValue();

    this.buildPrometTableRows();
    this.renderDayComparisonChart?.();
    this.renderMonthComparisonChart?.();
  }

  private initializeCategoryShareData(): void {
    this.categoryOptions = [
      { category: 'Voće i povrće', share: 0.18, promet: 54000 },
      { category: 'Mesni proizvodi', share: 0.24, promet: 72000 },
      { category: 'Mlijeko i mliječni', share: 0.16, promet: 48000 },
      { category: 'Pića', share: 0.14, promet: 43000 },
      { category: 'Higijena', share: 0.12, promet: 36000 },
      { category: 'Dječija njega', share: 0.09, promet: 27000 },
      { category: 'Kućne potrepštine', share: 0.07, promet: 21000 }
    ];

    this.selectedCategories = this.categoryOptions.slice(0, 3).map(c => c.category);
    this.updateCategoryShareValue();
  }

  toggleCategorySelection(category: string, checked: boolean): void {
    if (checked) {
      if (!this.selectedCategories.includes(category)) {
        this.selectedCategories = [...this.selectedCategories, category];
      }
    } else {
      this.selectedCategories = this.selectedCategories.filter(c => c !== category);
    }

    this.updateCategoryShareValue();
  }

  private updateCategoryShareValue(): void {
    const selected = this.getSelectedCategoryData();
    const shareSum = selected.reduce((acc, item) => acc + (item.share ?? 0), 0);
    this.categoryShareValue = Number((shareSum * 100).toFixed(1));

    if (!this.dashboardSummary) {
      this.dashboardSummary = {};
    }

    this.dashboardSummary.categoryShare = {
      categories: this.categoryOptions,
      selectedCategories: this.selectedCategories
    };

    this.renderCategoryChart?.();
  }

  private getSelectedCategoryData(): CategoryShareItem[] {
    if (!this.selectedCategories.length) {
      return this.categoryOptions;
    }

    return this.categoryOptions.filter(c => this.selectedCategories.includes(c.category));
  }

  preuzmiExcel() {
    this.source.getFilteredAndSorted().then((filteredData: any[]) => {
      const visibleColumns = Object.keys(this.settings.columns).filter(
        key => !this.settings.columns[key].hide
      );

      const exportData = filteredData.map(row => {
        const filteredRow: any = {};
        visibleColumns.forEach(col => filteredRow[col] = row[col]);
        return filteredRow;
      });

      this.excel.exportAsExcelFile(exportData, 'Prometi');
    });
  }

  readonly quickActions: QuickAction[] = [
    {
      title: 'Pregled otpisa',
      description: 'Provjerite status redovnih i vanrednih otpisa na jednom mjestu.',
      icon: 'layout-outline',
      cta: 'Otvori pregled',
      accent: 'primary',
      action: 'PregledRedovnogOtpisa'
    },
    {
      title: 'Izdatnice troška',
      description: 'Pregledajte ili unesite nove izdatnice troška za prodavnice.',
      icon: 'file-text-outline',
      cta: 'Upravljanje izdatnicama',
      accent: 'success',
      action: 'Izdatnice'
    },
    {
      title: 'Neuslovna roba',
      description: 'Evidentirajte robu neuslovnu za prodaju i pratite status obrada.',
      icon: 'alert-triangle-outline',
      cta: 'Pregled neuslovne robe',
      accent: 'warning',
      action: 'NeuslovnaRoba'
    }
  ];

  readonly storeCharts: DashboardChartDescriptor[] = [
    {
      id: 'pie',
      icon: 'pie-chart-outline',
      title: 'Struktura otpisa',
      description: 'Udio svakog tipa aktivnosti u ukupnom broju zapisa.'
    },
    {
      id: 'MyChart',
      icon: 'bar-chart-outline',
      title: 'Uporedna statistika',
      description: 'Poređenje ključnih procesa kroz posljednji period.'
    },
    {
      id: 'line',
      icon: 'trending-up-outline',
      title: 'Trend kretanja',
      description: 'Kako se različiti procesi mijenjaju tokom vremena.'
    },
    {
      id: 'chart1',
      icon: 'activity-outline',
      title: 'Distribucija aktivnosti',
      description: 'Vizuelni prikaz intenziteta po svakoj kategoriji.'
    },
  ];

  readonly comparisonCharts: DashboardChartDescriptor[] = [
    {
      id: 'dayComparisonChart',
      icon: 'swap-outline',
      title: 'Poređenje današnjeg prometa',
      description: 'Usporedite rezultate dana sa prošlogodišnjim prometom.'
    },
    {
      id: 'monthComparisonChart',
      icon: 'calendar-outline',
      title: 'Mjesečni trend',
      description: 'Praćenje prometa po mjesecima i poređenje s prethodnom godinom.'
    }
  ];

  private loadPromet(storeId: string): void {
    this.isDashboardLoading = true;
    //getPrometCijelaMreza
    this.dataService.getPromet(storeId).pipe(finalize(() => this.isDashboardLoading = false))
      .subscribe({
        next: (r: any) => {
          this.applyPrometResponse(r);
          this.loadPrometDetalji();
        },
        error: (err) => {
          const greska = err?.error?.poruka ?? err?.statusText ?? err?.message;
          Swal.fire('Greška', 'Greška prilikom učitavanja prometa: ' + greska, 'error');
        }
      });
  }

  private applyPrometResponse(r: any): void {
    if (!r) return;

    const netoKvadratura = Number(r.netoKvadraturaObjekta ?? 0);
    const prometPoKvadraturi = r.prometPoNetoKvadraturi ?? (netoKvadratura
      ? Number((Number(r.promet) / netoKvadratura).toFixed(2))
      : 0);
    const brojZaposlenih = Number(r.brojZaposlenih ?? 0);
    const prometPoUposleniku = r.prometPoUposleniku ?? (brojZaposlenih ? Number((Number(r.promet) / brojZaposlenih).toFixed(2)) : 0);

    this.dashboardSummary = {
      promet: Number(r.promet ?? 0),
      prometProslaGodina: Number(r.prometProslaGodina),
      brojKupaca: Number(r.brojKupaca),
      brojKupacaProslaGodina: Number(r.brojKupacaProslaGodina),
      currency: 'KM',
      turnover: { value: Number(r.promet), previousValue: Number(r.prometProslaGodina) },
      visitors: { value: Number(r.brojKupaca), previousValue: Number(r.brojKupacaProslaGodina) },
      prometPoUposleniku,
      brojZaposlenih,
      prometPoNetoKvadraturi: prometPoKvadraturi,
      netoKvadraturaObjekta: netoKvadratura,
      averageBasket: {
        value: r.brojKupaca ? Number((r.promet / r.brojKupaca).toFixed(2)) : 0,
        previousValue: r.brojKupacaProslaGodina ? Number((r.prometProslaGodina / r.brojKupacaProslaGodina).toFixed(2)) : 0
      }
    };

    this.buildPrometTableRows();
    this.getKpiCards?.();
    this.renderDayComparisonChart?.();
    this.renderMonthComparisonChart?.();
  }

  private loadGodisnjiPromet(): void {
    this.isDashboardLoading = true;
    //getPrometCijelaMreza
    this.dataService.getPrometCijelaMreza().pipe(finalize(() => this.isDashboardLoading = false))
      .subscribe({
        next: (r: any) => {
          this.applyPrometResponse(r);
          this.loadPrometDetalji();
        },
        error: (err) => {
          const greska = err?.error?.poruka ?? err?.statusText ?? err?.message;
          Swal.fire('Greška', 'Greška prilikom učitavanja prometa: ' + greska, 'error');
        }
      });
  }

  private loadPrometDetalji(): void {
    this.isPrometHistoryLoading = true;
    this.dataService.getPrometDetalji()
      .pipe(takeUntil(this.destroy$), finalize(() => this.isPrometHistoryLoading = false))
      .subscribe({
        next: (detalji: PrometHistoryRow[]) => {
          this.prometHistoryRows = detalji ?? [];
          this.prometHistoryPage = 1;
        },
        error: (err) => {
          const poruka = err?.error?.poruka ?? err?.statusText ?? err?.message;
          Swal.fire('Greška', 'Greška prilikom učitavanja historije prometa: ' + poruka, 'error');
        }
      });
  }

  goToPrometHistoryPage(direction: 'prev' | 'next'): void {
    if (direction === 'prev' && this.prometHistoryPage > 1) {
      this.prometHistoryPage--;
    }

    if (direction === 'next' && this.prometHistoryPage < this.totalPrometHistoryPages) {
      this.prometHistoryPage++;
    }
  }

  exportPrometHistory(): void {
    if (!this.prometHistoryRows?.length) {
      Swal.fire('Obavijest', 'Nema dostupnih podataka za preuzimanje.', 'info');
      return;
    }

    const currency = this.dashboardSummary?.currency ?? 'KM';

    const exportRows = this.prometHistoryRows.map(row => ({
      Dan: row.day,
      [`Promet ${row.currentYear}`]: row.currentYearTurnover,
      [`Promet ${row.previousYear}`]: row.previousYearTurnover,
      Razlika: row.difference,
      'Datum (trenutna godina)': this.formatDate(row.currentYearDate),
      'Datum (prošla godina)': this.formatDate(row.previousYearDate),
      Valuta: currency
    }));

    this.excel.exportAsExcelFile(exportRows, 'historija_prometa');
  }

  private formatDate(value: string): string {
    const parsed = new Date(value);
    if (isNaN(parsed.getTime())) {
      return value;
    }
    return parsed.toLocaleDateString('bs-BA');
  }

  clearSearchAndSelect(value: string, dropdown: any) {
    this.selectedStoreId = value;

    // reset filter input
    if (dropdown && dropdown.filterInputChild) {
      dropdown.filterInputChild.nativeElement.value = '';
      dropdown.resetFilter();
    }

    this.onStoreChange(value);
  }

  calcPercent(current: number, last: number): number {
    if (!current || !last) return 0;
    return ((current - last) / last) * 100;
  }

  showAllStores(dropdown: any) {
    // poništi selekciju
    this.selectedStoreId = null;

    // reset pretrage u dropdownu ako postoji
    if (dropdown && dropdown.filterInputChild) {
      dropdown.filterInputChild.nativeElement.value = '';
      dropdown.resetFilter();
    }

    // poziv tvoje funkcije koja učitava podatke za cijelu mrežu
    this.loadGodisnjiPromet();
    this.loadSviPrometi();
  }

  private loadStoreCharts(storeId?: string | number | null): void {
    this.isStoreChartsLoading = true;
    this.getStoreChartsObservable(storeId)
      .pipe(finalize(() => this.isStoreChartsLoading = false))
      .subscribe({
        next: (response: any) => this.applyStoreChartsData(response),
        error: (err: any) => {
          const greska = err?.error?.poruka ?? err?.statusText ?? err?.message;
          Swal.fire('Greška', 'Greška: ' + greska, 'error');
        }
      });
  }

  private getStoreChartsObservable(storeId?: string | number | null) {
    const numericStoreId = storeId != null ? Number(storeId) : undefined;
    let statObservable: any = null;

    if (numericStoreId != null && numericStoreId !== 0) {
      if ((this.dataService as any).pregledajStatistikuByStore) {
        statObservable = (this.dataService as any).pregledajStatistikuByStore(numericStoreId);
      } else {
        try {
          statObservable = (this.dataService as any).pregledajStatistiku(numericStoreId);
        } catch {
          statObservable = (this.dataService as any).pregledajStatistiku();
        }
      }
    } else {
      statObservable = (this.dataService as any).pregledajStatistiku();
    }

    return statObservable;
  }

  private applyStoreChartsData(response: any): void {
    this.data = Array.isArray(response) ? response : [];

    if (!this.data.length) {
      this.renderStoreSummaryCharts(0, 0, 0, 0);
      return;
    }

    const latest = this.data[this.data.length - 1];
    this.redovni = Number(latest?.resultBrojRedovnog ?? 0);
    this.vanredni = Number(latest?.resultBrojVanrednog ?? 0);
    this.izdatnice = Number(latest?.resultIzdatnica ?? 0);
    this.neuslovnaRoba = Number(latest?.resultNeuslovnaRoba ?? 0);

    // render grafova na početnom dashboardu
    this.renderStoreSummaryCharts(this.redovni, this.vanredni, this.izdatnice, this.neuslovnaRoba);
  }

  onStoreDropdownOpen(isOpen: boolean) {
    if (isOpen) {
      this.storeSearch = '';
      this.filteredStores = this.stores;
    }
  }

  formatNumber(value: number, currency?: string): string {
    if (value === null || value === undefined) return '';
    return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value) + (currency ? ' ' + currency : '');
  }

  getKpiCards(): KpiCard[] {
    if (!this.dashboardSummary) return [];

    const cards: KpiCard[] = [];

    const buildCard = (key: string, label: string, current: number, prev: number, unit?: string, trend?: any[]) => {
      const deltaPercent = prev ? Number((((current - prev) / prev) * 100).toFixed(2)) : 0;
      const deltaValue = Number((current - prev).toFixed(2));
      const formattedValue = unit === '%'
        ? `${current.toFixed(1)} %`
        : this.formatNumber(current, unit);

      return {
        key,
        label,
        formattedValue,
        unit: unit ?? '',
        value: current,
        previousValue: prev,
        delta: deltaPercent,
        deltaValue,
        trend: trend ?? [],
        icon: key === 'turnover' ? 'trending-up' :
              key === 'visitors' ? 'people' :
              key === 'averageBasket' ? 'shopping-cart' :
              key === 'turnoverPerEmployee' ? 'briefcase' :
              key === 'turnoverPerArea' ? 'home' :
              key === 'categoryShare' ? 'pie-chart-2' : undefined
      };
    };
    cards.push(buildCard('turnover', 'Promet', this.dashboardSummary.promet ?? 0, this.dashboardSummary.prometProslaGodina ?? 0, this.dashboardSummary.currency ?? 'KM', this.dashboardSummary.turnover?.trend));
    cards.push(buildCard('visitors', 'Broj kupaca', this.dashboardSummary.brojKupaca ?? 0, this.dashboardSummary.brojKupacaProslaGodina ?? 0));
    cards.push(buildCard('averageBasket', 'Prosječna korpa', this.dashboardSummary.averageBasket?.value ?? 0, this.dashboardSummary.averageBasket?.previousValue ?? 0, this.dashboardSummary.currency ?? 'KM', this.dashboardSummary.averageBasket?.trend));
    cards.push(buildCard('turnoverPerEmployee', 'Promet po uposleniku', this.dashboardSummary.prometPoUposleniku ?? 0, 0, this.dashboardSummary.currency ?? 'KM'));
    cards.push(buildCard('categoryShare', 'Udio kategorije u prometu', this.categoryShareValue, 0, '%'));
    const areaUnit = this.dashboardSummary.currency ? `${this.dashboardSummary.currency}/m²` : undefined;
    cards.push(buildCard('turnoverPerArea', 'Promet po neto kvadraturi', this.dashboardSummary.prometPoNetoKvadraturi ?? 0, 0, areaUnit));

    return cards;
  }

  ngOnDestroy(): void {
    Object.keys(this.charts).forEach(key => {
      const chart = this.charts[key];
      if (chart) {
        chart.destroy();
      }
    });

    this.storeSelectionSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  isRoleStoreDashboardVisible(): boolean {
    // show store/dashboard for prodavnica and also for roles that can select store
    return this.rola === 'prodavnica' || this.rolesWithStoreSelection.includes(this.rola) || this.rola === 'uprava';
  }

  private loadStores(): void {
    this.dailyTaskService.getStores()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stores) => {
          this.stores = stores.filter(s => s.code !== '0000');
          this.filteredStores = this.stores;
          this.selectedStoreId = null;
        },
        error: (err) => {
          const poruka = err.error?.poruka ?? err.statusText;
          Swal.fire('Greška', `Greška prilikom učitavanja prodavnica: ${poruka}`, 'error');
        }
      });
  }

  onStoreChange(storeId: string | null): void {
    if (!storeId) return;

    this.selectedStoreId = storeId;

    // formatiranje u 3 cifre kao 001, 015, 203
    const storeCode = String(parseInt(storeId, 10)).padStart(3, '0');

    this.storeSelection$.next(storeCode);
  }

  private getEmptyRows(count: number) {
    return Array(count).fill(null).map(() => ({
      brojProdavnice: '',
      regija: '',
      format: '',
      adresa: '',
      promet: 0,
      prometProslaGodina: 0,
      brojKupaca: 0,
      brojKupacaProslaGodina: 0,
      prosjecnaKorpa: 0,
      prosjecnaKorpaProslaGodina: 0,
      razlikaPromet: 0,
      postotakPromet: 0,
      razlikaKorpa: 0,
      postotakKorpa: 0,
      _isEmpty: true // flag da ih stiliziramo posebno
    }));
  }

  private openDialog(template?: TemplateRef<any>, onOpen?: () => void): void {
    if (!template) {
      return;
    }

    this.dialogService.open(template, {
      closeOnBackdropClick: true
    });

    if (onOpen) {
      setTimeout(onOpen, 100);
    }
  }

  openKpiDetail(key: string): void {
    if (!this.dashboardSummary) {
      return;
    }

    switch (key) {
      case 'visitors':
        this.openDialog(this.visitorsDetail, () => this.renderTrendChart('visitorsTrendChart', this.dashboardSummary.visitors?.trend ?? this.dashboardSummary.visitorsTrend ?? [], 'Broj posjetilaca', '#3366ff'));
        break;
      case 'turnover':
        this.openDialog(this.turnoverDetail, () => this.renderTrendChart('turnoverTrendChart', this.dashboardSummary.turnover?.trend ?? this.dashboardSummary.turnoverTrend ?? [], 'Promet', '#00d68f'));
        break;
      case 'shrinkage':
        this.openDialog(this.shrinkageDetail, () => this.renderTrendChart('shrinkageTrendChart', this.dashboardSummary.shrinkage?.trend ?? [], 'Otpis', '#ff3d71'));
        break;
      case 'averageBasket':
        this.openDialog(this.basketDetail, () => this.renderTrendChart('basketTrendChart', this.dashboardSummary.averageBasket?.trend ?? [], 'Prosječna korpa', '#ffaa00'));
        break;
      case 'categoryShare':
        this.openDialog(this.categoryDetail, () => this.renderCategoryChart());
        break;
    }
  }

  private renderTrendChart(elementId: string, data: DashboardTrendPoint[], label: string, color: string): void {
    const config: Chart.ChartConfiguration = {
      type: 'line',
      data: {
        labels: data.map(d => d.label),
        datasets: [
          {
            label,
            data: data.map(d => d.value),
            borderColor: color,
            backgroundColor: color,
            fill: false,
            lineTension: 0.25,
            borderWidth: 3,
            pointRadius: 3,
            pointHoverRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        animation: { duration: 250 },
        tooltips: { mode: 'index', intersect: false },
        scales: {
          xAxes: [{ gridLines: { display: false } }],
          yAxes: [{ ticks: { beginAtZero: true } }],
        },
      },
    };

    this.renderChart(elementId, config);
  }

  private renderDayComparisonChart(): void {
    if (!this.dashboardSummary) return;

    let currentTotal = 0;
    let previousTotal = 0;

    if (this.dashboardSummary.dayOnDay) {
      currentTotal = this.dashboardSummary.dayOnDay.current.reduce((acc: number, item: any) => acc + item.value, 0);
      previousTotal = this.dashboardSummary.dayOnDay.previous.reduce((acc: number, item: any) => acc + item.value, 0);
    } else if (this.dashboardSummary.promet !== undefined || this.dashboardSummary.prometProslaGodina !== undefined) {
      currentTotal = Number(this.dashboardSummary.promet ?? 0);
      previousTotal = Number(this.dashboardSummary.prometProslaGodina ?? 0);
    } else {
      return;
    }

    const config: Chart.ChartConfiguration = {
      type: 'bar',
      data: {
        labels: ['Ove godine', 'Prošle godine'],
        datasets: [
          {
            label: 'Promet',
            data: [currentTotal, previousTotal],
            backgroundColor: ['#3366ff', '#ffce54'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        animation: { duration: 250 },
        tooltips: { mode: 'index', intersect: false },
        scales: {
          xAxes: [{ gridLines: { display: false } }],
          yAxes: [{ ticks: { beginAtZero: true, precision: 0 } }],
        },
      },
    };

    this.renderChart('dayComparisonChart', config);
  }

  private renderMonthComparisonChart(): void {
    if (!this.dashboardSummary?.monthOnMonth) return;

    const { current, previous, currentLabel, previousLabel } = this.dashboardSummary.monthOnMonth;

    // Kreiranje lookup mape za previous podatke
    const prevMap = new Map(previous.map((x: any) => [x.label, x.value]));

    const labels = current.map((x: any) => x.label);
    const currentValues = current.map((x: any) => x.value);
    const previousValues = labels.map(label => prevMap.get(label) ?? 0);

    // Ako postoji stari graf — uništi ga prije kreiranja novog
    if (this.charts['monthComparisonChart']) {
      this.charts['monthComparisonChart'].destroy();
    }

    const ctx = document.getElementById('monthComparisonChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.charts['monthComparisonChart'] = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: currentLabel,
            data: currentValues,
            borderColor: '#3366ff',
            backgroundColor: 'rgba(51, 102, 255, 0.15)',
            fill: false,
            tension: 0.25,
            borderWidth: 3,
            pointRadius: 3,
          },
          {
            label: previousLabel,
            data: previousValues,
            borderColor: '#ffce54',
            backgroundColor: 'rgba(255, 206, 84, 0.15)',
            fill: false,
            tension: 0.25,
            borderWidth: 3,
            pointRadius: 3,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
          },
          tooltip: {
            enabled: true,
          }
        },
        scales: {
          x: {
            grid: { display: false }
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  private renderCategoryChart(): void {
    if (!this.dashboardSummary) return;

    const categories = this.getSelectedCategoryData();

    const config: Chart.ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: categories.map((c: any) => c.category),
        datasets: [
          {
            data: categories.map((c: any) => (c.share ?? 0) * 100),
            backgroundColor: ['#3366ff', '#00d68f', '#ff3d71', '#ffaa00', '#8a2be2', '#17a2b8'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { position: 'bottom' },
        animation: { duration: 250 },
        cutoutPercentage: 60,
      },
    };

    this.renderChart('categoryShareChart', config);
  }

  private renderStoreSummaryCharts(redovni: number, vanredni: number, izdatnica: number, neuslovnaRoba: number): void {
    const labels = ['Redovni otpis', 'Vanredni otpis', 'Neuslovna roba', 'Izdatnice troška'];
    const values = [redovni, vanredni, neuslovnaRoba, izdatnica].map(value => Number(value ?? 0));
    const barColors = ['#3cb371', '#ff0000', '#0000ff', '#ffa500'];
    const pieColors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)'];
    const polarColors = ['#59ccf0', '#f0de59', '#6eed5a', '#f23a49'];

    const barConfig: Chart.ChartConfiguration = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Pregled statistike',
            data: values,
            backgroundColor: barColors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        animation: { duration: 250 },
        tooltips: { mode: 'index', intersect: false },
        scales: {
          xAxes: [{ gridLines: { display: false } }],
          yAxes: [{ ticks: { beginAtZero: true } }],
        },
      },
    };

    const pieConfig: Chart.ChartConfiguration = {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: pieColors,
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { position: 'bottom' },
        animation: { duration: 250 },
      },
    };

    const lineConfig: Chart.ChartConfiguration = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Pregled statistike',
            data: values,
            borderColor: '#3cb371',
            backgroundColor: 'rgba(60, 179, 113, 0.2)',
            fill: false,
            lineTension: 0.2,
            borderWidth: 3,
            pointRadius: 3,
            pointHoverRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        animation: { duration: 250 },
        tooltips: { mode: 'index', intersect: false },
        scales: {
          xAxes: [{ gridLines: { display: false } }],
          yAxes: [{ ticks: { beginAtZero: true } }],
        },
      },
    };

    const polarConfig: Chart.ChartConfiguration = {
      type: 'polarArea',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: polarColors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { position: 'bottom' },
        animation: { duration: 250 },
        scale: {
          ticks: { beginAtZero: true },
        },
      },
    };

    this.renderChart('MyChart', barConfig);
    this.renderChart('pie', pieConfig);
    this.renderChart('line', lineConfig);
    this.renderChart('chart1', polarConfig);
  }

  private renderChart(id: string, config: Chart.ChartConfiguration): void {
    const canvas = document.getElementById(id) as HTMLCanvasElement | null;
    if (!canvas) {
      return;
    }

    this.destroyChart(id);
    this.charts[id] = new Chart(canvas, config);
  }

  private destroyChart(id: string): void {
    const chart = this.charts[id];
    if (chart) {
      chart.destroy();
      delete this.charts[id];
    }
  }

  onQuickAction(action: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    switch (action) {
      case 'PregledRedovnogOtpisa':
        this.PregledRedovnogOtpisa();
        break;
      case 'Izdatnice':
        this.Izdatnice();
        break;
      case 'NeuslovnaRoba':
        this.NeuslovnaRoba();
        break;
    }
  }

  Izdatnice() {
    this.authService.getToken()
      .subscribe((token: NbAuthJWTToken) => {
        let rola = token.getPayload()["role"];
        if (rola == "prodavnica") {
          this.router.navigate(['/pages/izdatnice-troska/unos-nove-izdatnice']);
        } else if (rola == "interna") {
          this.router.navigate(['/pages/pregled/izdatnice-troska']);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Neovlašten pristup',
            text: 'Niste ovlašteni za unos izdatnica troška!',
            showConfirmButton: false,
            timer: 2000
          });
        }
      });
  }

  VanredniOtpis() {
    this.router.navigate(['/pages/otpis/vanredni/novi']);
  }

  NeuslovnaRoba() {
    this.authService.getToken()
      .subscribe((token: NbAuthJWTToken) => {
        let rola = token.getPayload()["role"];
        if (rola == "prodavnica") {
          this.router.navigate(['/pages/neuslovna-roba/neuslovna-roba-unos']);
        } else if (rola == "interna") {
          this.router.navigate(['/pages/pregled/neuslovna-roba']);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Neovlašten pristup',
            text: 'Niste ovlašteni za unos neuslovne robe!',
            showConfirmButton: false,
            timer: 2000
          });
        }
      });
  }

  PregledRedovnogOtpisa() {
    this.authService.getToken()
      .subscribe((token: NbAuthJWTToken) => {
        let rola = token.getPayload()["role"];
        if (rola == "prodavnica") {
          Swal.fire({
            title: 'Odaberite pregled otpisa',
            text: "Odaberite otpis koji želite pregledati!",
            icon: 'question',
            showDenyButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#E74C3C ',
            denyButtonColor: '#2ECC71',
            confirmButtonText: 'Redovni',
            denyButtonText: 'Vanredni',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/pages/otpis/redovni']);
            }
            else if (result.isDenied) {
              this.router.navigate(['/pages/otpis/vanredni']);
            }
          });
        } else if (rola == "interna") {
          Swal.fire({
            title: 'Odaberite pregled otpisa',
            text: "Odaberite otpis koji želite pregledati!",
            icon: 'question',
            showDenyButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#E74C3C ',
            denyButtonColor: '#2ECC71',
            confirmButtonText: 'Redovni',
            denyButtonText: 'Vanredni',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/pages/pregled/redovni-otpis']);
            }
            else if (result.isDenied) {
              this.router.navigate(['/pages/pregled/vanredni-otpis']);
            }
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Neovlašten pristup',
            text: 'Niste ovlašteni za pregled napravljenih otpisa!',
            showConfirmButton: false,
            timer: 2000
          });
        }
      });
  }

  trackByAction(_: number, action: QuickAction): string {
    return action.action;
  }

  trackByChart(_: number, chart: DashboardChartDescriptor): string {
    return chart.id;
  }

  trackByKpi(_: number, card: KpiCard): string {
    return card.key;
  }

  private toNumberSafe(v: any): number {
    if (v === undefined || v === null || v === '') return 0;
    const n = Number(v);
    return isNaN(n) ? 0 : n;
  }

  private sumSeries(arr: any[]): number {
    if (!Array.isArray(arr) || arr.length === 0) return 0;
    return arr.reduce((acc, it) => {
      const val = this.toNumberSafe(it?.value ?? it?.total ?? it?.amount ?? it?.iznos ?? it?.ukupno ?? 0);
      return acc + val;
    }, 0);
  }

  private buildPrometTableRows(): void {
    this.prometTableRows = [];

    const s = this.dashboardSummary;
    if (!s) return;

    const currency = s.currency ?? 'KM';

    // 1) Promet (ukupno) i promet prošla godina
    const prometNow = this.toNumberSafe(s.promet ?? s.turnover?.value ?? 0);
    const prometPrev = this.toNumberSafe(s.prometProslaGodina ?? s.turnover?.previousValue ?? 0);
    const prometDelta = +(prometNow - prometPrev);
    const prometDeltaPct = prometPrev ? +((prometDelta / prometPrev) * 100) : (prometNow ? 100 : 0);

    this.prometTableRows.push({
      metric: 'Promet (ukupno)',
      current: prometNow,
      previous: prometPrev,
      delta: prometDelta,
      deltaPercent: +prometDeltaPct.toFixed(2),
      currency,
      note: 'Ukupni promet'
    });

    // 2) Dnevni promet (dayOnDay) — sumira current/previous ako postoji
    const dayCurrentTotal = this.sumSeries(Array.isArray(s.dayOnDay?.current) ? s.dayOnDay.current : []);
    const dayPreviousTotal = this.sumSeries(Array.isArray(s.dayOnDay?.previous) ? s.dayOnDay.previous : []);
    const dayDelta = +(dayCurrentTotal - dayPreviousTotal);
    const dayDeltaPct = dayPreviousTotal ? +((dayDelta / dayPreviousTotal) * 100) : (dayCurrentTotal ? 100 : 0);

    if (dayCurrentTotal || dayPreviousTotal) {
      this.prometTableRows.push({
        metric: 'Promet danas (suma)',
        current: dayCurrentTotal,
        previous: dayPreviousTotal,
        delta: dayDelta,
        deltaPercent: +dayDeltaPct.toFixed(2),
        currency,
        note: 'Suma polja dayOnDay'
      });
    }

    // 3) Broj kupaca (posjetilaca)
    const visitorsNow = this.toNumberSafe(s.brojKupaca ?? s.visitors?.value ?? s.visitors?.ukupno ?? 0);
    const visitorsPrev = this.toNumberSafe(s.brojKupacaProslaGodina ?? s.visitors?.previousValue ?? s.visitors?.prosla ?? 0);
    const visitorsDelta = +(visitorsNow - visitorsPrev);
    const visitorsDeltaPct = visitorsPrev ? +((visitorsDelta / visitorsPrev) * 100) : (visitorsNow ? 100 : 0);

    this.prometTableRows.push({
      metric: 'Broj kupaca',
      current: visitorsNow,
      previous: visitorsPrev,
      delta: visitorsDelta,
      deltaPercent: +visitorsDeltaPct.toFixed(2),
      currency: '',
      note: 'Broj kupaca'
    });

    // 4) Prosječna korpa
    const avgNow = this.toNumberSafe(s.averageBasket?.value ?? s.averageBasket ?? 0);
    const avgPrev = this.toNumberSafe(s.averageBasket?.previousValue ?? s.averageBasket?.prosla ?? 0);
    const avgDelta = +(avgNow - avgPrev);
    const avgDeltaPct = avgPrev ? +((avgDelta / avgPrev) * 100) : (avgNow ? 100 : 0);

    this.prometTableRows.push({
      metric: 'Prosječna korpa',
      current: avgNow,
      previous: avgPrev,
      delta: avgDelta,
      deltaPercent: +avgDeltaPct.toFixed(2),
      currency,
      note: 'Promjerna vrijednost korpe'
    });

    // 5) Ako postoje monthOnMonth totals — izračunaj sumu i pokaži
    if (Array.isArray(s.monthOnMonth?.current) || Array.isArray(s.monthOnMonth?.previous)) {
      const mNow = this.sumSeries(Array.isArray(s.monthOnMonth?.current) ? s.monthOnMonth.current : []);
      const mPrev = this.sumSeries(Array.isArray(s.monthOnMonth?.previous) ? s.monthOnMonth.previous : []);
      const mDelta = +(mNow - mPrev);
      const mDeltaPct = mPrev ? +((mDelta / mPrev) * 100) : (mNow ? 100 : 0);

      this.prometTableRows.push({
        metric: 'Promet (mjesec suma)',
        current: mNow,
        previous: mPrev,
        delta: mDelta,
        deltaPercent: +mDeltaPct.toFixed(2),
        currency,
        note: 'Suma monthOnMonth'
      });
    }

    // 6) Dodatne napomene (ako imaš turnover/visitors objekat sa trendovima)
    if (s.turnover?.trend || s.visitors?.trend) {
      this.prometTableRows.push({
        metric: 'Napomena',
        current: 0,
        previous: 0,
        delta: 0,
        deltaPercent: 0,
        currency: '',
        note: 'Trendovi dostupni (otvori detalje za graf)'
      });
    }
  }

}
