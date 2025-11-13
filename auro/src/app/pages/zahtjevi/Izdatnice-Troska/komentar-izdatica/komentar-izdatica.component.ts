import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-komentar-izdatica',
  templateUrl: './komentar-izdatica.component.html',
  styleUrls: ['./komentar-izdatica.component.scss']
})
export class KomentarIzdaticaComponent implements OnInit {
//unos korinika
unos={
  komentar:""
}
constructor() { }

ngOnInit(): void {
}
//Funkcija za spremanje komentara odbijanja redovnog otpisa 
spremi(){
  
}
}
