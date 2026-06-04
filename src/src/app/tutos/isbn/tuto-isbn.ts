import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { LangueService } from '../../shared/services/langue.service';
import { SnippetComponent } from '../../shared/snippet/snippet';
import { SlotComponent } from '../../shared/slot/slot';

// ─────────────────────────────────────────────────────────────────────────────
// TUTO isbnValidator — branche tuto-depart
//
// Ce composant scaffold l'intégration de isbnValidator dans un formulaire réactif.
// L'élément manquant intentionnellement : isbnValidator() dans le FormControl.
//
// Pour intégrer :
//   1. npm install ngx-parrecrivains
//   2. Ajouter en haut du fichier :
//        import { isbnValidator } from 'ngx-parrecrivains';
//   3. Modifier la ligne isbn = new FormControl(...) :
//        isbn = new FormControl('', [Validators.required, isbnValidator()]);
// ─────────────────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-tuto-isbn',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, SnippetComponent, SlotComponent],
  templateUrl: './tuto-isbn.html',
  styleUrl: './tuto-isbn.scss',
})
export class TutoIsbnComponent {
  readonly langue = inject(LangueService);

  // Formulaire pré-câblé — isbnValidator() manquant intentionnellement
  readonly isbn = new FormControl('', [Validators.required]);

  readonly dernierTest = signal<string>('');

  readonly snippetImport = `import { isbnValidator } from 'ngx-parrecrivains';`;

  readonly snippetUsage = `// Dans votre composant TypeScript :
isbn = new FormControl('', [Validators.required, isbnValidator()]);

// Avec vérification de cohérence par rapport à l'année de publication :
isbn = new FormControl('', [isbnValidator({ annee: 2015 })]);`;

  readonly snippetErreurs = `<!-- Dans votre template HTML -->
@if (isbn.errors?.['isbnFormat']) {
  <span class="erreur">Format invalide — 10 ou 13 chiffres sans tirets</span>
}
@if (isbn.errors?.['isbnPrefixe']) {
  <span class="erreur">Préfixe ISBN-13 invalide (978 ou 979 requis)</span>
}
@if (isbn.errors?.['isbnChecksum']) {
  <span class="erreur">Chiffre de contrôle incorrect</span>
}
@if (isbn.errors?.['isbnCoherence']) {
  <span class="erreur">Format incohérent avec l'année de publication</span>
}`;

  testerIsbn(valeur: string): void {
    this.isbn.setValue(valeur);
    this.isbn.markAsDirty();
    this.dernierTest.set(valeur);
  }

  get erreursJson(): string {
    const e = this.isbn.errors;
    return e ? JSON.stringify(e, null, 2) : '';
  }
}
