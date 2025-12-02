import { Component, Input, OnInit } from '@angular/core';
import { AkcijeStavkePregledComponent } from '../akcije-stavke-pregled/akcije-stavke-pregled.component';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'ngx-button-pregled-akcije',
  template: `
    <button nbButton status="primary" size="small" shape="semi-round" (click)="onClick()" id="button" nbTooltipStatus="primary"
    nbTooltip="Pregledaj stavke!" nbTooltipPlacement="top">
       <nb-icon icon="plus-circle"></nb-icon> </button>
  `,
  styles: [`
  #button{
    border-radius: 5px;
    border: none;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    transition: all 0.5s ease;
  }

  #button:hover{
    border-radius: 0px;
    transform: rotate(360deg);
    transform: scale(1.05);
    transition: all 0.5s ease;
  }
`
  ]
})
export class ButtonPregledAkcijeComponent implements OnInit {
  @Input() value;

  constructor(private dialogService: NbDialogService) { }

  ngOnInit(): void {
  }


  onClick() {
    this.dialogService.open(AkcijeStavkePregledComponent, { closeOnBackdropClick:false, hasScroll:true, closeOnEsc: true,
      context: { odabraniRed: this.value }}).onClose.subscribe(
        (podaci) => {
        //  this.save.emit(podaci);
        });
  }
}
