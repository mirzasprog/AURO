import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import Swal from 'sweetalert2';
import { DataService } from '../../../@core/utils/data.service';
import { NbDialogService, NbIconLibraries } from '@nebular/theme';
import Chart from 'chart.js';
import { DashboardService } from '../../../@core/utils/dashboard.service';
import { DashboardSummary, DashboardTrendPoint } from '../../../@core/data/dashboard/dashboard-summary';

@Component({
  selector: 'ngx-radna-ploca',
  templateUrl: './radna-ploca.component.html',
  styleUrls: ['./radna-ploca.component.scss']
})
export class RadnaPlocaComponent implements OnInit, OnDestroy {
  //Lista za prikaz boja chart-a za statistiku
  colorScheme = {
    domain: ['#3cb371', '#ff0000', '#0000ff', '#ffa500', '#c537db']
  };  
  //Lista za prikaz boja chart-a za statistiku limita
  colorSchemeLimit = {
    domain: ['#3cb371', '#ff0000', '#0000ff', '#ffa500', '#c537db', '#c6eb34', '#e85702', '#2da0ed']
  };

  @ViewChild('visitorsDetail', { static: false }) visitorsDetail?: TemplateRef<any>;
  @ViewChild('turnoverDetail', { static: false }) turnoverDetail?: TemplateRef<any>;
  @ViewChild('shrinkageDetail', { static: false }) shrinkageDetail?: TemplateRef<any>;
  @ViewChild('basketDetail', { static: false }) basketDetail?: TemplateRef<any>;
  @ViewChild('categoryDetail', { static: false }) categoryDetail?: TemplateRef<any>;

  dashboardSummary?: DashboardSummary;
  isDashboardLoading = false;
  private charts: { [key: string]: Chart } = {};

  constructor(private router: Router, public authService: NbAuthService, private dataService: DataService,
    private iconService: NbIconLibraries, private dashboardService: DashboardService, private dialogService: NbDialogService) {
    this.iconService.registerFontPack('font-awesome', { packClass: 'fa' });
   }

  data = [];
  //Lista za generisanje cahrtova
  chart: any = [];
  redovni;
  vanredni;
  izdatnice;
  neuslovnaRoba;
  rola: string;

