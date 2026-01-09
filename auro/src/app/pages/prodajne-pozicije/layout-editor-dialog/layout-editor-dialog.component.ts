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
  @ViewChild('backgroundInput', { static: false }) backgroundInputRef?: ElementRef<HTMLInputElement>;

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

  zoom = 1;
  minZoom = 0.4;
  maxZoom = 2;

  vrsteUgovora = ['Nije postavljeno', 'Mjesečni', 'Godišnji', 'Sezonski'];
  tipoviPozicije = ['Nije postavljeno', 'Oprema', 'Promo', 'Standard', 'Specijal'];

  private scale = 1;
  private baseScale = 1;
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
      brojPozicije: `P${index.toString().padStart(3, '0')}`,
      sirina: this.odabraniTip.defaultSize.sirina,
      duzina: this.odabraniTip.defaultSize.duzina,
      pozicijaX: 0,
      pozicijaY: 0,
      rotacija: 0,
      zona: '',
      trgovac: '',
      zakupDo: null,
      vrijednostZakupa: null,
      vrstaUgovora: 'Nije postavljeno',
      tipPozicije: 'Nije postavljeno'
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

  kopirajPoziciju(): void {
    if (this.selectedIndex === null) {
      return;
    }

    const original = this.pozicije[this.selectedIndex];
    const copyIndex = this.pozicije.length + 1;
    const kopija: ProdajnaPozicija = {
      ...original,
      id: undefined,
      naziv: `${original.naziv} (kopija)`,
      brojPozicije: original.brojPozicije
        ? `${original.brojPozicije}-K${copyIndex}`
        : `P${copyIndex.toString().padStart(3, '0')}`,
      pozicijaX: original.pozicijaX + 0.5,
      pozicijaY: original.pozicijaY + 0.5
    };
    this.pozicije.push(kopija);
    this.selectedIndex = this.pozicije.length - 1;
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

  getPozicijaStyle(pozicija: ProdajnaPozicija): Record<string, string> {
    return {
      ...this.getPosition(pozicija),
      ...this.getStyle(pozicija)
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
    this.baseScale = Math.min(canvasWidth / sirina, canvasHeight / duzina);
    this.scale = this.baseScale * this.zoom;
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

  getCanvasStyle(): Record<string, string> {
    if (!this.layout.backgroundData || !this.isImageBackground()) {
      return {};
    }

    return {
      backgroundImage: `url(${this.layout.backgroundData})`,
      backgroundSize: '100% 100%',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    };
  }

  onZoomChange(value: number): void {
    this.zoom = Number(value);
    this.izracunajSkalu();
  }

  zoomIn(): void {
    this.zoom = Math.min(this.maxZoom, Math.round((this.zoom + 0.1) * 10) / 10);
    this.izracunajSkalu();
  }

  zoomOut(): void {
    this.zoom = Math.max(this.minZoom, Math.round((this.zoom - 0.1) * 10) / 10);
    this.izracunajSkalu();
  }

  triggerBackgroundUpload(): void {
    this.backgroundInputRef?.nativeElement.click();
  }

  onBackgroundSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/pjpeg', 'application/acad', 'image/vnd.dwg', 'application/dwg'];
    const extension = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'dwg'];

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(extension ?? '')) {
      this.warnings = ['Podržani formati su JPEG ili DWG.'];
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.layout.backgroundData = reader.result as string;
      this.layout.backgroundFileName = file.name;
      this.layout.backgroundContentType = file.type || (extension ? `application/${extension}` : '');
      this.izracunajSkalu();
    };
    reader.readAsDataURL(file);
  }

  ukloniPodlogu(): void {
    this.layout.backgroundData = null;
    this.layout.backgroundFileName = null;
    this.layout.backgroundContentType = null;
    if (this.backgroundInputRef) {
      this.backgroundInputRef.nativeElement.value = '';
    }
  }

  isImageBackground(): boolean {
    const contentType = this.layout.backgroundContentType ?? '';
    const data = this.layout.backgroundData ?? '';
    return contentType.startsWith('image/') || data.startsWith('data:image');
  }

  getPozicijaLabel(pozicija: ProdajnaPozicija): string {
    return pozicija.brojPozicije || pozicija.naziv;
  }
}
