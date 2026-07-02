// Composant principal — assemble tous les sous-composants et services de la liseuse
// C'est le seul élément que l'app hôte importe : <ngx-liseuse-manuscrit [contenu]="..." />
// doc: composants Angular => https://angular.dev/guide/components
// doc: Signals => https://angular.dev/guide/signals
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  ConfigLecture,
  ErreurLiseuse,
  LANGUES_SUPPORTEES,
  LANGUE_DEFAUT,
  LangueSupported,
  ModeAffichage,
} from '../types/liseuse.types';
import { FormatContenuService } from './services/format-contenu';
import { ConfigLectureService } from './services/config-lecture';
import { TraductionService } from './services/traduction';
import { ChronomètreLectureService } from './services/chronometre-lecture';
import { ZoneLectureComponent } from './composants/zone-lecture/zone-lecture';
import { PanneauInfoComponent } from './composants/panneau-info/panneau-info';
import { BarreControlesComponent } from './composants/barre-controles/barre-controles';

@Component({
  selector: 'ngx-liseuse-manuscrit',
  templateUrl: './liseuse-manuscrit.html',
  styleUrl: './liseuse-manuscrit.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZoneLectureComponent, PanneauInfoComponent, BarreControlesComponent],
  // providers ici (pas providedIn: 'root') = instances isolées par liseuse
  // => deux liseuses sur la même page ont chacune leur propre config et chronomètre indépendants
  // doc: providers au niveau composant => https://angular.dev/guide/di/hierarchical-dependency-injection
  providers: [ChronomètreLectureService, ConfigLectureService],
  // host = classes CSS et événements appliqués directement sur l'élément <ngx-liseuse-manuscrit>
  // => pas besoin d'un div wrapper supplémentaire dans le template
  // doc: host metadata => https://angular.dev/guide/components/host-elements
  host: {
    '[class.no-select]': '!textSelectable()',      // désactive la sélection de texte si false
    '[class.mode-nuit]': 'configCourante().modeNuit',
    '[class.plein-ecran]': 'configCourante().pleinEcran',
    '[class.panneau-ouvert]': '_panneauOuvert()',  // décale le contenu quand le panneau s'ouvre
    '(contextmenu)': 'onContextMenu($event)',       // bloque le clic droit si textSelectable false
  },
})
export class LiseuseManuscritComponent {
  private readonly formatService = inject(FormatContenuService);
  private readonly configService = inject(ConfigLectureService);
  private readonly traductionService = inject(TraductionService);
  private readonly chronometre = inject(ChronomètreLectureService);
  // viewChild = référence vers le composant enfant ZoneLecture pour appeler allerPage() directement
  // doc: viewChild => https://angular.dev/api/core/viewChild
  private readonly _zoneLecture = viewChild(ZoneLectureComponent);

  // ─── Inputs publics (API de la lib) ──────────────────────────────────────
  // doc: input() => https://angular.dev/guide/signals/inputs
  readonly contenu = input.required<string | File | null>(); // texte, HTML, File, URL Google Docs/OneDrive
  readonly titre = input<string | undefined>(undefined);
  readonly auteur = input<string | undefined>(undefined);
  readonly langue = input<string>('fr');                     // validée dans langueActive computed
  readonly textSelectable = input<boolean>(true);
  readonly estimatedReadingTime = input<string | number | undefined>(undefined); // fourni par l'app hôte
  readonly config = input<Partial<ConfigLecture>>({});       // fusionné avec CONFIG_LECTURE_DEFAUT

  // ─── Outputs publics (API de la lib) ─────────────────────────────────────
  // doc: output() => https://angular.dev/guide/components/outputs
  readonly progressionLecture = output<number>(); // 0-100%, throttlé 250ms
  readonly readingTime = output<number>();         // secondes de lecture active

  // ─── Computed — valeurs dérivées ─────────────────────────────────────────
  // doc: computed() => https://angular.dev/guide/signals#computed-signals

  // Lit la progression depuis ZoneLectureComponent via viewChild — ?? 0 si pas encore rendu
  readonly progressionPourcent = computed<number>(() => this._zoneLecture()?.progressionPourcent() ?? 0);
  readonly tempsLectureActif = computed<number>(() => this.chronometre.tempsActif());

  // Génère la string CSS des filtres combinés pour [style.filter] dans le template
  readonly cssFiltre = computed<string>(() => {
    const c = this.configCourante();
    return `brightness(${c.brightness}%) contrast(${c.contrast}%) sepia(${c.sepia}%)`;
  });

