import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NbBadgeModule, NbButtonModule, NbCardModule, NbDialogModule, NbIconModule, NbInputModule, NbSpinnerModule, NbTooltipModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { VikendAkcijeRoutingModule } from './vikend-akcije-routing.module';
import { VikendAkcijeComponent } from './vikend-akcije.component';
import { VikendAkcijeStavkeComponent } from './vikend-akcije-stavke/vikend-akcije-stavke.component';
import { VikendAkcijeStavkePregledComponent } from './vikend-akcije-stavke-pregled/vikend-akcije-stavke-pregled.component';

@NgModule({
  declarations: [VikendAkcijeComponent, VikendAkcijeStavkeComponent, VikendAkcijeStavkePregledComponent],
  imports: [
    CommonModule,
    FormsModule,
    ThemeModule,
    VikendAkcijeRoutingModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbInputModule,
    NbSpinnerModule,
    NbBadgeModule,
    NbTooltipModule,
    NbDialogModule.forChild()
  ]
})
export class VikendAkcijeModule { }
