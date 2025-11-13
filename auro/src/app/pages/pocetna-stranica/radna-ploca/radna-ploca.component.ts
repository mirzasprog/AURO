import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import Swal from 'sweetalert2';
import { DataService } from '../../../@core/utils/data.service';
import { NbIconLibraries } from '@nebular/theme';
import Chart from 'chart.js';

@Component({
  selector: 'ngx-radna-ploca',
  templateUrl: './radna-ploca.component.html',
  styleUrls: ['./radna-ploca.component.scss']
})
export class RadnaPlocaComponent implements OnInit {
  //Lista za prikaz boja chart-a za statistiku
  colorScheme = {
    domain: ['#3cb371', '#ff0000', '#0000ff', '#ffa500', '#c537db']
  };  
  //Lista za prikaz boja chart-a za statistiku limita
  colorSchemeLimit = {
    domain: ['#3cb371', '#ff0000', '#0000ff', '#ffa500', '#c537db', '#c6eb34', '#e85702', '#2da0ed']
  };

  constructor(private router: Router, public authService: NbAuthService,private dataService: DataService,
    private iconService: NbIconLibraries) {
    this.iconService.registerFontPack('font-awesome', { packClass: 'fa' });
   }

  data = [];
  pregled=[];
  //Lista za generisanje cahrtova
  chart: any = [];
  redovni ;
  vanredni;
  izdatnice;
  neuslovnaRoba;
  rola: string;

  ngOnInit(): void {
    this.authService.getToken().subscribe((token: NbAuthJWTToken) => {
      this.rola = token.getPayload()["role"];
    });
    if(this.rola == 'prodavnica') {
    //Servis za prikaz statistike na početnoj stranici
    this.dataService.pregledajStatistiku().subscribe(
      (r) => {
        this.data = r;   
        this.data.forEach(item => {
          this.redovni = item.resultBrojRedovnog;
          this.vanredni = item.resultBrojVanrednog;
          this.izdatnice = item.resultIzdatnica;
          this.neuslovnaRoba = item.resultNeuslovnaRoba;
          })
          this.createChart(this.redovni,this.vanredni,this.izdatnice,this.neuslovnaRoba);
      },
      (err) => {;
        const greska = err.error?.poruka ?? err.statusText;
        Swal.fire("Greška", "Greška: " + greska, "error");
      }
    );
    }
    //Servis za prikazivanje broja zahtjeva za redovni otpis (view za role 'podrucni' i 'regionalni')
    this.dataService.prikaziZahtjeveRedovnogOtpisa().subscribe(
      (r) => {
        this.data = r;
        //this.source.load(this.data);
        if(this.data.length !== 0){
          Swal.fire({
            icon: 'warning',
            title: 'Zahtjevi',
            text: 'Broj neobrađenih zahtjeva za redovni otpis je : ' + this.data.length, 
            showConfirmButton:false,
            returnFocus:false,
            allowEscapeKey: false,
            allowOutsideClick: () => {
              const popup = Swal.getPopup()
              popup.classList.remove('swal2-show')
              setTimeout(() => {
                popup.classList.add('animate__animated', 'animate__heartBeat')
              })
              setTimeout(() => {
                popup.classList.remove('animate__animated', 'animate__heartBeat')
              }, 1000)
              return false
            },
            footer: '<a href="/pages/zahtjevi/redovni-otpis">Pregledaj zahtjeve</a>',
          })
        }
      },
      (err) => {
        const greska = err.error?.poruka ?? err.statusText;
        Swal.fire("Greška", "Greška: " + greska, "error");
      }
    );
    //Servis za prikazivanje broja zahtjeva za vanredni otpis (view za role 'podrucni' i 'regionalni')
    this.dataService.prikaziZahtjeveVanrednogOtpisa().subscribe(
      (r) => {
      this.data = r;
      if(this.data.length !== 0){
        Swal.fire({
          icon: 'warning',
          title: 'Zahtjevi',
          text: 'Broj neobrađenih zahtjeva za vanredni otpis je : ' + this.data.length, 
          showConfirmButton:false,
          returnFocus:false,
          allowEscapeKey: false,
          allowOutsideClick: () => {
            const popup = Swal.getPopup()
            popup.classList.remove('swal2-show')
            setTimeout(() => {
              popup.classList.add('animate__animated', 'animate__heartBeat')
            })
            setTimeout(() => {
              popup.classList.remove('animate__animated', 'animate__heartBeat')
            }, 1000)
            return false
          },
          footer: '<a href="/pages/zahtjevi/vanredni-otpis">Pregledaj zahtjeve</a>',
        })
      }
      },
      (err) => {
        const greska = err.error?.poruka ?? err.statusText;
        Swal.fire("Greška", "Greška: " + greska, "error");
      }
    );
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