  quickActions = [
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

  storeCharts = [
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

  comparisonCharts = [
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
    this.dashboardService.getSummary().subscribe({
      next: (summary) => {
        this.dashboardSummary = summary;
        this.isDashboardLoading = false;
        this.renderDayComparisonChart();
        this.renderMonthComparisonChart();
      },
      error: (err) => {
        this.isDashboardLoading = false;
        const greska = err.error?.poruka ?? err.statusText;
        Swal.fire('Greška', `Greška prilikom učitavanja KPI podataka: ${greska}`, 'error');
      }
    });
  }

  getKpiCards(): Array<{ key: string; label: string; formattedValue: string; unit: string; value: number; trend: DashboardTrendPoint[] }> {
    if (!this.dashboardSummary) {
      return [];
    }

    const baseCards = [
      this.dashboardSummary.visitors,
      this.dashboardSummary.turnover,
      this.dashboardSummary.shrinkage,
      this.dashboardSummary.averageBasket,
    ].map(card => ({
      key: card.key,
      label: card.label,
      formattedValue: card.formattedValue,
      unit: card.unit,
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
    this.dataService.pregledajStatistiku().subscribe({
      next: (response) => {
        this.data = response;
        this.data.forEach(item => {
          this.redovni = item.resultBrojRedovnog;
          this.vanredni = item.resultBrojVanrednog;
          this.izdatnice = item.resultIzdatnica;
          this.neuslovnaRoba = item.resultNeuslovnaRoba;
        });
        this.createChart(this.redovni, this.vanredni, this.izdatnice, this.neuslovnaRoba);
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
    const canvas = document.getElementById(elementId) as HTMLCanvasElement;
    if (!canvas) {
      return;
    }

    this.destroyChart(elementId);
    this.charts[elementId] = new Chart(canvas, {
      type: 'line',
      data: {
        labels: data.map(d => d.label),
        datasets: [
          {
            label,
            data: data.map(d => d.value),
            backgroundColor: color,
            borderColor: color,
            fill: false,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  }

  private renderDayComparisonChart(): void {
    if (!this.dashboardSummary) {
      return;
    }

    const canvas = document.getElementById('dayComparisonChart') as HTMLCanvasElement;
    if (!canvas) {
      return;
    }

    const currentTotal = this.dashboardSummary.dayOnDay.current.reduce((acc, item) => acc + item.value, 0);
    const previousTotal = this.dashboardSummary.dayOnDay.previous.reduce((acc, item) => acc + item.value, 0);

    this.destroyChart('dayComparisonChart');
    this.charts['dayComparisonChart'] = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Danas', 'Prošle godine'],
        datasets: [
          {
            label: this.dashboardSummary.dayOnDay.currentLabel,
            data: [currentTotal, previousTotal],
            backgroundColor: ['#3366ff', '#ffce54']
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  }

  private renderMonthComparisonChart(): void {
    if (!this.dashboardSummary) {
      return;
    }

    const canvas = document.getElementById('monthComparisonChart') as HTMLCanvasElement;
    if (!canvas) {
      return;
    }

    const current = this.dashboardSummary.monthOnMonth.current;
    const previousLookup = new Map(this.dashboardSummary.monthOnMonth.previous.map(item => [item.label, item.value]));

    const labels = current.map(item => item.label);
    const currentValues = current.map(item => item.value);
    const previousValues = labels.map(label => previousLookup.get(label) ?? 0);

    this.destroyChart('monthComparisonChart');
    this.charts['monthComparisonChart'] = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: this.dashboardSummary.monthOnMonth.currentLabel,
            data: currentValues,
            borderColor: '#3366ff',
            backgroundColor: 'rgba(51, 102, 255, 0.2)',
            fill: true
          },
          {
            label: this.dashboardSummary.monthOnMonth.previousLabel,
            data: previousValues,
            borderColor: '#ffce54',
            backgroundColor: 'rgba(255, 206, 84, 0.2)',
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  }

  private renderCategoryChart(): void {
    if (!this.dashboardSummary) {
      return;
    }

    const canvas = document.getElementById('categoryShareChart') as HTMLCanvasElement;
    if (!canvas) {
      return;
    }

    const categories = this.dashboardSummary.categoryShare.categories;
    this.destroyChart('categoryShareChart');
    this.charts['categoryShareChart'] = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: categories.map(c => c.category),
        datasets: [
          {
            data: categories.map(c => (c.share * 100)),
            backgroundColor: ['#3366ff', '#00d68f', '#ff3d71', '#ffaa00', '#8a2be2', '#17a2b8'],
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    });
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

  //Funkcija za generisanje chart-ova sa podacima na početnoj stranici
  createChart(redovni: number, vanredni: number, izdatnica: number, neuslovnaRoba: number,){
    this.chart = new Chart("MyChart", {
      type: 'bar',
      data: {
        labels: ['Redovni otpis', 'Vanredni otpis', 'Neuslovna roba', 'Izdatnice troška'],
        datasets: [
          {
            label: 'Pregled statistike',
            data: [redovni, vanredni, neuslovnaRoba, izdatnica],
            borderWidth: 5,
            backgroundColor: ['#3cb371', '#ff0000', '#0000ff', '#ffa500'],
            
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: false,
          },
        },
      },
      
    });    
    this.chart = new Chart("pie", {
      type: 'pie',
      data: {
        labels: ['Redovni otpis', 'Vanredni otpis', 'Neuslovna roba', 'Izdatnice troška'],
        datasets: [
          {
            label: 'Pregled statistike',
            data: [redovni, vanredni, neuslovnaRoba, izdatnica],
            borderWidth: 0,
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
            ],
            hoverOffset: 1
          },
        ],
      },
      options: { aspectRatio:2.0, 
      } 
      
    });    
    this.chart = new Chart("line", {
      type: 'line',
      data: {
        labels: ['Redovni otpis', 'Vanredni otpis', 'Neuslovna roba', 'Izdatnice troška'],
        datasets: [
          {
            label: 'Pregled statistike',
            data: [redovni, vanredni, neuslovnaRoba, izdatnica],
            borderWidth: 5,
            backgroundColor: '#3cb371'
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
      
    });
    this.chart = new Chart("chart1", {
      type: 'polarArea',
      data: {
        labels: ['Redovni otpis', 'Vanredni otpis', 'Neuslovna roba', 'Izdatnice troška'],
        datasets: [
          {
            label: 'Pregled statistike',
            data: [redovni, vanredni, neuslovnaRoba, izdatnica],
            borderWidth: 5,
            backgroundColor: ['#59ccf0', '#f0de59', '#6eed5a', '#f23a49'],
            style:"opacity: 0.6;" 
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
      
    }); 
  } 
}
