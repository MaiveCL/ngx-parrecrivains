// doc: composants Angular => https://angular.dev/guide/components
// doc: Signals (computed, effect, signal) => https://angular.dev/guide/signals
// doc: afterNextRender => https://angular.dev/api/core/afterNextRender
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConfigLectureService } from '../../services/config-lecture';
import { FormatContenuService } from '../../services/format-contenu';
import { FormatContenu } from '../../../types/liseuse.types';

@Component({
  selector: 'ngx-zone-lecture',
  templateUrl: './zone-lecture.html',
  styleUrl: './zone-lecture.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ngx-zone-lecture' },
})
export class ZoneLectureComponent implements OnDestroy {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly formatService = inject(FormatContenuService);
  private readonly configService = inject(ConfigLectureService);
  private readonly _el: HTMLElement = inject(ElementRef).nativeElement;

  // input.required = Angular 17+ — remplace @Input() obligatoire
  // doc: input() => https://angular.dev/guide/signals/inputs
  readonly contenu = input.required<string | File | null>();

  // output() = Angular 17+ — remplace @Output() EventEmitter
  // doc: output() => https://angular.dev/guide/components/outputs
  readonly erreurIframe = output<void>();
  readonly pageChangee = output<{ page: number; total: number }>();
  readonly progressionChange = output<number>();
  readonly totalMotsChange = output<number>();

  // Variables non-signal pour les blob URLs courantes — évitent une dépendance circulaire
  // dans computed() : on ne peut pas lire et écrire le même signal dans computed()
  private _blobPdfCourant: string | null = null;
  private _blobNatifCourant: string | null = null;

  // Signaux séparés pour exposer les blob URLs aux computed() urlPdf / urlSafe
  // URL.createObjectURL() crée une URL temporaire en mémoire pour un File
  // URL.revokeObjectURL() libère cette mémoire — obligatoire sinon fuite mémoire
  // doc: URL.createObjectURL => https://developer.mozilla.org/fr/docs/Web/API/URL/createObjectURL_static
  private readonly _blobPdfUrl = signal<string | null>(null);
  private readonly _blobNatifUrl = signal<string | null>(null);

  // Pagination — _pageActuelle WritableSignal privé, pageActuelle ReadonlySignal public
  // asReadonly() empêche les composants externes de modifier directement la page courante
  private readonly _pageActuelle = signal<number>(1);
  readonly pageActuelle = this._pageActuelle.asReadonly();
  private readonly _totalPages = signal<number>(1);
  readonly totalPages = this._totalPages.asReadonly();

  readonly progressionPourcent = signal<number>(0);
  private _lastScrollEmit = 0; // timestamp du dernier emit de scroll (throttle 250ms)

  private _resizeObserver: ResizeObserver | null = null;
  private _touchStartX = 0;
  private _touchStartY = 0;

  // ─── Computed signals — tout dérivé de contenu() ─────────────────────────────
  // computed() = valeur dérivée recalculée automatiquement quand ses dépendances changent
  // JAMAIS d'effets de bord dans computed() — utiliser effect() pour ça
  // doc: computed() => https://angular.dev/guide/signals#computed-signals

  readonly format = computed<FormatContenu>(() => this.formatService.detecter(this.contenu()));

  // Source de vérité unique pour le mode : texte/HTML = optimisé, PDF/iframe = natif
  readonly estOptimise = computed(() => {
    const f = this.format();
    return f === 'texte-brut' || f === 'html';
  });

  readonly estTexteBreut = computed(() => this.format() === 'texte-brut');
  readonly estPdf = computed(() => this.format() === 'pdf');

  // TODO-REVIEW: ajouter input totalMotsExterne = input<number | undefined>(undefined)
  // et computed totalMotsEffectif = computed(() => this.totalMotsExterne() ?? this.totalMots())
  // Permet à l'app hôte de fournir le wordcount depuis une BD ou une API externe (ex. Google Docs API)
  // au lieu de le calculer localement — même pattern que estimatedReadingTime.
  // TODO-REVIEW: new DOMParser() instancié à chaque recalcul — surveiller les performances
  // sur mobile avec de grands manuscrits (200 000 mots = parsing DOM potentiellement 30–80 ms).
  // DOMParser parse le HTML en arbre DOM pour accéder au texte brut sans balises
  // doc: DOMParser => https://developer.mozilla.org/fr/docs/Web/API/DOMParser
  readonly totalMots = computed<number>(() => {
    const c = this.contenu();
    if (typeof c !== 'string') return 0;
    const doc = new DOMParser().parseFromString(c, 'text/html');
    // textContent extrait le texte brut, split(/\s+/) découpe sur tout espace/retour ligne
    return doc.body.textContent?.trim().split(/\s+/).filter(Boolean).length ?? 0;
  });

