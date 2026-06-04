import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { LangueService } from '../../shared/services/langue.service';
import { SnippetComponent } from '../../shared/snippet/snippet';
import { SlotComponent } from '../../shared/slot/slot';

// ─────────────────────────────────────────────────────────────────────────────
// TUTO MotsPipe — branche tuto-depart
//
// FR : L'élément manquant : | mots dans le template  (import MotsPipe)
// EN : L'élément manquant : | words dans le template (import WordsPipe)
// ─────────────────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-tuto-mots',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SnippetComponent, SlotComponent],
  templateUrl: './tuto-mots.html',
  styleUrl: './tuto-mots.scss',
})
export class TutoMotsComponent {
  readonly langue = inject(LangueService);

  readonly nombreMots = signal(1234);

  // Alias bilingue : MotsPipe (fr) / WordsPipe (en)
  readonly estAnglais = computed(() => this.langue.langue() === 'en');

  readonly snippetImport = computed(() =>
    this.estAnglais()
      ? `import { WordsPipe } from 'ngx-parrecrivains';`
      : `import { MotsPipe } from 'ngx-parrecrivains';`,
  );

  readonly snippetImportsArray = computed(() =>
    this.estAnglais()
      ? `@Component({\n  imports: [WordsPipe],  // ← add here\n  // ...\n})`
      : `@Component({\n  imports: [MotsPipe],  // ← ajouter ici\n  // ...\n})`,
  );

  readonly snippetUsage = computed(() =>
    this.estAnglais()
      ? `<!-- In your HTML template -->
{{ wordCount | words }}           <!-- "1,234 words" -->
{{ wordCount | words:'en' }}      <!-- "1,234 words" -->
{{ wordCount | words:'fr' }}      <!-- "1 234 mots" -->
{{ 1 | words }}                   <!-- "1 mot" (default lang is 'fr') -->
{{ 0 | words:'en' }}              <!-- "0 words" -->`
      : `<!-- Dans votre template HTML -->
{{ nombreMots() | mots }}          <!-- "1 234 mots" -->
{{ nombreMots() | mots:'en' }}     <!-- "1,234 words" -->
{{ nombreMots() | mots:'cr' }}     <!-- "1 234 nêhiyaw-pîkiskwêwina" -->
{{ 1 | mots }}                     <!-- "1 mot" -->
{{ 0 | mots }}                     <!-- "0 mot" -->`,
  );

  readonly pipeNom = computed(() => (this.estAnglais() ? 'words' : 'mots'));

  testerMots(n: number): void {
    this.nombreMots.set(n);
  }
}
