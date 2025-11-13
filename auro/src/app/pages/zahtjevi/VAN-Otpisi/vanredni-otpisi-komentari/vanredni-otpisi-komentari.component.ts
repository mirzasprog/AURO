import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-vanredni-otpisi-komentari',
  templateUrl: './vanredni-otpisi-komentari.component.html',
  styleUrls: ['./vanredni-otpisi-komentari.component.scss']
})
export class VanredniOtpisiKomentariComponent implements OnInit {
//unos korinika
  unos={
    komentar:""
  }
  constructor() { }
  
  ngOnInit(): void {
  }
//Funkcija za spremanje komentara odbijenih artikala sa zahtjeva  
  spremi(){
    
  }
}
