import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-pregled-prodavnica-inventura',
  templateUrl: './pregled-prodavnica-inventura.component.html',
  styleUrls: ['./pregled-prodavnica-inventura.component.scss']
})
export class PregledProdavnicaInventuraComponent implements OnInit {
  @Input() podaci = [];

  constructor(protected dialogRef: NbDialogRef<PregledProdavnicaInventuraComponent>) { }

  ngOnInit(): void {
  this.podaci.forEach(element => {
  //  console.log("Podaci: " + element);
  });
  }

  //Funkcija za zatvaranje modal-a
  zatvoriModal() {
    this.dialogRef.close();
  }

}
