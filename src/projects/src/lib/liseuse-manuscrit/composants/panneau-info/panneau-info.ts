// doc: composants Angular => https://angular.dev/guide/components
// doc: input() signals => https://angular.dev/guide/signals/inputs
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { LangueSupported } from '../../../types/liseuse.types';
import { TraductionService } from '../../services/traduction';

@Component({
  selector: 'ngx-panneau-info',
  templateUrl: './panneau-info.html',
  styleUrl: './panneau-info.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanneauInfoComponent {
  private readonly traductionService = inject(TraductionService);

  // Tous les inputs viennent du parent — ce composant n'a pas d'état propre, que de l'affichage
  readonly titre = input<string | undefined>(undefined);   // undefined = ne s'affiche pas
  readonly auteur = input<string | undefined>(undefined);
  readonly totalMots = input<number>(0);
  readonly progressionPourcent = input<number>(0);         // 0-100
  // Fourni par l'app hôte — peut être une string déjà formatée ou un nombre de secondes
  readonly estimatedReadingTime = input<string | number | undefined>(undefined);
  readonly tempsLectureActif = input<number>(0);           // secondes depuis ChronomètreLectureService
  readonly langue = input<LangueSupported>('fr');

  // Convertit les secondes en "mm:ss" pour l'affichage : 185s => "3:05"
  // doc: computed() => https://angular.dev/guide/signals#computed-signals
  // doc: Math.floor => https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Math/floor
  // doc: padStart => https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
  readonly tempsFormate = computed<string>(() => {
    const t = this.tempsLectureActif();
    const min = Math.floor(t / 60);
    const sec = t % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;  // "3:05" et non "3:5"
  });

  // Raccourci utilisé dans le template : {{ t('liseuse.info.mots') }}
  // délègue à TraductionService avec la langue courante
  // doc: TraductionService => src/lib/liseuse-manuscrit/services/traduction.ts
  t(cle: string): string {
    return this.traductionService.traduire(cle, this.langue());
  }
}
