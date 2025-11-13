import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-button-akcija',
  template: `
    <div class="row">
      <div class="col">
      <button style="float:inline-start" nbButton size="small" id="button" status="success">
      <nb-icon icon="checkmark-square-2"> </nb-icon>
      </button>
      </div>
      <div class="col">
        <button style="float:inline-end" nbButton size="small" id="button" status="danger">
          <nb-icon icon="close-square"> </nb-icon>
        </button>
      </div>

    </div>
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
export class ButtonAkcijaComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
