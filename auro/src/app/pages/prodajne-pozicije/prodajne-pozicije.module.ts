import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbDialogModule, NbIconModule, NbInputModule, NbSelectModule, NbSpinnerModule, NbTooltipModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { ProdajnePozicijeRoutingModule } from './prodajne-pozicije-routing.module';
import { ProdajnePozicijeComponent } from './prodajne-pozicije.component';
import { LayoutEditorDialogComponent } from './layout-editor-dialog/layout-editor-dialog.component';

@NgModule({
  declarations: [ProdajnePozicijeComponent, LayoutEditorDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ThemeModule,
    ProdajnePozicijeRoutingModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbInputModule,
    NbSelectModule,
    NbSpinnerModule,
    NbTooltipModule,
    NbDialogModule.forChild()
  ]
})
export class ProdajnePozicijeModule { }
