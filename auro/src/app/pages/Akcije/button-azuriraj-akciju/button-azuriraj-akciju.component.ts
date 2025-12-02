import { Component, Input, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { AkcijeStavkeComponent } from '../akcije-stavke/akcije-stavke.component';

@Component({
  selector: 'ngx-button-azuriraj-akciju',
  template: `
    <button nbButton status="warning" size="small" shape="semi-round" (click)="onClick()" id="button" nbTooltipStatus="warning"
      nbTooltip="Ažuriraj stavke" nbTooltipPlacement="top">
        <nb-icon icon="edit-2"></nb-icon>
    </button>
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
`]
})
export class ButtonAzurirajAkcijuComponent implements OnInit {
  @Input() value;

  constructor(private dialogService: NbDialogService) { }

  ngOnInit(): void {
  }

  onClick() {
    this.dialogService.open(AkcijeStavkeComponent, { closeOnBackdropClick:false, hasScroll:true, closeOnEsc: true,
      context: { odabraniRed: this.value }});
  }
}
