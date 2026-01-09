import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { ProdajnaPozicija, ProdajniLayout } from '../../../@core/data/prodajne-pozicije';

interface ProdajniTip {
  value: string;
  label: string;
  defaultSize: { sirina: number; duzina: number };
}

interface NovaPozicija {
  tip: string;
  naziv: string;
  brojPozicije: string;
  zona: string;
}

@Component({
  selector: 'ngx-layout-editor-dialog',
  templateUrl: './layout-editor-dialog.component.html',
  styleUrls: ['./layout-editor-dialog.component.scss']
})
export class LayoutEditorDialogComponent implements AfterViewInit {
  @Input() layout!: ProdajniLayout;
  @Input() pozicije: ProdajnaPozicija[] = [];
  @Output() sacuvajLayout = new EventEmitter<{ layout: ProdajniLayout; pozicije: ProdajnaPozicija[] }>();

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
  odjeli = [
    'Pakirana',
    'Svježa',
    'Neprehrana 1',
    'Neprehrana 2',
    'Delikates',
    'Gastro',
    'Piće i grickalice',
    'Voće i povrće',
    'Mesnica',
    'Cigarete i duhanski proizvodi'
  ];
  odabraniDobavljaci: string[] = [];
  filtrirajUskoro = false;
  pragDanaIsteka = 30;

  private scale = 1;
  private baseScale = 1;
  private dragMode: 'move' | 'resize' | null = null;
  private dragIndex: number | null = null;
  private startX = 0;
  private startY = 0;
  private startPozicija?: ProdajnaPozicija;
  private isPanning = false;
  private panStartX = 0;
  private panStartY = 0;
  private panOriginX = 0;
  private panOriginY = 0;

  panX = 0;
  panY = 0;

  isDodavanjeModalOpen = false;
  novaPozicija: NovaPozicija = this.kreirajNovuPoziciju();

