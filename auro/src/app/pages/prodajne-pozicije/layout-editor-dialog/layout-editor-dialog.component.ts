import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild
} from '@angular/core';
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

  private readonly defaultLayoutSize = 20;

  // scale = baseScale * zoom
  private baseScale = 1;

  // Drag/resize state
  private dragMode: 'move' | 'resize' | null = null;
  private dragIndex: number | null = null;
  private startX = 0;
  private startY = 0;
  private startPozicija?: ProdajnaPozicija;

  // Panning
  private isPanning = false;
  private panStartX = 0;
  private panStartY = 0;
  private panOriginX = 0;
  private panOriginY = 0;

  private activePointerId: number | null = null;

  panX = 0;
  panY = 0;

  isDodavanjeModalOpen = false;
  novaPozicija: NovaPozicija = this.kreirajNovuPoziciju();

  ngAfterViewInit(): void {
    console.log('🚀 Editor initialized', {
      layoutDimensions: {
        sirina: this.layout.sirina,
        duzina: this.layout.duzina
      },
      pozicijeCount: this.pozicije.length
    });

    this.ensureLayoutDimensions();
    if (this.layout.backgroundRotation == null) {
      this.layout.backgroundRotation = 0;
    }
    this.izracunajSkalu();
    this.azurirajUpozorenja();

    console.log('✅ Editor ready', {
      baseScale: this.baseScale,
      zoom: this.zoom,
      currentScale: this.getCurrentScale()
    });

    // Debug: provjeri nakon 2 sekunde koliko elemenata postoji
    setTimeout(() => {
      const items = document.querySelectorAll('.layout-item');
      const handles = document.querySelectorAll('.resize-handle');
      console.log('🔍 DEBUG: DOM elements check', {
        layoutItems: items.length,
        resizeHandles: handles.length,
        pozicijeLength: this.pozicije.length,
        prikazanePozicijeLength: this.prikazanePozicije.length
      });

      if (items.length > 0) {
        const firstItem = items[0] as HTMLElement;
        console.log('🔍 First item styles:', {
          pointerEvents: window.getComputedStyle(firstItem).pointerEvents,
          display: window.getComputedStyle(firstItem).display,
          position: window.getComputedStyle(firstItem).position,
          zIndex: window.getComputedStyle(firstItem).zIndex
        });
      }
    }, 2000);
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.izracunajSkalu();
  }

  // ============= POINTER EVENTS (SVE PREKO POINTERA) =============

  @HostListener('document:pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    if (this.activePointerId === null || event.pointerId !== this.activePointerId) {
      console.log('❌ PointerMove ignored - pointer ID mismatch', {
        activePointerId: this.activePointerId,
        eventPointerId: event.pointerId
      });
      return;
    }

    if (this.isPanning) {
      console.log('🖐️ Panning...', { panX: this.panX, panY: this.panY });
      this.panX = this.panOriginX + (event.clientX - this.panStartX);
      this.panY = this.panOriginY + (event.clientY - this.panStartY);
      return;
    }

    if (this.dragMode === null || this.dragIndex === null || !this.startPozicija) {
      console.log('❌ PointerMove ignored - no active drag', {
        dragMode: this.dragMode,
        dragIndex: this.dragIndex,
        hasStartPozicija: !!this.startPozicija
      });
      return;
    }

    const currentScale = this.getCurrentScale();
    const deltaX = (event.clientX - this.startX) / currentScale;
    const deltaY = (event.clientY - this.startY) / currentScale;

    const target = this.pozicije[this.dragIndex];

    if (this.dragMode === 'move') {
      console.log('🔵 MOVING', {
        index: this.dragIndex,
        deltaX: deltaX.toFixed(2),
        deltaY: deltaY.toFixed(2),
        newX: (this.startPozicija.pozicijaX + deltaX).toFixed(2),
        newY: (this.startPozicija.pozicijaY + deltaY).toFixed(2)
      });
      this.postaviPoziciju(target, this.startPozicija.pozicijaX + deltaX, this.startPozicija.pozicijaY + deltaY);
    } else if (this.dragMode === 'resize') {
      console.log('📏 RESIZING', {
        index: this.dragIndex,
        deltaX: deltaX.toFixed(2),
        deltaY: deltaY.toFixed(2),
        newWidth: (this.startPozicija.sirina + deltaX).toFixed(2),
        newHeight: (this.startPozicija.duzina + deltaY).toFixed(2)
      });
      this.postaviVelicinu(target, this.startPozicija.sirina + deltaX, this.startPozicija.duzina + deltaY);
    }

    this.azurirajUpozorenja();
  }

  @HostListener('document:pointerup', ['$event'])
  @HostListener('document:pointercancel', ['$event'])
  onPointerUp(event: PointerEvent): void {
    if (this.activePointerId === null || event.pointerId !== this.activePointerId) {
      console.log('❌ PointerUp ignored - pointer ID mismatch');
      return;
    }

    console.log('✅ PointerUp - cleaning up drag state', {
      dragMode: this.dragMode,
      dragIndex: this.dragIndex
    });

    this.activePointerId = null;
    this.dragMode = null;
    this.dragIndex = null;
    this.startPozicija = undefined;
    this.isPanning = false;
  }

  onPointerDown(event: PointerEvent, index: number): void {
    console.log('🟢 ITEM PointerDown START', {
      button: event.button,
      index: index,
      pointerId: event.pointerId,
      target: (event.currentTarget as HTMLElement).className
    });

    if (event.button !== 0) {
      console.log('❌ Not left button, ignoring');
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.activePointerId = event.pointerId;
    const target = event.currentTarget as HTMLElement;
    if (target && target.setPointerCapture) {
      target.setPointerCapture(event.pointerId);
      console.log('✅ Pointer capture set for MOVE', event.pointerId);
    } else {
      console.log('⚠️ Could not set pointer capture');
    }

    this.selectPozicija(index);
    this.dragMode = 'move';
    this.dragIndex = index;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startPozicija = { ...this.pozicije[index] };

    console.log('✅ MOVE mode activated', {
      dragIndex: this.dragIndex,
      startX: this.startX,
      startY: this.startY,
      startPozicija: {
        x: this.startPozicija.pozicijaX,
        y: this.startPozicija.pozicijaY,
        w: this.startPozicija.sirina,
        h: this.startPozicija.duzina
      }
    });
  }

  onResizePointerDown(event: PointerEvent, index: number): void {
    console.log('🔵 RESIZE HANDLE PointerDown START', {
      button: event.button,
      index: index,
      pointerId: event.pointerId,
      target: (event.currentTarget as HTMLElement).className
    });

    if (event.button !== 0) {
      console.log('❌ Not left button, ignoring');
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.activePointerId = event.pointerId;
    const target = event.currentTarget as HTMLElement;
    if (target && target.setPointerCapture) {
      target.setPointerCapture(event.pointerId);
      console.log('✅ Pointer capture set for RESIZE', event.pointerId);
    } else {
      console.log('⚠️ Could not set pointer capture');
    }

    this.selectPozicija(index);
    this.dragMode = 'resize';
    this.dragIndex = index;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startPozicija = { ...this.pozicije[index] };

    console.log('✅ RESIZE mode activated', {
      dragIndex: this.dragIndex,
      startX: this.startX,
      startY: this.startY,
      startPozicija: {
        x: this.startPozicija.pozicijaX,
        y: this.startPozicija.pozicijaY,
        w: this.startPozicija.sirina,
        h: this.startPozicija.duzina
      }
    });
  }

  onCanvasPointerDown(event: PointerEvent): void {
    console.log('🟡 CANVAS PointerDown', {
      button: event.button,
      pointerId: event.pointerId,
      target: (event.target as HTMLElement).className
    });

    if (event.button !== 0) {
      console.log('❌ Not left button, ignoring');
      return;
    }

    const target = event.target as HTMLElement;
    const closestItem = target.closest('.layout-item');
    const closestHandle = target.closest('.resize-handle');
    
    console.log('Checking click target:', {
      hasLayoutItem: !!closestItem,
      hasResizeHandle: !!closestHandle
    });

    if (closestItem || closestHandle) {
      console.log('❌ Click on item or handle, not panning');
      return;
    }

    event.preventDefault();

    this.activePointerId = event.pointerId;
    const canvas = event.currentTarget as HTMLElement;
    if (canvas && canvas.setPointerCapture) {
      canvas.setPointerCapture(event.pointerId);
      console.log('✅ Pointer capture set for PANNING', event.pointerId);
    } else {
      console.log('⚠️ Could not set pointer capture');
    }

    this.isPanning = true;
    this.panStartX = event.clientX;
    this.panStartY = event.clientY;
    this.panOriginX = this.panX;
    this.panOriginY = this.panY;

    console.log('✅ PANNING mode activated', {
      startX: this.panStartX,
      startY: this.panStartY
    });
  }

  // ============= CRUD / UI =============

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
    const startPozicija = this.getDefaultStartPositionForSize(tip.defaultSize.sirina, tip.defaultSize.duzina);

    const novaPoz: ProdajnaPozicija = {
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
    };

    console.log('➕ Adding new position:', novaPoz);
    this.pozicije.push(novaPoz);
    
    // Invalidiraj keš
    this._lastPozicijeLength = -1;

    this.selectedIndex = this.pozicije.length - 1;
    this.azurirajUpozorenja();
    this.isDodavanjeModalOpen = false;

    console.log('✅ Position added. Total positions:', this.pozicije.length);
    console.log('👁️ Prikazane pozicije:', this.prikazanePozicije.length);
  }

  selectPozicija(index: number): void {
    console.log('🎯 SELECT pozicija called:', index);
    this.selectedIndex = index;
  }

  obrisiPoziciju(): void {
    if (this.selectedIndex === null) return;

    this.pozicije.splice(this.selectedIndex, 1);
    this.selectedIndex = null;
    this.azurirajUpozorenja();
  }

  kopirajPoziciju(): void {
    if (this.selectedIndex === null) return;

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

  sacuvaj(): void {
    this.sacuvajLayout.emit({ layout: this.layout, pozicije: this.pozicije });
  }

  // ============= STIL / POZICIJE =============

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
    const { sirina, duzina } = this.ensureLayoutDimensions();
    return (
      pozicija.pozicijaX < 0 ||
      pozicija.pozicijaY < 0 ||
      pozicija.pozicijaX + pozicija.sirina > sirina ||
      pozicija.pozicijaY + pozicija.duzina > duzina
    );
  }

  isOverlapping(index: number): boolean {
    const current = this.pozicije[index];
    return this.pozicije.some((other, otherIndex) => {
      if (index === otherIndex) return false;
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
    const { sirina, duzina } = this.ensureLayoutDimensions();

    this.baseScale = Math.min(canvasWidth / sirina, canvasHeight / duzina);
  }

  private getCurrentScale(): number {
    return this.baseScale * this.zoom;
  }

  azurirajUpozorenja(): void {
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
    const { sirina, duzina } = this.ensureLayoutDimensions();
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
    if (!input.files || input.files.length === 0) return;

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
    this.izracunajSkalu();
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

  // Keširaj prikazane pozicije da izbjegneš Change Detection greške
  private _cachedPrikazanePozicije: Array<{ pozicija: ProdajnaPozicija; index: number }> = [];
  private _lastPozicijeLength = 0;
  private _lastDobavljaciLength = 0;
  private _lastFiltrirajUskoro = false;

  get prikazanePozicije(): Array<{ pozicija: ProdajnaPozicija; index: number }> {
    // Provjeri da li treba recalkulirati
    const needsRecalc = 
      this._lastPozicijeLength !== this.pozicije.length ||
      this._lastDobavljaciLength !== this.odabraniDobavljaci.length ||
      this._lastFiltrirajUskoro !== this.filtrirajUskoro;

    if (needsRecalc) {
      this._cachedPrikazanePozicije = this.pozicije
        .map((pozicija, index) => ({ pozicija, index }))
        .filter(({ pozicija }) => this.isPozicijaVidljiva(pozicija));
      
      this._lastPozicijeLength = this.pozicije.length;
      this._lastDobavljaciLength = this.odabraniDobavljaci.length;
      this._lastFiltrirajUskoro = this.filtrirajUskoro;
    }
    
    return this._cachedPrikazanePozicije;
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
    if (!zakupDo) return false;

    const parsed = new Date(zakupDo);
    if (Number.isNaN(parsed.getTime())) return false;

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
    if (!base) return {};
    return {
      borderColor: base.border,
      backgroundColor: base.background
    };
  }

  private getOdjelColor(zona?: string | null): { border: string; background: string } | null {
    if (!zona) return null;

    const map: Record<string, { border: string; background: string }> = {
      Pakirana: { border: '#1d4ed8', background: '#1d4ed8' },
      Svježa: { border: '#059669', background: '#059669' },
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

  private getDefaultStartPositionForSize(sirina: number, duzina: number): { x: number; y: number } {
    const layout = this.ensureLayoutDimensions();
    const maxX = Math.max(layout.sirina - sirina, 0);
    const maxY = Math.max(layout.duzina - duzina, 0);
    const x = maxX ? maxX / 2 : 0;
    const y = maxY ? maxY / 2 : 0;
    return { x, y };
  }

  private postaviPoziciju(pozicija: ProdajnaPozicija, x: number, y: number): void {
    const layout = this.ensureLayoutDimensions();
    const maxX = Math.max(layout.sirina - pozicija.sirina, 0);
    const maxY = Math.max(layout.duzina - pozicija.duzina, 0);
    pozicija.pozicijaX = this.clamp(x, 0, maxX);
    pozicija.pozicijaY = this.clamp(y, 0, maxY);
  }

  private postaviVelicinu(pozicija: ProdajnaPozicija, sirina: number, duzina: number): void {
    const layout = this.ensureLayoutDimensions();
    const maxSirina = Math.max(layout.sirina - pozicija.pozicijaX, 0.1);
    const maxDuzina = Math.max(layout.duzina - pozicija.pozicijaY, 0.1);
    pozicija.sirina = this.clamp(sirina, 0.1, maxSirina);
    pozicija.duzina = this.clamp(duzina, 0.1, maxDuzina);
  }

  private ensureLayoutDimensions(): { sirina: number; duzina: number } {
    const sirina = this.layout.sirina && this.layout.sirina > 0 ? this.layout.sirina : this.defaultLayoutSize;
    const duzina = this.layout.duzina && this.layout.duzina > 0 ? this.layout.duzina : this.defaultLayoutSize;

    if (!this.layout.sirina || this.layout.sirina <= 0) {
      this.layout.sirina = sirina;
    }
    if (!this.layout.duzina || this.layout.duzina <= 0) {
      this.layout.duzina = duzina;
    }

    return { sirina, duzina };
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  private getLabelFontSize(pozicija: ProdajnaPozicija): number {
    const minDim = Math.min(pozicija.sirina, pozicija.duzina);
    const baseSize = minDim * this.baseScale * 0.35;
    return Math.max(10, Math.min(24, baseSize));
  }

  private formatDateValue(value?: string | null): string {
    if (!value) return '-';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString('sr-BA');
  }

  private formatCurrencyValue(value?: number | null): string {
    if (value === null || value === undefined) return '-';
    return `${value.toFixed(2)} KM`;
  }
}