import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import Swal from 'sweetalert2';
import { DataService } from '../../../@core/utils/data.service';
import { NbDialogService, NbIconLibraries } from '@nebular/theme';
import Chart from 'chart.js';
import { finalize, takeUntil } from 'rxjs/operators';
import { DashboardService } from '../../../@core/utils/dashboard.service';
import { DashboardSummary, DashboardTrendPoint } from '../../../@core/data/dashboard/dashboard-summary';
import { DailyTaskService } from '../../../@core/utils/daily-task.service';
import { Subject } from 'rxjs';

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

type KpiCard = {
  key: string;
  label: string;
  formattedValue: string;
  unit?: string;
  value?: number;
  previousValue?: number;
  delta?: number; // percentage change
  trend?: DashboardTrendPoint[];
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

  stores: any[] = [];
  selectedStoreId: number | string | null = null;

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

  // role set that should be able to select store
  rolesWithStoreSelection: string[] = ['uprava', 'podrucni', 'regionalni'];
  private destroy$ = new Subject<void>();
  constructor(
    private router: Router,
    public authService: NbAuthService,
    private dataService: DataService,
    private iconService: NbIconLibraries,
    private dashboardService: DashboardService,
    private dialogService: NbDialogService,
    private readonly dailyTaskService: DailyTaskService
  ) {
    this.iconService.registerFontPack('font-awesome', { packClass: 'fa' });
  }

private loadPromet(storeId: string): void {
  this.isDashboardLoading = true;

  this.dataService.getPromet(storeId).pipe(finalize(() => this.isDashboardLoading = false))
    .subscribe({
      next: (r: any) => {
        this.dashboardSummary = {
          promet: Number(r.promet),
          prometProslaGodina: Number(r.prometProslaGodina),
          brojKupaca: Number(r.brojKupaca),
          brojKupacaProslaGodina: Number(r.brojKupacaProslaGodina),
          currency: 'KM',
          turnover: { value: Number(r.promet), previousValue: Number(r.prometProslaGodina) },
          visitors: { value: Number(r.brojKupaca), previousValue: Number(r.brojKupacaProslaGodina) },
          averageBasket: { 
            value: r.brojKupaca ? Number((r.promet / r.brojKupaca).toFixed(2)) : 0,
            previousValue: r.brojKupacaProslaGodina ? Number((r.prometProslaGodina / r.brojKupacaProslaGodina).toFixed(2)) : 0 
          }
        };

        // odmah renderujemo KPI kartice
        this.getKpiCards?.();

        // render grafova vezanih za promet
        this.renderDayComparisonChart?.();
        this.renderMonthComparisonChart?.();
      },
      error: (err) => {
        const greska = err?.error?.poruka ?? err?.statusText ?? err?.message;
        Swal.fire('Greška', 'Greška prilikom učitavanja prometa: ' + greska, 'error');
      }
    });
}

  private loadInitialData(): void {
  
      this.dailyTaskService.getStores()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (stores) => {
            this.stores = stores;
            if (stores.length > 0) {
              this.selectedStoreId = stores[0].id;
            }
          },
          error: (err) => {
            const poruka = err.error?.poruka ?? err.statusText;
            Swal.fire('Greška', `Greška prilikom učitavanja prodavnica: ${poruka}`, 'error');
          }
        });
  }
// --- učitavanje statistika za grafove ---
private loadStoreCharts(storeId?: string | number | null): void {
  this.isStoreChartsLoading = true;
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

  statObservable.pipe(finalize(() => this.isStoreChartsLoading = false)).subscribe({
    next: (response: any) => {
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
    },
    error: (err: any) => {
      const greska = err?.error?.poruka ?? err?.statusText ?? err?.message;
      Swal.fire('Greška', 'Greška: ' + greska, 'error');
    }
  });
}

// --- ngOnInit spojnica ---
ngOnInit(): void {
  this.authService.getToken().subscribe((token: NbAuthJWTToken) => {
    this.rola = token.getPayload()['role'] ?? this.rola;
    this.korisnickoIme = token.getPayload()['name'] ?? this.korisnickoIme;

    if (this.rola === 'prodavnica') {
      // trim prve nule, uzmi zadnje 3 cifre
      const storeId = String(parseInt(this.korisnickoIme, 10)).padStart(3, '0');
      this.selectedStoreId = storeId;

      this.loadPromet(storeId);       // KPI kartice + promet grafovi
      this.loadStoreCharts(storeId);  // svi grafovi
      return;
    }
    this.loadStores();
    // ako nije prodavnica, učitaj globalne podatke
    this.loadPromet('000');          // default prodavnica
    this.loadStoreCharts();          // globalni grafovi
  });
}