  readonly couleurSuperposition = computed<string>(() =>
    this.configCourante().superpositionCouleur === 'noir' ? 'black' : 'white'
  );

  readonly formatDetecte = computed(() => this.formatService.detecter(this.contenu()));

  readonly modeAffichage = computed<ModeAffichage>(() => {
    const fmt = this.formatDetecte();
    return fmt === 'texte-brut' || fmt === 'html' ? 'optimise' : 'natif';
  });

  // Lit la config depuis le service — se met à jour automatiquement quand l'utilisateur change un réglage
  readonly configCourante = computed(() => this.configService.configCourante());

  // Valide la langue passée en input — fallback français si langue non supportée
  readonly langueActive = computed<LangueSupported>(() => {
    const l = this.langue();
    return LANGUES_SUPPORTEES.includes(l as LangueSupported) ? (l as LangueSupported) : LANGUE_DEFAUT;
  });

  private readonly _erreurIframe = signal<boolean>(false);
  readonly _panneauOuvert = signal<boolean>(false);

  private readonly _pageActuelle = signal<number>(1);
  private readonly _totalPages = signal<number>(1);
  readonly pageActuelle = this._pageActuelle.asReadonly(); // readonly vers l'extérieur
  readonly totalPages = this._totalPages.asReadonly();
  readonly totalMots = signal<number>(0);

  // Détermine quelle erreur afficher — priorité : iframe privée > contenu vide > format inconnu > null
  readonly erreurActive = computed<ErreurLiseuse | null>(() => {
    if (this._erreurIframe()) {
      return { code: 'ACCES_PRIVE', messageI18nKey: 'liseuse.erreur.acces_prive' };
    }
    const c = this.contenu();
    if (c === null || (typeof c === 'string' && c === '') || (c instanceof File && c.size === 0)) {
      return { code: 'CONTENU_VIDE', messageI18nKey: 'liseuse.erreur.contenu_vide' };
    }
    if (this.formatDetecte() === 'inconnu') {
      return { code: 'FORMAT_NON_SUPPORTE', messageI18nKey: 'liseuse.erreur.format_non_supporte' };
    }
    return null;
  });

  constructor() {
    // Synchronise le [config] input avec le service à chaque changement
    // doc: effect() => https://angular.dev/guide/signals#effects
    effect(() => { this.configService.initialiser(this.config()); });
    // Propage la progression et le temps vers l'app hôte via les outputs publics
    effect(() => { this.progressionLecture.emit(this.progressionPourcent()); });
    effect(() => { this.readingTime.emit(this.chronometre.tempsActif()); });
    // afterNextRender = démarre le chronomètre seulement après le premier rendu DOM réel
    // doc: afterNextRender => https://angular.dev/api/core/afterNextRender
    afterNextRender(() => { this.chronometre.demarrer(); });
  }

  // Appelé par ZoneLectureComponent si l'iframe Google Docs/OneDrive refuse de charger
  onErreurIframe(): void { this._erreurIframe.set(true); }

  togglePanneau(): void {
    this.configService.mettre({ panneauInfoVisible: !this.configService.configCourante().panneauInfoVisible });
  }

  // Raccourci de traduction — utilisé dans le template : {{ t('liseuse.erreur.contenu_vide') }}
  t(cle: string): string {
    return this.traductionService.traduire(cle, this.langueActive());
  }

  // Reçoit les changements de config de BarreControlesComponent et les applique (avec clamp)
  onChangerConfig(partiel: Partial<ConfigLecture>): void {
    this.configService.mettre(partiel);
  }

  // Reçoit les changements de page de ZoneLectureComponent et met à jour les signaux locaux
  onPageChangee(event: { page: number; total: number }): void {
    this._pageActuelle.set(event.page);
    this._totalPages.set(event.total);
  }

  // Reçoit la demande de navigation de BarreControlesComponent et la délègue à ZoneLectureComponent
  onChangerPage(page: number): void {
    this._zoneLecture()?.allerPage(page); // ?. = ZoneLecture peut ne pas être encore rendu
  }

  onPanneauChange(panneau: 'controles' | 'infos' | null): void {
    this._panneauOuvert.set(panneau !== null);
  }

  // Bloque le menu contextuel (clic droit) si textSelectable = false
  onContextMenu(e: Event): void {
    if (!this.textSelectable()) e.preventDefault();
  }
}