  readonly config = computed(() => this.configService.configCourante());

  // Génère les variables CSS custom depuis la config — Angular les applique via [style]
  // doc: CSS custom properties => https://developer.mozilla.org/fr/docs/Web/CSS/--*
  readonly styleZone = computed(() => {
    const c = this.config();
    return {
      '--taille-police': `${c.taillePolicePx}px`,
      '--interligne': String(c.interligne),
      '--largeur-colonne': `${c.largeurColonneCh}ch`,
      zoom: String(c.niveauZoom), // zoom CSS natif — s'applique au texte et au fond
    };
  });

  // [innerHTML] d'Angular sanitise automatiquement — supprime scripts, handlers dangereux
  // Aucun bypass : un manuscrit HTML ne nécessite pas de JavaScript
  readonly contenuHtml = computed<string>(() => {
    const c = this.contenu();
    return typeof c === 'string' ? c : '';
  });

  readonly contenuTexte = computed(() => {
    const c = this.contenu();
    return typeof c === 'string' ? c : '';
  });

  // bypassSecurityTrustResourceUrl justifié : blob: URLs créées par nous depuis un File utilisateur
  // Angular bloque blob: par défaut — ce bypass est ciblé, pas global
  // doc: DomSanitizer => https://angular.dev/api/platform-browser/DomSanitizer
  readonly urlPdf = computed((): SafeResourceUrl => {
    const url = this._blobPdfUrl();
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : '';
  });

