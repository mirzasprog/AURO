import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import Swal from 'sweetalert2';
import { DataService } from '../../../@core/utils/data.service';
import { NbDialogService, NbIconLibraries } from '@nebular/theme';
import Chart from 'chart.js';
import { finalize } from 'rxjs/operators';
import { DashboardService } from '../../../@core/utils/dashboard.service';
import { DashboardSummary, DashboardTrendPoint } from '../../../@core/data/dashboard/dashboard-summary';

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
  unit: string;
  value: number;
  trend: DashboardTrendPoint[];
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

  dashboardSummary?: DashboardSummary;
  isDashboardLoading = false;
  isStoreChartsLoading = false;
  private charts: { [key: string]: Chart } = {};

  constructor(private router: Router, public authService: NbAuthService, private dataService: DataService,
    private iconService: NbIconLibraries, private dashboardService: DashboardService, private dialogService: NbDialogService) {
    this.iconService.registerFontPack('font-awesome', { packClass: 'fa' });
  }

  data: any[] = [];
  redovni = 0;
  vanredni = 0;
  izdatnice = 0;
  neuslovnaRoba = 0;
  rola: string;

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

  ngOnInit(): void {
    this.authService.getToken().subscribe((token: NbAuthJWTToken) => {
      this.rola = token.getPayload()["role"];

      if (this.rola === 'prodavnica') {
        if (!this.dashboardSummary) {
          this.loadDashboardSummary();
        }
        this.loadStoreCharts();
      } else {
        this.loadPendingRequestsAlerts();
      }
    });
  }

  ngOnDestroy(): void {
    Object.keys(this.charts).forEach(key => {
      const chart = this.charts[key];
      if (chart) {
        chart.destroy();
      }
    });
  }

  private loadDashboardSummary(): void {
    this.isDashboardLoading = true;
    this.dashboardService.getSummary()
      .pipe(finalize(() => this.isDashboardLoading = false))
      .subscribe({
        next: (summary) => {
          this.dashboardSummary = summary;
          this.renderDayComparisonChart();
          this.renderMonthComparisonChart();
        },
        error: (err) => {
          const greska = err.error?.poruka ?? err.statusText;
          Swal.fire('Greška', `Greška prilikom učitavanja KPI podataka: ${greska}`, 'error');
        }
      });
  }

  getKpiCards(): KpiCard[] {
    if (!this.dashboardSummary) {
      return [];
    }

    const baseCards: KpiCard[] = [
      this.dashboardSummary.visitors,
      this.dashboardSummary.turnover,
      this.dashboardSummary.shrinkage,
      this.dashboardSummary.averageBasket,
    ].map(card => ({
      key: card.key,
      label: card.label,
      formattedValue: card.formattedValue,
      unit: card.unit ?? '',
      value: card.value,
      trend: card.trend
    }));

    const vipPercentage = +(this.dashboardSummary.categoryShare.vipShare * 100).toFixed(1);
    baseCards.push({
      key: 'categoryShare',
      label: 'Udio VIP kategorije',
      value: vipPercentage,
      formattedValue: vipPercentage.toFixed(1),
      unit: '%',
      trend: []
    });

    return baseCards;
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

  openKpiDetail(key: string): void {
    if (!this.dashboardSummary) {
      return;
    }

    switch (key) {
      case 'visitors':
        this.openDialog(this.visitorsDetail, () => this.renderTrendChart('visitorsTrendChart', this.dashboardSummary!.visitors.trend, 'Broj posjetilaca', '#3366ff'));
        break;
      case 'turnover':
        this.openDialog(this.turnoverDetail, () => this.renderTrendChart('turnoverTrendChart', this.dashboardSummary!.turnover.trend, 'Promet', '#00d68f'));
        break;
      case 'shrinkage':
        this.openDialog(this.shrinkageDetail, () => this.renderTrendChart('shrinkageTrendChart', this.dashboardSummary!.shrinkage.trend, 'Otpis', '#ff3d71'));
        break;
      case 'averageBasket':
        this.openDialog(this.basketDetail, () => this.renderTrendChart('basketTrendChart', this.dashboardSummary!.averageBasket.trend, 'Prosječna korpa', '#ffaa00'));
        break;
      case 'categoryShare':
        this.openDialog(this.categoryDetail, () => this.renderCategoryChart());
        break;
    }
  }

  private loadStoreCharts(): void {
    this.isStoreChartsLoading = true;
    this.dataService.pregledajStatistiku()
      .pipe(finalize(() => this.isStoreChartsLoading = false))
      .subscribe({
        next: (response) => {
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

          this.renderStoreSummaryCharts(this.redovni, this.vanredni, this.izdatnice, this.neuslovnaRoba);
        },
        error: (err) => {
          const greska = err.error?.poruka ?? err.statusText;
          Swal.fire('Greška', 'Greška: ' + greska, 'error');
        }
      });
  }

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
    if (!this.dashboardSummary) {
      return;
    }

    const currentTotal = this.dashboardSummary.dayOnDay.current.reduce((acc, item) => acc + item.value, 0);
    const previousTotal = this.dashboardSummary.dayOnDay.previous.reduce((acc, item) => acc + item.value, 0);

    const config: Chart.ChartConfiguration = {
      type: 'bar',
      data: {
        labels: ['Danas', 'Prošle godine'],
        datasets: [
          {
            label: this.dashboardSummary.dayOnDay.currentLabel,
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
    if (!this.dashboardSummary) {
      return;
    }

    const current = this.dashboardSummary.monthOnMonth.current;
    const previousLookup = new Map(this.dashboardSummary.monthOnMonth.previous.map(item => [item.label, item.value]));

    const labels = current.map(item => item.label);
    const currentValues = current.map(item => item.value);
    const previousValues = labels.map(label => previousLookup.get(label) ?? 0);

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
  }

  private renderCategoryChart(): void {
    if (!this.dashboardSummary) {
      return;
    }

    const categories = this.dashboardSummary.categoryShare.categories;

    const config: Chart.ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: categories.map(c => c.category),
        datasets: [
          {
            data: categories.map(c => c.share * 100),
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

//Funkcija za reddirectanje na komponentu "Izdatnice troška"
  Izdatnice() {
    this.authService.getToken()
      .subscribe((token: NbAuthJWTToken) => {
        let rola = token.getPayload()["role"]
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
          })
        }
      });
  }
  //Funkcija za reddirectanje na komponentu "Vanredni otpis"
  VanredniOtpis() {
    this.router.navigate(['/pages/otpis/vanredni/novi']);
  }
  //Funkcija za reddirectanje na komponentu "Neuslovna roba"
  NeuslovnaRoba() {
    this.authService.getToken()
      .subscribe((token: NbAuthJWTToken) => {
        let rola = token.getPayload()["role"]
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
          })
        }
      });
  }
 //Funkcija za reddirectanje na komponentu "Redovni otpis"
  PregledRedovnogOtpisa() {
    this.authService.getToken()
      .subscribe((token: NbAuthJWTToken) => {
        let rola = token.getPayload()["role"]
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
          })
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
          })  
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Neovlašten pristup',
            text: 'Niste ovlašteni za pregled napravljenih otpisa!',
            showConfirmButton: false,
            timer: 2000
          })
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
