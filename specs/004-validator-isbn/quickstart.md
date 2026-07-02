# Quickstart : IsbnValidator

**Feature** : `004-validator-isbn` | **Date** : 2026-06-02

---

## Installation

```bash
npm install ngx-parrecrivains
```

## Cas 1 — Formulaire réactif minimal

```typescript
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { isbnValidator } from 'ngx-parrecrivains';

@Component({
  imports: [ReactiveFormsModule],
  template: `
    <input [formControl]="isbn" />
    @if (isbn.errors?.['isbnFormat'])    { <span>Format invalide (10 ou 13 chiffres)</span> }
    @if (isbn.errors?.['isbnPrefixe'])   { <span>Préfixe ISBN-13 invalide (978 ou 979)</span> }
    @if (isbn.errors?.['isbnChecksum'])  { <span>Chiffre de contrôle incorrect</span> }
  `
})
export class FormulaireComponent {
  isbn = new FormControl('', [Validators.required, isbnValidator()]);
}
```

## Cas 2 — Avec cohérence par rapport à l'année de publication

```typescript
// Année connue statiquement
isbn = new FormControl('', isbnValidator({ annee: 2003 }));
// '9782764633291' (ISBN-13) + annee 2003 → isbnCoherence (ISBN-13 avant 2005)
// '2764633297'   (ISBN-10) + annee 2003 → valide ✅
```

## Cas 3 — Avec les constantes (évite les chaînes magiques)

```typescript
import { isbnValidator, ISBN_ERREURS } from 'ngx-parrecrivains';

// Dans le template
@if (isbn.errors?.[ISBN_ERREURS.CHECKSUM]) {
  <span>Chiffre de contrôle incorrect</span>
}
```

## Cas 4 — Validation hors formulaire (service, guard, batch)

```typescript
import { validerIsbn } from 'ngx-parrecrivains';

// ISBN-13 valide
validerIsbn('9782764633291')        // { valide: true }

// ISBN-10 avec X
validerIsbn('047191177X')           // { valide: true }

// Checksum incorrect
validerIsbn('9782764633290')        // { valide: false, erreur: 'isbnChecksum' }

// Avec cohérence
validerIsbn('2764633297', 2010)     // { valide: false, erreur: 'isbnCoherence' }
validerIsbn('2764633297', 2006)     // { valide: true } — zone grise
```

## Cas 5 — ISBN-10 avec X en dernière position

```typescript
// X = valeur 10 dans l'algorithme ISBN-10
validerIsbn('047191177X')           // { valide: true }
validerIsbn('047191177x')           // { valide: true } — minuscule aussi accepté
validerIsbn('X764633297')           // { valide: false, erreur: 'isbnFormat' } — X hors position
```

---

## Checklist de validation manuelle

- [ ] `validerIsbn('9782764633291')` → `{ valide: true }`
- [ ] `validerIsbn('9782764633290')` → `{ valide: false, erreur: 'isbnChecksum' }`
- [ ] `validerIsbn('2764633297')` → `{ valide: true }`
- [ ] `validerIsbn('047191177X')` → `{ valide: true }`
- [ ] `validerIsbn('9992764633291')` → `{ valide: false, erreur: 'isbnPrefixe' }`
- [ ] `validerIsbn('12345')` → `{ valide: false, erreur: 'isbnFormat' }`
- [ ] `validerIsbn('978-2-7646-3329-1')` → `{ valide: false, erreur: 'isbnFormat' }`
- [ ] `validerIsbn(null)` → `{ valide: true }`
- [ ] `validerIsbn('2764633297', 2010)` → `{ valide: false, erreur: 'isbnCoherence' }`
- [ ] `validerIsbn('2764633297', 2006)` → `{ valide: true }` (zone grise)
- [ ] `validerIsbn('9782764633291', 2003)` → `{ valide: false, erreur: 'isbnCoherence' }`
- [ ] `isbnValidator()` utilisable dans `new FormControl('')` sans import supplémentaire
