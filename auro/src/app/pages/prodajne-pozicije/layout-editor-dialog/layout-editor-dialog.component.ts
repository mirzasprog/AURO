import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { ProdajnaPozicija, ProdajniLayout } from '../../../@core/data/prodajne-pozicije';

interface ProdajniTip {
  value: string;
  label: string;
  defaultSize: { sirina: number; duzina: number };
}

@Component({
  selector: 'ngx-layout-editor-dialog',
  templateUrl: './layout-editor-dialog.component.html',
  styleUrls: ['./layout-editor-dialog.component.scss']
})
export class LayoutEditorDialogComponent implements AfterViewInit {
  @Input() layout!: ProdajniLayout;
  @Input() pozicije: ProdajnaPozicija[] = [];

  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLDivElement>;

  tipovi: ProdajniTip[] = [
    { value: 'vitrina', label: 'Vitrina', defaultSize: { sirina: 2, duzina: 1 } },
    { value: 'frizider', label: 'Frižider', defaultSize: { sirina: 1, duzina: 1 } },
    { value: 'regal', label: 'Regal', defaultSize: { sirina: 3, duzina: 1 } },
    { value: 'kasa', label: 'Kasa', defaultSize: { sirina: 1.5, duzina: 1 } },
    { value: 'paletno_mjesto', label: 'Paletno mjesto', defaultSize: { sirina: 1.2, duzina: 1 } },
    { value: 'promotivna_pozicija', label: 'Promotivna/ostrvska pozicija', defaultSize: { sirina: 2, duzina: 2 } }
  ];

  odabraniTip = this.tipovi[0];
  selectedIndex: number | null = null;
  warnings: string[] = [];

  private scale = 1;
  private dragMode: 'move' | 'resize' | null = null;
  private dragIndex: number | null = null;
  private startX = 0;
  private startY = 0;
  private startPozicija?: ProdajnaPozicija;

  constructor(private readonly dialogRef: NbDialogRef<LayoutEditorDialogComponent>) {}

  ngAfterViewInit(): void {
    this.izracunajSkalu();
    this.azurirajUpozorenja();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.izracunajSkalu();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.dragMode === null || this.dragIndex === null || !this.startPozicija) {
      return;
    }

    const deltaX = (event.clientX - this.startX) / this.scale;
    const deltaY = (event.clientY - this.startY) / this.scale;
    const target = this.pozicije[this.dragIndex];

    if (this.dragMode === 'move') {
      target.pozicijaX = this.startPozicija.pozicijaX + deltaX;
      target.pozicijaY = this.startPozicija.pozicijaY + deltaY;
    } else if (this.dragMode === 'resize') {
      target.sirina = Math.max(0.1, this.startPozicija.sirina + deltaX);
      target.duzina = Math.max(0.1, this.startPozicija.duzina + deltaY);
    }

    this.azurirajUpozorenja();
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    this.dragMode = null;
    this.dragIndex = null;
    this.startPozicija = undefined;
  }

  dodajObjekat(): void {
    const index = this.pozicije.length + 1;
    this.pozicije.push({
      tip: this.odabraniTip.value,
      naziv: `${this.odabraniTip.label} ${index}`,
      sirina: this.odabraniTip.defaultSize.sirina,
      duzina: this.odabraniTip.defaultSize.duzina,
      pozicijaX: 0,
      pozicijaY: 0,
      rotacija: 0,
      zona: ''
    });
    this.selectedIndex = this.pozicije.length - 1;
    this.azurirajUpozorenja();
  }

  selectPozicija(index: number): void {
    this.selectedIndex = index;
  }

  obrisiPoziciju(): void {
    if (this.selectedIndex === null) {
      return;
    }

    this.pozicije.splice(this.selectedIndex, 1);
    this.selectedIndex = null;
    this.azurirajUpozorenja();
  }

  onMouseDown(event: MouseEvent, index: number): void {
    event.preventDefault();
    event.stopPropagation();
    this.selectPozicija(index);
    this.dragMode = 'move';
    this.dragIndex = index;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startPozicija = { ...this.pozicije[index] };
  }

  onResizeMouseDown(event: MouseEvent, index: number): void {
    event.preventDefault();
    event.stopPropagation();
    this.selectPozicija(index);
    this.dragMode = 'resize';
    this.dragIndex = index;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startPozicija = { ...this.pozicije[index] };
  }

  sacuvaj(): void {
    this.dialogRef.close({
      layout: this.layout,
      pozicije: this.pozicije
    });
  }

  zatvori(): void {
    this.dialogRef.close();
  }

  getStyle(pozicija: ProdajnaPozicija): Record<string, string> {
    return {
      width: `${pozicija.sirina * this.scale}px`,
      height: `${pozicija.duzina * this.scale}px`,
      transform: `rotate(${pozicija.rotacija}deg)`
    };
  }

  getPosition(pozicija: ProdajnaPozicija): Record<string, string> {
    return {
      left: `${pozicija.pozicijaX * this.scale}px`,
      top: `${pozicija.pozicijaY * this.scale}px`
    };
  }

  isOutOfBounds(pozicija: ProdajnaPozicija): boolean {
    return (
      pozicija.pozicijaX < 0 ||
      pozicija.pozicijaY < 0 ||
      pozicija.pozicijaX + pozicija.sirina > this.layout.sirina ||
      pozicija.pozicijaY + pozicija.duzina > this.layout.duzina
    );
  }

  isOverlapping(index: number): boolean {
    const current = this.pozicije[index];
    return this.pozicije.some((other, otherIndex) => {
      if (index === otherIndex) {
        return false;
      }

      return this.rectsOverlap(current, other);
    });
  }

  private rectsOverlap(a: ProdajnaPozicija, b: ProdajnaPozicija): boolean {
    return (
      a.pozicijaX < b.pozicijaX + b.sirina &&
      a.pozicijaX + a.sirina > b.pozicijaX &&
      a.pozicijaY < b.pozicijaY + b.duzina &&
      a.pozicijaY + a.duzina > b.pozicijaY
    );
  }

  private izracunajSkalu(): void {
    const canvasWidth = this.canvasRef.nativeElement.clientWidth;
    const canvasHeight = this.canvasRef.nativeElement.clientHeight;
    const sirina = this.layout.sirina || 1;
    const duzina = this.layout.duzina || 1;
    this.scale = Math.min(canvasWidth / sirina, canvasHeight / duzina);
  }

  azurirajUpozorenja(): void {
    this.izracunajSkalu();
    const warnings: string[] = [];
    this.pozicije.forEach((pozicija, index) => {
      if (this.isOutOfBounds(pozicija)) {
        warnings.push(`Objekat "${pozicija.naziv}" izlazi iz granica prodavnice.`);
      }

      if (this.isOverlapping(index)) {
        warnings.push(`Objekat "${pozicija.naziv}" se preklapa sa drugim objektom.`);
      }
    });
    this.warnings = warnings;
  }
}
