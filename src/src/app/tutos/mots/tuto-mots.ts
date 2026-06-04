import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
// ✅ Tuto — étape 2 : imports ajoutés après npm install ngx-parrecrivains
// FR → MotsPipe  (pipe | mots)
// EN → WordsPipe (pipe | words, alias anglophone)
import { MotsPipe, WordsPipe } from 'ngx-parrecrivains';
import { LangueService } from '../../shared/services/langue.service';
import { SnippetComponent } from '../../shared/snippet/snippet';
import { SlotComponent } from '../../shared/slot/slot';

// ─────────────────────────────────────────────────────────────────────────────
// TUTO MotsPipe — version complétée (main)
//
// Diff avec tuto-depart :
//   étape 2 → import { MotsPipe, WordsPipe }  (lignes ci-dessus)
//   étape 3 → ajout dans imports[]            (voir @Component ci-dessous)
//   étape 4 → | mots (ou | words) dans le template (voir tuto-mots.html)
//
// Sans le pipe dans le template, le nombre s'affiche brut : "1234"
// Avec le pipe : "1 234 mots" (fr) ou "1,234 words" (en)
// ─────────────────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-tuto-mots',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ✅ Tuto — étape 3 : MotsPipe et WordsPipe ajoutés dans imports[]
  imports: [MotsPipe, WordsPipe, SnippetComponent, SlotComponent],
  templateUrl: './tuto-mots.html',
  styleUrl: './tuto-mots.scss',
})
export class TutoMotsComponent {
  readonly langue = inject(LangueService);

  readonly nombreMots = signal(1234);

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
