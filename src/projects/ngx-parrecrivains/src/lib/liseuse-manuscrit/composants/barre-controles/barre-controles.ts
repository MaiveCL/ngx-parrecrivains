// doc: composants Angular => https://angular.dev/guide/components
// doc: output() => https://angular.dev/guide/components/outputs
import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { ConfigLecture, CONFIG_LECTURE_DEFAUT, LangueSupported } from '../../../types/liseuse.types';
import { TraductionService } from '../../services/traduction';
import { PanneauInfoComponent } from '../panneau-info/panneau-info';

@Component({
  selector: 'ngx-barre-controles',
  templateUrl: './barre-controles.html',
  styleUrl: './barre-controles.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PanneauInfoComponent],
})
export class BarreControlesComponent {
  private readonly traductionService = inject(TraductionService);

  // ─── Inputs lecture ──────────────────────────────────────────────────────
  readonly config = input<ConfigLecture>(CONFIG_LECTURE_DEFAUT); // config courante du parent
  readonly modeOptimise = input<boolean>(true);   // false = PDF/iframe, certains contrôles masqués
  readonly pageActuelle = input<number>(1);
  readonly totalPages = input<number>(1);
  readonly langue = input<LangueSupported>('fr');

  // ─── Inputs panneau infos (transmis à PanneauInfoComponent) ─────────────
  readonly titre = input<string | undefined>(undefined);
  readonly auteur = input<string | undefined>(undefined);
  readonly totalMots = input<number>(0);
  readonly progressionPourcent = input<number>(0);
  readonly tempsLectureActif = input<number>(0);
  readonly estimatedReadingTime = input<string | number | undefined>(undefined);

  // ─── Outputs ─────────────────────────────────────────────────────────────
  // Ce composant ne modifie JAMAIS la config directement
  // Il émet changerConfig avec un Partial — le parent (LiseuseManuscrit) applique via ConfigLectureService
  // Séparation des responsabilités : la barre commande, le parent décide et valide (clamp)
  // doc: Partial<T> => https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype
  readonly changerConfig = output<Partial<ConfigLecture>>();
  readonly changerPage = output<number>();
  // Émet quel panneau est ouvert ('controles' | 'infos') ou null si fermé
  readonly panneauChange = output<'controles' | 'infos' | null>();

  // Seul état interne : quel panneau est actuellement ouvert (null = aucun)
  // doc: signal() => https://angular.dev/guide/signals#writable-signals
  readonly panneauActif = signal<'controles' | 'infos' | null>(null);

  // Raccourci de traduction — utilisé dans le template : {{ t('liseuse.controles.mode_nuit') }}
  t(cle: string): string {
    return this.traductionService.traduire(cle, this.langue());
  }

  // ─── Contrôle du panneau ─────────────────────────────────────────────────

  // Toggle : si déjà ouvert => ferme (null), sinon => ouvre
  // doc: signal.update() => https://angular.dev/guide/signals#writable-signals
  basculerControles(): void {
    this.panneauActif.update(v => (v === 'controles' ? null : 'controles'));
    this.panneauChange.emit(this.panneauActif());
  }

  basculerInfos(): void {
    this.panneauActif.update(v => (v === 'infos' ? null : 'infos'));
    this.panneauChange.emit(this.panneauActif());
  }

  fermerPanneau(): void {
    this.panneauActif.set(null);
    this.panneauChange.emit(null);
  }

  // ─── Toggles booléens ────────────────────────────────────────────────────
  // Chaque toggle lit la valeur courante et émet l'inverse — le parent applique
  toggleModeNuit(): void {
    this.changerConfig.emit({ modeNuit: !this.config().modeNuit });
  }

  togglePleinEcran(): void {
    this.changerConfig.emit({ pleinEcran: !this.config().pleinEcran });
  }

  togglePagination(): void {
    this.changerConfig.emit({ modePagination: !this.config().modePagination });
  }

  paginePrecedente(): void { this.changerPage.emit(this.pageActuelle() - 1); }
  pagineSuivante(): void   { this.changerPage.emit(this.pageActuelle() + 1); }

  // ─── Sliders ─────────────────────────────────────────────────────────────
  // event.target as HTMLInputElement = cast TypeScript pour accéder à .value (string)
  // Number() convertit la string en nombre — le clamp est fait dans ConfigLectureService.mettre()
  // doc: HTMLInputElement => https://developer.mozilla.org/fr/docs/Web/API/HTMLInputElement
  // doc: Number() => https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Number/Number
  onTaillePolice(event: Event): void {
    this.changerConfig.emit({ taillePolicePx: Number((event.target as HTMLInputElement).value) });
  }

  onInterligne(event: Event): void {
    this.changerConfig.emit({ interligne: Number((event.target as HTMLInputElement).value) });
  }

  onLargeurColonne(event: Event): void {
    this.changerConfig.emit({ largeurColonneCh: Number((event.target as HTMLInputElement).value) });
  }

  onBrightness(event: Event): void {
    this.changerConfig.emit({ brightness: Number((event.target as HTMLInputElement).value) });
  }

  onContrast(event: Event): void {
    this.changerConfig.emit({ contrast: Number((event.target as HTMLInputElement).value) });
  }

  onSepia(event: Event): void {
    this.changerConfig.emit({ sepia: Number((event.target as HTMLInputElement).value) });
  }

  onSuperpositionOpacite(event: Event): void {
    this.changerConfig.emit({ superpositionOpacite: Number((event.target as HTMLInputElement).value) });
  }

  // HTMLSelectElement pour le <select> (pas HTMLInputElement)
  // doc: HTMLSelectElement => https://developer.mozilla.org/fr/docs/Web/API/HTMLSelectElement
  onSuperpositionCouleur(event: Event): void {
    this.changerConfig.emit({ superpositionCouleur: (event.target as HTMLSelectElement).value as 'noir' | 'blanc' });
  }

  onZoom(event: Event): void {
    this.changerConfig.emit({ niveauZoom: Number((event.target as HTMLInputElement).value) });
  }
}
