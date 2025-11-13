import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import Swal from 'sweetalert2';

@Component({
  selector: 'ngx-datum-inv',
  templateUrl: './datum-inv.component.html',
  styleUrls: ['./datum-inv.component.scss']
})
export class DatumInvComponent implements OnInit {
  brDana: number = 1;
  brSati: number = 0;
  brMinuta: number = 0;
  uposlenik: string;

  @Input() korisnik;

  constructor(protected dialogRef: NbDialogRef<DatumInvComponent>) { }

  ngOnInit(): void {
    this.uposlenik = this.korisnik;
  }

  //Funkacija za spremanje unosa korisnika
  spremi(){
    if(this.brSati < 0){
      Swal.fire('Greška!', 'Broj sati ne može biti negativan broj!', 'error');
      return;
    }    
    if(this.brSati == 0){
      Swal.fire('Greška!', 'Broj sati ne može biti nula!', 'error');
      return;
    }
    else if(this.brSati > 50){
      Swal.fire('Greška!', 'Uneseni broj sati je prevelik. Pokušajte ponovo.', 'error');
      return;
    }
    else if(!this.isValid()){
      Swal.fire('Greška!', 'Uneseni broj minuta mora biti cijeli broj. Pokušajte ponovo.', 'error');
      return;
    }    
    else if(!this.isValidBrojSati()){
      Swal.fire('Greška!', 'Uneseni broj sati mora biti cijeli broj. Pokušajte ponovo.', 'error');
      return;
    }
    else {
      const podaci = {brojDana: this.izracunajDane(this.brSati), brojSati: this.brSati, brojMinuta: this.brMinuta}
      this.dialogRef.close(podaci);
    }
  }  
  
  //Funkcija za zatvaranje modal-a
  zatvoriModal(){
    this.dialogRef.close();
  }

  // Funkcija za provjeru validnosti
  isValidBrojSati(): boolean {
    return Number.isInteger(this.brSati) && this.brSati >= 0;
  } 
   
  // Funkcija za provjeru validnosti
  isValid(): boolean {
    // Provjerava da li je brMinuta cijeli broj i veći ili jednak nuli
    return Number.isInteger(this.brMinuta) && this.brMinuta >= 0;
  }

  //Funkacija za racunanje broja dana koje je uposlenik proveo na inventuri (dani se racunaju na osnovu sati koje korisnik unese)
  izracunajDane(sati: number): number {
    // Ako je broj sati manji ili jednak 24, vraća se 1 dan
    if (sati <= 24) {
      return 1;
    }
    // Računanje broja dana na osnovu 24 sata po danu
    const citavDan = Math.floor(sati / 24);
    // Ako postoji višak sati koji nisu dio punog bloka od 24 sata, dodaje se još jedan dan
    const dodatniDani = sati % 24 > 0 ? 1 : 0;
    // Ukupan broj dana
    return citavDan + dodatniDani;
  }

}
