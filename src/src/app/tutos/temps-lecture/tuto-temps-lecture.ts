import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
// ✅ Tuto — étape 2 : imports ajoutés après npm install ngx-parrecrivains
import { TempsLectureService } from 'ngx-parrecrivains';
import { LangueService } from '../../shared/services/langue.service';
import { SnippetComponent } from '../../shared/snippet/snippet';
import { SlotComponent } from '../../shared/slot/slot';

// ─────────────────────────────────────────────────────────────────────────────
// TUTO TempsLectureService — version complétée (main)
//
// Diff avec tuto-depart :
//   étape 2 → import { TempsLectureService }      (ligne ci-dessus)
//   étape 3 → inject(TempsLectureService)          (voir ci-dessous)
//   étape 3 → computed() remplace signal('??')    (voir ci-dessous)
//
// Sans le service injecté, tempsAffiche restait figé à '??'.
// Avec le service : "5 min" pour 1000 mots, "3 h 45 min" pour 45000 mots.
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

  // ✅ Tuto — étape 3a : injection du service
  // Dans tuto-depart, cette ligne n'existait pas
  private readonly tl = inject(TempsLectureService);

  readonly nombreMots = signal(1000);

  // ✅ Tuto — étape 3b : computed() remplace signal('??')
  // Dans tuto-depart, cette ligne était : readonly tempsAffiche = signal('??');
  readonly tempsAffiche = computed(() =>
    this.tl.formater(this.tl.estimer(this.nombreMots()))
  );

  // Détection automatique : le service est injecté si tempsAffiche calcule
  // un résultat réel plutôt que le placeholder '??'
  readonly tempsIntegre = computed(() => this.tempsAffiche() !== '??');

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
