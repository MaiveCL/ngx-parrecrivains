# Contrat API : IsbnValidator

**Feature** : `004-validator-isbn` | **Date** : 2026-06-02

---

## Exports publics

```typescript
import {
  isbnValidator,
  validerIsbn,
  ISBN_ERREURS,
} from 'ngx-parrecrivains';

import type {
  IsbnOptions,
  IsbnResultat,
} from 'ngx-parrecrivains';
```

---

## `isbnValidator(options?)`

**Signature** : `isbnValidator(options?: IsbnOptions): ValidatorFn`

Retourne un `ValidatorFn` compatible `ReactiveFormsModule`.

| Paramètre | Type | Requis | Description |
|---|---|---|---|
| `options.annee` | `number` | — | Année de publication **statique** pour cohérence format/date |

**Clés d'erreur** :

| Clé | Constante | Condition |
|---|---|---|
| `'isbnFormat'` | `ISBN_ERREURS.FORMAT` | Longueur ≠ 10/13, caractères non numériques, X mal placé, tirets/espaces |
| `'isbnPrefixe'` | `ISBN_ERREURS.PREFIXE` | ISBN-13 ne commençant pas par `978` ou `979` |
| `'isbnChecksum'` | `ISBN_ERREURS.CHECKSUM` | Chiffre de contrôle mathématiquement incorrect |
| `'isbnCoherence'` | `ISBN_ERREURS.COHERENCE` | Format anachronique par rapport à `annee` (hors zone grise) |

**Garanties** :
- Champ vide / `null` → retourne `null` (ne rend pas obligatoire)
- Au plus une clé d'erreur retournée à la fois (ordre : format → préfixe → checksum → cohérence)

**Exemples** :

```typescript
// Usage minimal
new FormControl('', isbnValidator())

// Avec validité obligatoire + cohérence
new FormControl('', [Validators.required, isbnValidator({ annee: 2003 })])

// Accès à l'erreur dans le template
@if (form.get('isbn')?.errors?.['isbnChecksum']) {
  <span>Chiffre de contrôle incorrect</span>
}

// Avec les constantes (évite les chaînes magiques)
@if (form.get('isbn')?.errors?.[ISBN_ERREURS.CHECKSUM]) {
  <span>Chiffre de contrôle incorrect</span>
}
```

---

## `validerIsbn(isbn, annee?)`

**Signature** : `validerIsbn(isbn: string | null | undefined, annee?: number): IsbnResultat`

Fonction pure, zéro dépendance Angular.

| Paramètre | Type | Requis | Description |
|---|---|---|---|
| `isbn` | `string \| null \| undefined` | ✅ | ISBN à valider (chiffres purs) |
| `annee` | `number` | — | Année de publication pour cohérence |

**Retour** :

```typescript
type IsbnResultat =
  | { valide: true }
  | { valide: false; erreur: 'isbnFormat' | 'isbnPrefixe' | 'isbnChecksum' | 'isbnCoherence' };
```

**Exemples** :

```typescript
validerIsbn('9782764633291')          // { valide: true }
validerIsbn('9782764633290')          // { valide: false, erreur: 'isbnChecksum' }
validerIsbn('2764633297', 2010)       // { valide: false, erreur: 'isbnCoherence' }
validerIsbn(null)                     // { valide: true } — champ vide = valide
validerIsbn('978-2-7646-3329-1')      // { valide: false, erreur: 'isbnFormat' }
```

---

## `ISBN_ERREURS`

```typescript
const ISBN_ERREURS = {
  FORMAT:    'isbnFormat',
  PREFIXE:   'isbnPrefixe',
  CHECKSUM:  'isbnChecksum',
  COHERENCE: 'isbnCoherence',
} as const;
```

---

## Garanties du contrat

- Aucune exception levée pour toute entrée (y compris `undefined`, `NaN`, objet).
- Retours déterministes — mêmes entrées = mêmes sorties.
- `isbnValidator()` est utilisable directement dans `new FormControl()` sans configuration.
- `validerIsbn()` est instanciable sans contexte Angular.
- Un seul import suffit pour les deux usages.