// getKpiCards() ostaje isti kao prije
getKpiCards(): KpiCard[] {
  if (!this.dashboardSummary) return [];

  const cards: KpiCard[] = [];

  const currentPromet = Number(this.dashboardSummary.promet ?? 0);
  const prevPromet = Number(this.dashboardSummary.prometProslaGodina ?? 0);
  cards.push({
    key: 'turnover',
    label: 'Promet',
    formattedValue: currentPromet.toFixed(2),
    unit: this.dashboardSummary.currency ?? 'KM',
    value: currentPromet,
    previousValue: prevPromet,
    delta: prevPromet ? Number((((currentPromet - prevPromet) / prevPromet) * 100).toFixed(2)) : 0,
    trend: this.dashboardSummary.turnover?.trend ?? []
  });

  const currentKupci = Number(this.dashboardSummary.brojKupaca ?? 0);
  const prevKupci = Number(this.dashboardSummary.brojKupacaProslaGodina ?? 0);
  cards.push({
    key: 'visitors',
    label: 'Broj kupaca',
    formattedValue: String(currentKupci),
    value: currentKupci,
    previousValue: prevKupci,
    delta: prevKupci ? Number((((currentKupci - prevKupci) / prevKupci) * 100).toFixed(2)) : 0,
    trend: this.dashboardSummary.visitors?.trend ?? []
  });

  const avgBasket = Number(this.dashboardSummary.averageBasket?.value ?? 0);
  const avgBasketPrev = Number(this.dashboardSummary.averageBasket?.previousValue ?? 0);
  cards.push({
    key: 'averageBasket',
    label: 'Prosječna korpa',
    formattedValue: avgBasket.toFixed(2),
    unit: this.dashboardSummary.currency ?? 'KM',
    value: avgBasket,
    previousValue: avgBasketPrev,
    delta: avgBasketPrev ? Number((((avgBasket - avgBasketPrev) / avgBasketPrev) * 100).toFixed(2)) : 0,
    trend: this.dashboardSummary.averageBasket?.trend ?? []
  });

  return cards;
}

  ngOnDestroy(): void {
    Object.keys(this.charts).forEach(key => {
      const chart = this.charts[key];
      if (chart) {
        chart.destroy();
      }
    });
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
            this.stores = stores;
            if (stores.length > 0) {
              this.selectedStoreId = stores[0].code;

            }
          },
          error: (err) => {
            const poruka = err.error?.poruka ?? err.statusText;
            Swal.fire('Greška', `Greška prilikom učitavanja prodavnica: ${poruka}`, 'error');
          }
        });
  }

  onStoreChange(storeId: string | null): void {
    this.selectedStoreId = storeId;
              const storeCode = String(parseInt(this.selectedStoreId, 10)).padStart(3, '0');
                    this.loadPromet(storeCode);       // KPI kartice + promet grafovi
                    this.loadStoreCharts(storeId);  // svi grafovi
        console.log("CODE: " + this.selectedStoreId)            
    this.loadPromet(this.selectedStoreId);          // default prodavnica
    this.loadStoreCharts(); 
    return;
  }

  

  // ---------------------------
  // DASHBOARD SUMMARY
  // ---------------------------
  private loadDashboardSummary(storeId?: string | number | null): void {
    this.isDashboardLoading = true;

    // Sigurno konvertuj storeId u broj ako servis očekuje number
    const numericStoreId = storeId != null ? Number(storeId) : undefined;

    // Ako dashboardService.getSummary očekuje number ili undefined
    this.dashboardService.getSummary(numericStoreId)
      .pipe(finalize(() => this.isDashboardLoading = false))
      .subscribe({
        next: (summary) => {
          this.dashboardSummary = summary;
          // render chartovi koji koriste dashboardSummary
          this.renderDayComparisonChart();
          this.renderMonthComparisonChart();
        },
        error: (err) => {
          const greska = err?.error?.poruka ?? err?.statusText ?? err?.message;
          Swal.fire('Greška', `Greška prilikom učitavanja KPI podataka: ${greska}`, 'error');
        }
      });
  }


  // ---------------------------
  // PENDING REQUESTS
  // ---------------------------
  private loadPendingRequestsAlerts(): void {
    this.dataService.prikaziZahtjeveRedovnogOtpisa().subscribe({
      next: (response) => this.showPendingRequestsAlert(response, 'redovni'),
      error: (err) => {
        const greska = err.error?.poruka ?? err.statusText;
        Swal.fire('Greška', 'Greška: ' + greska, 'error');
      }
    });

    this.dataService.prikaziZahtjeveVanrednogOtpisa().subscribe({
      next: (response) => this.showPendingRequestsAlert(response, 'vanredni'),
      error: (err) => {
        const greska = err.error?.poruka ?? err.statusText;
        Swal.fire('Greška', 'Greška: ' + greska, 'error');
      }
    });
  }

  private showPendingRequestsAlert(data: any[], tip: 'redovni' | 'vanredni'): void {
    this.data = data;
    if (!this.data || !this.data.length) {
      return;
    }

    const isRedovni = tip === 'redovni';
    Swal.fire({
      icon: 'warning',
      title: 'Zahtjevi',
      text: `Broj neobrađenih zahtjeva za ${isRedovni ? 'redovni' : 'vanredni'} otpis je : ${this.data.length}`,
      showConfirmButton: false,
      returnFocus: false,
      allowEscapeKey: false,
      allowOutsideClick: () => {
        const popup = Swal.getPopup();
        popup.classList.remove('swal2-show');
        setTimeout(() => {
          popup.classList.add('animate__animated', 'animate__heartBeat');
        });
        setTimeout(() => {
          popup.classList.remove('animate__animated', 'animate__heartBeat');
        }, 1000);
        return false;
      },
      footer: isRedovni
        ? '<a href="/pages/zahtjevi/redovni-otpis">Pregledaj zahtjeve</a>'
        : '<a href="/pages/zahtjevi/vanredni-otpis">Pregledaj zahtjeve</a>',
    });
  }

  // ---------------------------
  // DIALOG + KPI DETAILS
  // ---------------------------
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

  // ---------------------------
  // RENDER CHART HELPERS (iz originala)
  // ---------------------------
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
    if (!this.dashboardSummary) return;

    if (this.dashboardSummary.monthOnMonth) {
      const current = this.dashboardSummary.monthOnMonth.current;
      const previousLookup = new Map(this.dashboardSummary.monthOnMonth.previous.map((item: any) => [item.label, item.value]));

      const labels = current.map((item: any) => item.label);
      const currentValues = current.map((item: any) => item.value);
      const previousValues = labels.map((label: any) => previousLookup.get(label) ?? 0);

      const config: Chart.ChartConfiguration = {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: this.dashboardSummary.monthOnMonth.currentLabel,
              data: currentValues,
              borderColor: '#3366ff',
              backgroundColor: 'rgba(51, 102, 255, 0.15)',
              fill: false,
              lineTension: 0.25,
              borderWidth: 3,
              pointRadius: 2,
            },
            {
              label: this.dashboardSummary.monthOnMonth.previousLabel,
              data: previousValues,
              borderColor: '#ffce54',
              backgroundColor: 'rgba(255, 206, 84, 0.15)',
              fill: false,
              lineTension: 0.25,
              borderWidth: 3,
              pointRadius: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: { display: true, position: 'bottom' },
          animation: { duration: 250 },
          tooltips: { mode: 'index', intersect: false },
          scales: {
            xAxes: [{ gridLines: { display: false } }],
            yAxes: [{ ticks: { beginAtZero: true } }],
          },
        },
      };

      this.renderChart('monthComparisonChart', config);
    } else {
      return;
    }
  }

  private renderCategoryChart(): void {
    if (!this.dashboardSummary) return;

    const categories = this.dashboardSummary.categoryShare?.categories ?? [];

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

  // ---------------------------
  // QUICK ACTIONS (ostalo identicno)
  // ---------------------------
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
            denyButtonColor:'#2ECC71',
            confirmButtonText: 'Redovni',
            denyButtonText:'Vanredni',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/pages/otpis/redovni']);
            }
            else if(result.isDenied) {
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
            denyButtonColor:'#2ECC71',
            confirmButtonText: 'Redovni',
            denyButtonText:'Vanredni',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/pages/pregled/redovni-otpis']);
            }
            else if(result.isDenied) {
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
}
