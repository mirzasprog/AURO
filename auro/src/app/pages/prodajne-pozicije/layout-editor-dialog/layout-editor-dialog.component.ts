import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { ProdajnaPozicija, ProdajniLayout } from '../../../@core/data/prodajne-pozicije';
import { NbDialogService } from '@nebular/theme';
import { DodajPozicijuModalComponent } from '../dodaj-poziciju-modal/dodaj-poziciju-modal.component';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

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
  @Output() sacuvajLayout = new EventEmitter<{ layout: ProdajniLayout; pozicije: ProdajnaPozicija[] }>();
  private destroy$ = new Subject<void>();
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLDivElement>;
  @ViewChild('backgroundInput', { static: false }) backgroundInputRef?: ElementRef<HTMLInputElement>;
  rola = '';
  constructor(
    private readonly dialogService: NbDialogService,
    private readonly authService: NbAuthService
  ) {
        this.authService.onTokenChange()
          .pipe(takeUntil(this.destroy$))
          .subscribe((token: NbAuthJWTToken) => {
            if (token.isValid()) {
              const payload = token.getPayload();
              this.rola = payload["role"];

            } 
           
          });
  }

  tipovi: ProdajniTip[] = [
    { value: 'paletno_mjesto', label: 'Paletno mjesto', defaultSize: { sirina: 1.2, duzina: 1 } },
    { value: 'promotivna_pozicija', label: 'Promotivna/ostrvska pozicija', defaultSize: { sirina: 2, duzina: 2 } },
    { value: 'bocna_polica', label: 'Bočna polica', defaultSize: { sirina: 2, duzina: 2 } },
    { value: 'bok_na_bok', label: 'Bok na bok', defaultSize: { sirina: 2, duzina: 2 } },
    { value: 'cm_kosara', label: 'CM košara', defaultSize: { sirina: 2, duzina: 2 } },
    { value: 'dp_alu', label: 'DP-alu', defaultSize: { sirina: 2, duzina: 2 } },
    { value: 'frizider_dd', label: 'Frižider DD', defaultSize: { sirina: 2, duzina: 2 } },
    { value: 'frizider_ot', label: 'Frižider OT', defaultSize: { sirina: 2, duzina: 2 } },
    { value: 'frizider_sd', label: 'Frižider SD', defaultSize: { sirina: 2, duzina: 2 } },
    { value: 'frizider', label: 'Frižider', defaultSize: { sirina: 2, duzina: 2 } },
    { value: 'kosara', label: 'Košara', defaultSize: { sirina: 2, duzina: 2 } },
    { value: 'paleta', label: 'Paleta', defaultSize: { sirina: 2, duzina: 2 } },
    { value: 'parazit', label: 'Parazit', defaultSize: { sirina: 2, duzina: 2 } },
    { value: 'plug_in', label: 'Plug in', defaultSize: { sirina: 2, duzina: 2 } },
    { value: 'stalak', label: 'Stalak', defaultSize: { sirina: 2, duzina: 2 } },
    { value: 'stalak_mini', label: 'Stalak mini', defaultSize: { sirina: 2, duzina: 2 } },
  ];

  selectedIndex: number | null = null;
  warnings: string[] = [];

  zoom = 1;
  minZoom = 0.4;
  maxZoom = 3;

  vrsteUgovora = ['Nije postavljeno', 'Mjesečni', 'Godišnji', 'Sezonski'];
  tipoviPozicije = ['Nije postavljeno', 'Oprema', 'Promo', 'Standard', 'Specijal', '500+'];
  odjeli = [
    'Pakirana', 'Svježa', 'Neprehrana 1', 'Neprehrana 2', 'Delikates', 'Gastro',
    'Piće i grickalice', 'Voće i povrće', 'Mesnica', 'Cigarete i duhanski proizvodi',
    'Neprehrana svježa', 'Neprehrana prehrana', 'Neprehrana prehrana svježa', 'Prehrana svježa'
  ];

  // Filteri
  showFilters = false;
  filterBrojPozicije = '';
  filterTrgovci: string[] = [];
  filterOdjeli: string[] = [];
  filterTipovi: string[] = [];
  filterIsticeUskoro = false;
  filterSamoSlobodne = false;
  pragDanaIsteka = 60;
  odabraniDobavljaci: string[] = [];
  filtrirajUskoro = false;

  private readonly defaultLayoutSize = 20;
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
  private backgroundNaturalSize: { width: number; height: number } | null = null;

  panX = 0;
  panY = 0;

  ngAfterViewInit(): void {
    this.ensureLayoutDimensions();
    if (this.layout.backgroundRotation == null) {
      this.layout.backgroundRotation = 0;
    }
    this.izracunajSkalu();
    if (this.layout.backgroundData && this.isImageBackground()) {
      this.loadBackgroundImageDimensions(this.layout.backgroundData);
    }
    this.azurirajUpozorenja();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.izracunajSkalu();
  }

  @HostListener('document:pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    if (this.activePointerId === null || event.pointerId !== this.activePointerId) return;

    if (this.isPanning) {
      this.panX = this.panOriginX + (event.clientX - this.panStartX);
      this.panY = this.panOriginY + (event.clientY - this.panStartY);
      return;
    }

    if (this.dragMode === null || this.dragIndex === null || !this.startPozicija) return;

    const currentScale = this.getCurrentScale();
    const deltaX = (event.clientX - this.startX) / currentScale;
    const deltaY = (event.clientY - this.startY) / currentScale;
    const target = this.pozicije[this.dragIndex];

    if (this.dragMode === 'move') {
      this.postaviPoziciju(target, this.startPozicija.pozicijaX + deltaX, this.startPozicija.pozicijaY + deltaY);
    } else if (this.dragMode === 'resize') {
      this.postaviVelicinu(target, this.startPozicija.sirina + deltaX, this.startPozicija.duzina + deltaY);
    }

    this.azurirajUpozorenja();
  }

  @HostListener('document:pointerup', ['$event'])
  @HostListener('document:pointercancel', ['$event'])
  onPointerUp(event: PointerEvent): void {
    if (this.activePointerId === null || event.pointerId !== this.activePointerId) return;
    this.activePointerId = null;
    this.dragMode = null;
    this.dragIndex = null;
    this.startPozicija = undefined;
    this.isPanning = false;
  }

  onPointerDown(event: PointerEvent, index: number): void {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    this.activePointerId = event.pointerId;
    const target = event.currentTarget as HTMLElement;
    if (target && target.setPointerCapture) target.setPointerCapture(event.pointerId);

    this.selectPozicija(index);
    this.dragMode = 'move';
    this.dragIndex = index;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startPozicija = { ...this.pozicije[index] };
  }

  onResizePointerDown(event: PointerEvent, index: number): void {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    this.activePointerId = event.pointerId;
    const target = event.currentTarget as HTMLElement;
    if (target && target.setPointerCapture) target.setPointerCapture(event.pointerId);

    this.selectPozicija(index);
    this.dragMode = 'resize';
    this.dragIndex = index;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startPozicija = { ...this.pozicije[index] };
  }

  onCanvasPointerDown(event: PointerEvent): void {
    if (event.button !== 0) return;
    const target = event.target as HTMLElement;
    if (target.closest('.layout-item') || target.closest('.resize-handle')) return;

    event.preventDefault();
    this.activePointerId = event.pointerId;
    const canvas = event.currentTarget as HTMLElement;
    if (canvas && canvas.setPointerCapture) canvas.setPointerCapture(event.pointerId);

    this.isPanning = true;
    this.panStartX = event.clientX;
    this.panStartY = event.clientY;
    this.panOriginX = this.panX;
    this.panOriginY = this.panY;
  }

  // KRITIČNO: Ispravljeno dodavanje pozicije
  otvoriModalZaDodavanje(): void {
    this.dialogService.open(DodajPozicijuModalComponent, {
      context: {
        layout: this.layout,
        postojecePozicije: this.pozicije
      },
      closeOnBackdropClick: false,
      closeOnEsc: true
    }).onClose.subscribe((novaPozicija: ProdajnaPozicija | null) => {
      if (novaPozicija) {
        // KRITIČNO: Dodaj u listu pozicija
        this.pozicije.push(novaPozicija);
        // Selektuj novu poziciju
        this.selectedIndex = this.pozicije.length - 1;
        // Ažuriraj upozorenja
        this.azurirajUpozorenja();
        // Resetuj cache za prikazane pozicije
        this._lastPozicijeLength = -1;
      }
    });
  }

    // NOVO: Funkcija za editovanje pozicije duplim klikom
  otvoriModalZaEditovanje(index: number): void {
    if (index < 0 || index >= this.pozicije.length) return;

    const pozicijaZaEdit = { ...this.pozicije[index] };

    this.dialogService.open(DodajPozicijuModalComponent, {
      context: {
        layout: this.layout,
        postojecePozicije: this.pozicije.filter((_, i) => i !== index), // Isključi trenutnu poziciju iz provjere preklapanja
        editMode: true,
        pozicijaZaEdit: pozicijaZaEdit
      },
      closeOnBackdropClick: false,
      closeOnEsc: true
    }).onClose.subscribe((editovanaPozicija: ProdajnaPozicija | null) => {
      if (editovanaPozicija) {
        // Zamijeni staru poziciju sa editovanom
        this.pozicije[index] = editovanaPozicija;
        // Zadrži selekciju
        this.selectedIndex = index;
        // Ažuriraj upozorenja
        this.azurirajUpozorenja();
        // Resetuj cache
        this._lastPozicijeLength = -1;
      }
    });
  }

  selectPozicija(index: number): void {

    this.selectedIndex = index;
  }

  obrisiPoziciju(): void {
    if (this.selectedIndex === null) return;
    this.pozicije.splice(this.selectedIndex, 1);
    this.selectedIndex = null;
    this._lastPozicijeLength = -1;
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
      brojPozicije: original.brojPozicije ? `${original.brojPozicije}-K${copyIndex}` : `P${copyIndex.toString().padStart(3, '0')}`,
      pozicijaX: original.pozicijaX + 0.5,
      pozicijaY: original.pozicijaY + 0.5
    };
    this.pozicije.push(kopija);
    this._lastPozicijeLength = -1;
    this.selectedIndex = this.pozicije.length - 1;
    this.azurirajUpozorenja();
  }

  sacuvaj(): void {
    this.sacuvajLayout.emit({ layout: this.layout, pozicije: this.pozicije });
  }

  stampajNacrt(): void {
    const html = this.buildPrintHtml();
    const printWindow = window.open('', '_blank', 'width=1200,height=900');
    if (!printWindow) return;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); }, 300);
  }

  // HELPERS ZA STILIZACIJU
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

  getCanvasStyle(): Record<string, string> {
    const { sirina, duzina } = this.ensureLayoutDimensions();
    return {
      width: `${sirina * this.baseScale}px`,
      height: `${duzina * this.baseScale}px`,
      transform: `scale(${this.zoom})`,
      transformOrigin: 'center center'
    };
  }

  getPanStyle(): Record<string, string> {
    return { transform: `translate(${this.panX}px, ${this.panY}px)` };
  }

  getBackgroundStyle(): Record<string, string> {
    const rotation = this.layout.backgroundRotation ?? 0;
    const renderSize = this.getBackgroundRenderSize();
    return {
      width: renderSize ? `${renderSize.width}px` : '100%',
      height: renderSize ? `${renderSize.height}px` : '100%',
      left: '50%',
      top: '50%',
      transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
      transformOrigin: 'center'
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
    if (!this.canvasRef) return;
    const canvasWidth = this.canvasRef.nativeElement.clientWidth;
    const canvasHeight = this.canvasRef.nativeElement.clientHeight;
    const { sirina, duzina } = this.ensureLayoutDimensions();
    const paddingFactor = 0.85;
    this.baseScale = Math.min(
      (canvasWidth * paddingFactor) / sirina,
      (canvasHeight * paddingFactor) / duzina
    );
  }

  private getCurrentScale(): number {
    return this.baseScale * this.zoom;
  }

  azurirajUpozorenja(): void {
    const warnings: string[] = [];
    this.pozicije.forEach((pozicija, index) => {
      if (this.isOutOfBounds(pozicija)) warnings.push(`Objekat "${pozicija.naziv}" izlazi iz granica.`);
      if (this.isOverlapping(index)) warnings.push(`Objekat "${pozicija.naziv}" se preklapa.`);
    });
    this.warnings = warnings;
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
      this.loadBackgroundImageDimensions(this.layout.backgroundData ?? '');
      this.izracunajSkalu();
    };
    reader.readAsDataURL(file);
  }

  ukloniPodlogu(): void {
    this.layout.backgroundData = null;
    this.layout.backgroundFileName = null;
    this.layout.backgroundContentType = null;
    this.layout.backgroundRotation = 0;
    this.backgroundNaturalSize = null;
    if (this.backgroundInputRef) this.backgroundInputRef.nativeElement.value = '';
    this.izracunajSkalu();
  }

  isImageBackground(): boolean {
    const contentType = this.layout.backgroundContentType ?? '';
    const data = this.layout.backgroundData ?? '';
    return contentType.startsWith('image/') || data.startsWith('data:image');
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  primijeniFiltere(): void {
    this._lastPozicijeLength = -1;
    this._lastFilterHash = '';
  }

  resetFilters(): void {
    this.filterBrojPozicije = '';
    this.filterTrgovci = [];
    this.filterOdjeli = [];
    this.filterTipovi = [];
    this.filterIsticeUskoro = false;
    this.filterSamoSlobodne = false;
    this.primijeniFiltere();
  }

  hasActiveFilters(): boolean {
    return this.filterBrojPozicije.trim() !== '' ||
      this.filterTrgovci.length > 0 ||
      this.filterOdjeli.length > 0 ||
      this.filterTipovi.length > 0 ||
      this.filterIsticeUskoro ||
      this.filterSamoSlobodne ||
      this.odabraniDobavljaci.length > 0 ||
      this.filtrirajUskoro;
  }

  getActiveFiltersCount(): number {
    let count = 0;
    if (this.filterBrojPozicije.trim()) count++;
    if (this.filterTrgovci.length > 0) count++;
    if (this.filterOdjeli.length > 0) count++;
    if (this.filterTipovi.length > 0) count++;
    if (this.filterIsticeUskoro) count++;
    if (this.filterSamoSlobodne) count++;
    if (this.odabraniDobavljaci.length > 0) count++;
    if (this.filtrirajUskoro) count++;
    return count;
  }

  getPozicijaLabel(pozicija: ProdajnaPozicija): string {
    return pozicija.brojPozicije || pozicija.naziv;
  }

  getPozicijaTooltip(pozicija: ProdajnaPozicija): string {
    const statusLabel = pozicija.trgovac || pozicija.trader;
    const status = statusLabel ? `Zauzeta (${statusLabel})` : 'Slobodna';
    const lines = [
      `${this.getPozicijaLabel(pozicija)}${pozicija.naziv ? ` — ${pozicija.naziv}` : ''}`,
      `Status: ${status}`,
      `Odjel: ${pozicija.zona || 'Nije postavljeno'}`,
      `Vrsta ugovora: ${pozicija.vrstaUgovora || 'Nije postavljeno'}`,
      `Tip pozicije: ${pozicija.tipPozicije || 'Nije postavljeno'}`,
      `Trader: ${pozicija.trader || 'Nije postavljeno'}`,
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

  // FILTRIRANJE OPTIMIZACIJA
  private _cachedPrikazanePozicije: Array<{ pozicija: ProdajnaPozicija; index: number }> = [];
  private _lastPozicijeLength = 0;
  private _lastDobavljaciLength = 0;
  private _lastFiltrirajUskoro = false;
  private _lastFilterHash = '';

  get prikazanePozicije(): Array<{ pozicija: ProdajnaPozicija; index: number }> {
    const filterHash = JSON.stringify({
      brojPozicije: this.filterBrojPozicije,
      trgovci: this.filterTrgovci,
      odjeli: this.filterOdjeli,
      tipovi: this.filterTipovi,
      isticeUskoro: this.filterIsticeUskoro,
      samoSlobodne: this.filterSamoSlobodne,
      odabraniDobavljaci: this.odabraniDobavljaci,
      filtrirajUskoro: this.filtrirajUskoro
    });

    const needsRecalc =
      this._lastPozicijeLength !== this.pozicije.length ||
      this._lastDobavljaciLength !== this.odabraniDobavljaci.length ||
      this._lastFiltrirajUskoro !== this.filtrirajUskoro ||
      this._lastFilterHash !== filterHash;

    if (needsRecalc) {
      this._cachedPrikazanePozicije = this.pozicije
        .map((pozicija, index) => ({ pozicija, index }))
        .filter(({ pozicija }) => this.isPozicijaVidljiva(pozicija));
      
      this._lastPozicijeLength = this.pozicije.length;
      this._lastDobavljaciLength = this.odabraniDobavljaci.length;
      this._lastFiltrirajUskoro = this.filtrirajUskoro;
      this._lastFilterHash = filterHash;
    }
    return this._cachedPrikazanePozicije;
  }

  private isPozicijaVidljiva(pozicija: ProdajnaPozicija): boolean {
    if (this.filterBrojPozicije.trim()) {
      const searchTerm = this.filterBrojPozicije.toLowerCase().trim();
      const brojPozicije = (pozicija.brojPozicije || '').toLowerCase();
      const naziv = (pozicija.naziv || '').toLowerCase();
      if (!brojPozicije.includes(searchTerm) && !naziv.includes(searchTerm)) return false;
    }
    if (this.filterTrgovci.length > 0 && (!pozicija.trgovac || !this.filterTrgovci.includes(pozicija.trgovac))) return false;
    if (this.filterOdjeli.length > 0 && (!pozicija.zona || !this.filterOdjeli.includes(pozicija.zona))) return false;
    if (this.filterTipovi.length > 0 && !this.filterTipovi.includes(pozicija.tip)) return false;
    if (this.filterIsticeUskoro && !this.jeUgovorUskoro(pozicija.zakupDo)) return false;
    if (this.filterSamoSlobodne && pozicija.trgovac && pozicija.trgovac.trim()) return false;
    if (this.odabraniDobavljaci.length && (!pozicija.trgovac || !this.odabraniDobavljaci.includes(pozicija.trgovac))) return false;
    if (this.filtrirajUskoro) return this.jeUgovorUskoro(pozicija.zakupDo);
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

  private buildPrintHtml(): string {
    const scale = 40;
    const { sirina, duzina } = this.ensureLayoutDimensions();
    const width = Math.max(sirina * scale, 200);
    const height = Math.max(duzina * scale, 200);
    const rotation = this.layout.backgroundRotation ?? 0;

    const pozicijeMarkup = this.pozicije.map((pozicija) => {
      const color = this.getOdjelColor(pozicija.zona);
      const border = color?.border ?? '#3b82f6';
      const background = color?.background ? `${color.background}22` : 'rgba(59, 130, 246, 0.12)';
      const label = this.getPozicijaLabel(pozicija) || 'Pozicija';
      return `
        <div class="layout-item" style="
            left: ${pozicija.pozicijaX * scale}px; top: ${pozicija.pozicijaY * scale}px;
            width: ${pozicija.sirina * scale}px; height: ${pozicija.duzina * scale}px;
            border-color: ${border}; background-color: ${background};
            transform: rotate(${pozicija.rotacija ?? 0}deg);">
          <span class="layout-label">${label}</span>
        </div>`;
    }).join('');

    const backgroundMarkup = this.layout.backgroundData && this.isImageBackground()
      ? `<img class="background-layer" src="${this.layout.backgroundData}" style="transform: translate(-50%, -50%) rotate(${rotation}deg);" />` : '';

    return `
      <html>
        <head><title>Nacrt</title><style>
          * { box-sizing: border-box; } body { margin: 0; font-family: Arial; }
          .layout-wrapper { position: relative; width: ${width}px; height: ${height}px; border: 2px solid #111; overflow: hidden; }
          .layout-item { position: absolute; border: 2px solid #3b82f6; display: flex; justify-content: center; align-items: center; font-size: 10px; }
          .background-layer { position: absolute; left: 50%; top: 50%; width: 100%; height: 100%; object-fit: contain; z-index: -1; }
        </style></head>
        <body><div class="layout-wrapper">${backgroundMarkup}${pozicijeMarkup}</div></body>
      </html>`;
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
    if (!this.layout.sirina || this.layout.sirina <= 0) this.layout.sirina = sirina;
    if (!this.layout.duzina || this.layout.duzina <= 0) this.layout.duzina = duzina;
    return { sirina, duzina };
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  private getLabelFontSize(pozicija: ProdajnaPozicija): number {
    const minDim = Math.min(pozicija.sirina, pozicija.duzina);
    const baseSize = minDim * this.baseScale * 0.15;
    return Math.max(5, Math.min(12, baseSize));
  }

  private loadBackgroundImageDimensions(data: string): void {
    if (!data) { this.backgroundNaturalSize = null; return; }
    const image = new Image();
    image.onload = () => {
      this.backgroundNaturalSize = { width: image.naturalWidth, height: image.naturalHeight };
      this.izracunajSkalu();
    };
    image.onerror = () => { this.backgroundNaturalSize = null; };
    image.src = data;
  }

  private getBackgroundRenderSize(): { width: number; height: number } | null {
    if (!this.backgroundNaturalSize) return null;
    const { sirina, duzina } = this.ensureLayoutDimensions();
    const maxWidth = sirina * this.baseScale;
    const maxHeight = duzina * this.baseScale;
    if (maxWidth <= 0 || maxHeight <= 0) return null;
    const scale = Math.min(maxWidth / this.backgroundNaturalSize.width, maxHeight / this.backgroundNaturalSize.height);
    return { width: this.backgroundNaturalSize.width * scale, height: this.backgroundNaturalSize.height * scale };
  }

  private formatDateValue(value?: string | null): string {
    if (!value) return '-';
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString('sr-BA');
  }

  private formatCurrencyValue(value?: number | null): string {
    return (value === null || value === undefined) ? '-' : `${value.toFixed(2)} KM`;
  }
}