  ngAfterViewInit(): void {
    if (this.layout.backgroundRotation == null) {
      this.layout.backgroundRotation = 0;
    }
    this.izracunajSkalu();
    this.azurirajUpozorenja();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.izracunajSkalu();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isPanning) {
      this.panX = this.panOriginX + (event.clientX - this.panStartX);
      this.panY = this.panOriginY + (event.clientY - this.panStartY);
      return;
    }

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
    this.isPanning = false;
  }

  otvoriModalZaDodavanje(): void {
    this.novaPozicija = this.kreirajNovuPoziciju();
    this.isDodavanjeModalOpen = true;
  }

  zatvoriModalZaDodavanje(): void {
    this.isDodavanjeModalOpen = false;
  }

  potvrdiDodavanje(): void {
    const index = this.pozicije.length + 1;
    const tip = this.tipovi.find((item) => item.value === this.novaPozicija.tip) ?? this.tipovi[0];
    const startPozicija = this.getDefaultStartPosition();
    this.pozicije.push({
      tip: this.novaPozicija.tip,
      naziv: this.novaPozicija.naziv || `${this.getTipLabel(this.novaPozicija.tip)} ${index}`,
      brojPozicije: this.novaPozicija.brojPozicije || `P${index.toString().padStart(3, '0')}`,
      sirina: tip.defaultSize.sirina,
      duzina: tip.defaultSize.duzina,
      pozicijaX: startPozicija.x,
      pozicijaY: startPozicija.y,
      rotacija: 0,
      zona: this.novaPozicija.zona,
      trgovac: '',
      zakupDo: null,
      vrijednostZakupa: null,
      vrstaUgovora: 'Nije postavljeno',
      tipPozicije: 'Nije postavljeno'
    });
    this.selectedIndex = this.pozicije.length - 1;
    this.azurirajUpozorenja();
    this.isDodavanjeModalOpen = false;
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
    event.stopPropagation();
    this.selectPozicija(index);
    this.dragMode = 'move';
    this.dragIndex = index;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startPozicija = { ...this.pozicije[index] };
  }

  onResizeMouseDown(event: MouseEvent, index: number): void {
    event.stopPropagation();
    this.selectPozicija(index);
    this.dragMode = 'resize';
    this.dragIndex = index;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startPozicija = { ...this.pozicije[index] };
  }

  onCanvasMouseDown(event: MouseEvent): void {
    if ((event.target as HTMLElement).closest('.layout-item')) {
      return;
    }
    event.preventDefault();
    this.isPanning = true;
    this.panStartX = event.clientX;
    this.panStartY = event.clientY;
    this.panOriginX = this.panX;
    this.panOriginY = this.panY;
  }

  sacuvaj(): void {
    this.sacuvajLayout.emit({
      layout: this.layout,
      pozicije: this.pozicije
    });
  }

  getStyle(pozicija: ProdajnaPozicija): Record<string, string> {
    return {
      width: `${pozicija.sirina * this.baseScale}px`,
      height: `${pozicija.duzina * this.baseScale}px`,
      transform: `rotate(${pozicija.rotacija}deg)`
    };
  }

  getPosition(pozicija: ProdajnaPozicija): Record<string, string> {
    return {
      left: `${pozicija.pozicijaX * this.baseScale}px`,
      top: `${pozicija.pozicijaY * this.baseScale}px`
    };
  }

  getPozicijaStyle(pozicija: ProdajnaPozicija): Record<string, string> {
    return {
      ...this.getPosition(pozicija),
      ...this.getStyle(pozicija),
      ...this.getTipColorStyle(pozicija),
      '--label-size': `${this.getLabelFontSize(pozicija)}px`
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
    const sirina = this.layout.sirina || 1;
    const duzina = this.layout.duzina || 1;
    return {
      width: `${sirina * this.baseScale}px`,
      height: `${duzina * this.baseScale}px`,
      transform: `scale(${this.zoom})`,
      transformOrigin: 'top left'
    };
  }

  getPanStyle(): Record<string, string> {
    return {
      transform: `translate(${this.panX}px, ${this.panY}px)`
    };
  }

  getBackgroundStyle(): Record<string, string> {
    const rotation = this.layout.backgroundRotation ?? 0;
    return {
      backgroundImage: `url(${this.layout.backgroundData})`,
      transform: `rotate(${rotation}deg)`,
      transformOrigin: 'center'
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
      this.layout.backgroundRotation = 0;
      this.izracunajSkalu();
    };
    reader.readAsDataURL(file);
  }

  ukloniPodlogu(): void {
    this.layout.backgroundData = null;
    this.layout.backgroundFileName = null;
    this.layout.backgroundContentType = null;
    this.layout.backgroundRotation = 0;
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

  getPozicijaTooltip(pozicija: ProdajnaPozicija): string {
    const status = pozicija.trgovac ? `Zauzeta (${pozicija.trgovac})` : 'Slobodna';
    const lines = [
      `${this.getPozicijaLabel(pozicija)}${pozicija.naziv ? ` — ${pozicija.naziv}` : ''}`,
      `Status: ${status}`,
      `Odjel: ${pozicija.zona || 'Nije postavljeno'}`,
      `Vrsta ugovora: ${pozicija.vrstaUgovora || 'Nije postavljeno'}`,
      `Tip pozicije: ${pozicija.tipPozicije || 'Nije postavljeno'}`,
      `Zakup do: ${this.formatDateValue(pozicija.zakupDo)}`,
      `Vrijednost zakupa: ${this.formatCurrencyValue(pozicija.vrijednostZakupa)}`
    ];

    return lines.join('\n');
  }

  get dostupniDobavljaci(): string[] {
    const set = new Set(
      this.pozicije
        .map((pozicija) => pozicija.trgovac?.trim())
        .filter((trgovac): trgovac is string => Boolean(trgovac))
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }

  get prikazanePozicije(): Array<{ pozicija: ProdajnaPozicija; index: number }> {
    return this.pozicije
      .map((pozicija, index) => ({ pozicija, index }))
      .filter(({ pozicija }) => this.isPozicijaVidljiva(pozicija));
  }

  private isPozicijaVidljiva(pozicija: ProdajnaPozicija): boolean {
    if (this.odabraniDobavljaci.length) {
      if (!pozicija.trgovac || !this.odabraniDobavljaci.includes(pozicija.trgovac)) {
        return false;
      }
    }

    if (this.filtrirajUskoro) {
      return this.jeUgovorUskoro(pozicija.zakupDo);
    }

    return true;
  }

  private jeUgovorUskoro(zakupDo?: string | null): boolean {
    if (!zakupDo) {
      return false;
    }

    const parsed = new Date(zakupDo);
    if (Number.isNaN(parsed.getTime())) {
      return false;
    }

    const granica = new Date();
    granica.setDate(granica.getDate() + this.pragDanaIsteka);
    return parsed <= granica;
  }

  rotirajPodlogu(delta: number): void {
    const trenutna = this.layout.backgroundRotation ?? 0;
    this.layout.backgroundRotation = Math.max(-180, Math.min(180, trenutna + delta));
  }

  private kreirajNovuPoziciju(): NovaPozicija {
    const index = this.pozicije.length + 1;
    const tip = this.odabraniTip.value;
    return {
      tip,
      naziv: `${this.odabraniTip.label} ${index}`,
      brojPozicije: `P${index.toString().padStart(3, '0')}`,
      zona: ''
    };
  }

  private getTipLabel(value: string): string {
    return this.tipovi.find((item) => item.value === value)?.label ?? 'Pozicija';
  }

  private getTipColorStyle(pozicija: ProdajnaPozicija): Record<string, string> {
    const base = this.getOdjelColor(pozicija.zona);
    if (!base) {
      return {};
    }
    return {
      borderColor: base.border,
      backgroundColor: base.background
    };
  }

  private getOdjelColor(zona?: string | null): { border: string; background: string } | null {
    if (!zona) {
      return null;
    }

    const map: Record<string, { border: string; background: string }> = {
      Pakirana: { border: '#1d4ed8', background: '#1d4ed8' },
      'Svježa': { border: '#059669', background: '#059669' },
      'Neprehrana 1': { border: '#d97706', background: '#d97706' },
      'Neprehrana 2': { border: '#c2410c', background: '#c2410c' },
      Delikates: { border: '#7c3aed', background: '#7c3aed' },
      Gastro: { border: '#0f766e', background: '#0f766e' },
      'Piće i grickalice': { border: '#be123c', background: '#be123c' },
      'Voće i povrće': { border: '#15803d', background: '#15803d' },
      Mesnica: { border: '#9f1239', background: '#9f1239' },
      'Cigarete i duhanski proizvodi': { border: '#334155', background: '#334155' }
    };

    return map[zona] ?? null;
  }

  private getDefaultStartPosition(): { x: number; y: number } {
    return { x: 0, y: 0 };
  }

  private getLabelFontSize(pozicija: ProdajnaPozicija): number {
    const minDim = Math.min(pozicija.sirina, pozicija.duzina);
    const baseSize = minDim * this.baseScale * 0.35;
    return Math.max(10, Math.min(24, baseSize));
  }

  private formatDateValue(value?: string | null): string {
    if (!value) {
      return '-';
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }
    return parsed.toLocaleDateString('sr-BA');
  }

  private formatCurrencyValue(value?: number | null): string {
    if (value === null || value === undefined) {
      return '-';
    }
    return `${value.toFixed(2)} KM`;
  }
}