  // bypassSecurityTrustResourceUrl justifié :
  // - blob: URLs créées par nous depuis un File utilisateur (docx/odt/rtf/epub)
  // - Google Docs / OneDrive : URLs validées en amont par FormatContenuService (hostname exact)
  readonly urlSafe = computed((): SafeResourceUrl => {
    const c = this.contenu();
    const fmt = this.format();

    if (fmt === 'url-google-docs' && typeof c === 'string') {
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.formatService.urlPreview(c));
    }
    if (fmt === 'url-onedrive' && typeof c === 'string') {
      return this.sanitizer.bypassSecurityTrustResourceUrl(c);
    }

    const url = this._blobNatifUrl();
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : '';
  });

  constructor() {
    // effect() pour les blob URLs — pas computed() car URL.createObjectURL() est un effet de bord
    // (alloue de la mémoire) — computed() doit être une fonction pure sans effets de bord
    // effect() s'exécute à chaque changement de ses dépendances (contenu, format)
    // doc: effect() => https://angular.dev/guide/signals#effects

    // Gestion du cycle de vie du blob PDF
    effect(() => {
      const c = this.contenu();
      const fmt = this.format();
      // Libère l'ancienne blob URL avant d'en créer une nouvelle — évite la fuite mémoire
      if (this._blobPdfCourant) {
        URL.revokeObjectURL(this._blobPdfCourant);
        this._blobPdfCourant = null;
      }
      if (c instanceof File && fmt === 'pdf') {
        this._blobPdfCourant = URL.createObjectURL(c);
        this._blobPdfUrl.set(this._blobPdfCourant);
      } else {
        this._blobPdfUrl.set(null);
      }
    });

    // Gestion du cycle de vie des blobs DOCX/ODT/RTF/EPUB
    effect(() => {
      const c = this.contenu();
      const fmt = this.format();
      if (this._blobNatifCourant) {
        URL.revokeObjectURL(this._blobNatifCourant);
        this._blobNatifCourant = null;
      }
      if (c instanceof File && (fmt === 'docx' || fmt === 'odt' || fmt === 'rtf' || fmt === 'epub')) {
        this._blobNatifCourant = URL.createObjectURL(c);
        this._blobNatifUrl.set(this._blobNatifCourant);
      } else {
        this._blobNatifUrl.set(null);
      }
    });

    // Émet totalMotsChange quand le contenu change
    effect(() => {
      this.totalMotsChange.emit(this.totalMots());
    });

    // afterNextRender() = Angular moderne remplace ngAfterViewInit
    // Attend que le DOM soit réellement construit avant d'accéder aux éléments HTML
    // doc: afterNextRender => https://angular.dev/api/core/afterNextRender
    // TODO-REVIEW: addEventListener natif requis pour { passive: false } sur wheel/touchend
    // Angular host bindings ne supportent pas cette option. Solution future : CSS touch-action.
    afterNextRender(() => {
      this._actualiserTotalPages();
      // ResizeObserver recalcule le nombre de pages si la taille du composant change
      // doc: ResizeObserver => https://developer.mozilla.org/fr/docs/Web/API/ResizeObserver
      if (typeof ResizeObserver !== 'undefined') {
        this._resizeObserver = new ResizeObserver(() => this._actualiserTotalPages());
        this._resizeObserver.observe(this._el);
      }
      this._el.addEventListener('scroll', this._onScroll, { passive: true });
      this._el.addEventListener('touchstart', this._onTouchStart, { passive: true });
      this._el.addEventListener('touchend', this._onTouchEnd);
      this._el.addEventListener('wheel', this._onWheel, { passive: false });
    });
  }

  // Navigue vers une page — clamp entre 1 et total, scrolle, émet l'événement
  allerPage(n: number): void {
    const total = this._totalPages();
    const clamped = Math.min(Math.max(n, 1), total);
    this._pageActuelle.set(clamped);
    // scrollTo avec behavior: 'smooth' pour une animation fluide
    this._el.scrollTo?.({ top: (clamped - 1) * this._el.clientHeight, behavior: 'smooth' });
    this.pageChangee.emit({ page: clamped, total });
  }

  // Recalcule le nombre de pages selon la hauteur réelle du DOM
  // scrollHeight = hauteur totale du contenu, clientHeight = hauteur visible
  private _actualiserTotalPages(): void {
    const clientH = this._el.clientHeight || 1;
    const total = Math.ceil(this._el.scrollHeight / clientH) || 1;
    this._totalPages.set(total);
    const p = this.pageActuelle();
    if (p > total) {
      this._pageActuelle.set(total);
    }
  }

  // Throttle 250ms — évite d'émettre des centaines d'événements par seconde lors du scroll
  private readonly _onScroll = (): void => {
    const maintenant = Date.now();
    if (maintenant - this._lastScrollEmit < 250) return;
    this._lastScrollEmit = maintenant;
    const hauteur = this._el.scrollHeight - this._el.clientHeight || 1;
    const p = Math.round((this._el.scrollTop / hauteur) * 100);
    this.progressionPourcent.set(p);
    this.progressionChange.emit(p);
  };

  private readonly _onTouchStart = (e: TouchEvent): void => {
    this._touchStartX = e.touches[0].clientX;
    this._touchStartY = e.touches[0].clientY;
  };

  // Swipe : deltaX > 50px ET plus horizontal que vertical => changer de page
  // doc: TouchEvent => https://developer.mozilla.org/fr/docs/Web/API/TouchEvent
  private readonly _onTouchEnd = (e: TouchEvent): void => {
    if (!this.estOptimise()) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - this._touchStartX;
    const deltaY = touch.clientY - this._touchStartY;
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      this.allerPage(deltaX < 0 ? this.pageActuelle() + 1 : this.pageActuelle() - 1);
    }
  };

  // Molette en mode pagination : preventDefault() empêche le scroll natif, on gère nous-mêmes
  private readonly _onWheel = (e: WheelEvent): void => {
    if (!this.estOptimise()) return;
    if (this.config().modePagination) {
      e.preventDefault();
      if (e.deltaY > 0) {
        this.allerPage(this.pageActuelle() + 1);
      } else if (e.deltaY < 0) {
        this.allerPage(this.pageActuelle() - 1);
      }
    }
  };

  onErreurIframe(): void {
    this.erreurIframe.emit();
  }

  // Nettoyage complet : blob URLs, ResizeObserver, 4 event listeners
  // Sans ça, les ressources restent en mémoire après la destruction du composant
  ngOnDestroy(): void {
    if (this._blobPdfCourant) URL.revokeObjectURL(this._blobPdfCourant);
    if (this._blobNatifCourant) URL.revokeObjectURL(this._blobNatifCourant);
    this._resizeObserver?.disconnect();
    this._el.removeEventListener('scroll', this._onScroll);
    this._el.removeEventListener('touchstart', this._onTouchStart);
    this._el.removeEventListener('touchend', this._onTouchEnd);
    this._el.removeEventListener('wheel', this._onWheel);
  }
}
