import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { LangueService } from '../../shared/services/langue.service';
import { SnippetComponent } from '../../shared/snippet/snippet';
import { SlotComponent } from '../../shared/slot/slot';

// ─────────────────────────────────────────────────────────────────────────────
// TUTO TempsLectureService — branche tuto-depart
//
// Ce composant scaffold l'intégration de TempsLectureService.
// L'élément manquant intentionnellement : l'injection du service + computed().
//
// Pour intégrer :
//   1. npm install ngx-parrecrivains
//   2. Ajouter en haut du fichier :
//        import { inject } from '@angular/core';
//        import { TempsLectureService } from 'ngx-parrecrivains';
//   3. Dans la classe, ajouter :
//        private readonly tl = inject(TempsLectureService);
//        readonly tempsAffiche = computed(() =>
//          this.tl.formater(this.tl.estimer(this.nombreMots()))
//        );
// ─────────────────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-tuto-temps-lecture',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SnippetComponent, SlotComponent],
  templateUrl: './tuto-temps-lecture.html',
  styleUrl: './tuto-temps-lecture.scss',
})
export class TutoTempsLectureComponent {
  readonly langue = inject(LangueService);

  // Signals pré-câblés
  readonly nombreMots = signal(1000);

  // Placeholder — sera remplacé par un computed() quand le service est injecté
  readonly tempsAffiche = signal('??');

  readonly snippetImport = `import { inject, computed } from '@angular/core';
import { TempsLectureService } from 'ngx-parrecrivains';`;

  readonly snippetInjection = `// Dans votre classe de composant :
private readonly tl = inject(TempsLectureService);

readonly tempsAffiche = computed(() =>
  this.tl.formater(this.tl.estimer(this.nombreMots()))
);
// 1000 mots  → "5 min"
// 45000 mots → "3 h 45 min"`;

  readonly snippetUsage = `<!-- Dans votre template HTML -->
<p>Temps de lecture estimé : {{ 'tempsAffiche()' }}</p>

<!-- Avec vitesse personnalisée (ex. lecture jeunesse) -->
{{ tl.formater(tl.estimer(nombreMots(), 120)) }}`;

  testerTemps(n: number): void {
    this.nombreMots.set(n);
  }
}
