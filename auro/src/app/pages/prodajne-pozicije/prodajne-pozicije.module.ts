import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NbAutocompleteModule, NbButtonModule, NbCardModule, NbDialogModule, NbIconModule, NbInputModule, NbSelectModule, NbSpinnerModule, NbTooltipModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { ProdajnePozicijeRoutingModule } from './prodajne-pozicije-routing.module';
import { ProdajnePozicijeComponent } from './prodajne-pozicije.component';
import { LayoutEditorDialogComponent } from './layout-editor-dialog/layout-editor-dialog.component';
import { DodajPozicijuModalComponent } from './dodaj-poziciju-modal/dodaj-poziciju-modal.component';
import {EditPozicijaModalComponent} from './edit-pozicije-modal.component'
import { DropdownModule } from 'primeng-lts/dropdown';


@NgModule({
  declarations: [ProdajnePozicijeComponent, LayoutEditorDialogComponent, DodajPozicijuModalComponent, EditPozicijaModalComponent],
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
    DropdownModule,
    NbAutocompleteModule,
    NbTooltipModule,
    NbDialogModule.forChild()
  ]
})
export class ProdajnePozicijeModule { }
