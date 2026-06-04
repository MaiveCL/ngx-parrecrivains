import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
// ✅ Tuto — étape 2 : import ajouté après npm install ngx-parrecrivains
import { isbnValidator } from 'ngx-parrecrivains';
import { LangueService } from '../../shared/services/langue.service';
import { SnippetComponent } from '../../shared/snippet/snippet';
import { SlotComponent } from '../../shared/slot/slot';

// ─────────────────────────────────────────────────────────────────────────────
// TUTO isbnValidator — version complétée (main)
//
// Diff avec tuto-depart :
//   étape 2 → import { isbnValidator } from 'ngx-parrecrivains'  (ligne ci-dessus)
//   étape 3 → isbnValidator() ajouté dans le tableau de validateurs (voir plus bas)
//
// Sans ces deux lignes, le formulaire accepte n'importe quelle valeur sans
// valider le format ni le checksum ISBN.
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

  // ✅ Tuto — étape 3 : isbnValidator() ajouté dans le tableau de validateurs
  // Dans tuto-depart, cette ligne était : new FormControl('', [Validators.required])
  readonly isbn = new FormControl('', [Validators.required, isbnValidator()]);

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
