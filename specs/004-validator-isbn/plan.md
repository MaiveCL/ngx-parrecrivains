# Plan d'implémentation : IsbnValidator

**Branche** : `004-validator-isbn` | **Date** : 2026-06-02 | **Spec** : [spec.md](./spec.md)

---

## Résumé

Créer `IsbnValidator` dans `ngx-parrecrivains` : un `ValidatorFn` Angular et une fonction pure `validerIsbn()` qui valident mathématiquement un ISBN-10 ou ISBN-13 par checksum, vérifient le préfixe `978`/`979` pour l'ISBN-13, et optionnellement contrôlent la cohérence du format avec l'année de publication. Un seul fichier, zéro dépendance externe, instanciable sans TestBed.

---

## Contexte technique

**Langage/Version** : TypeScript 5.x, Angular 21+ (workspace `src/frontend`)

**Dépendances** : `tslib ^2.3.0` uniquement. `AbstractControl` et `ValidatorFn` viennent de `@angular/forms` (peerDependency). Aucune nouvelle dépendance directe.

**Stockage** : N/A — validator sans état, calculs synchrones.

**Tests** : Vitest — `new FormControl('', isbnValidator())` ou appel direct `validerIsbn()`, sans TestBed requis.

**Plateforme cible** : Navigateur web (Chrome 120+, Firefox 121+, Safari 17+) — arithmétique pure, aucune API navigateur.

**Type de projet** : Bibliothèque Angular publiable sur npm (`ngx-parrecrivains`)

**Objectifs de performance** : N/A — calculs synchrones O(n) sur 10 ou 13 chiffres.

**Contraintes** : Aucun `@Injectable` ni décorateur Angular. `isbnValidator` est une fonction factory, pas un service. `validerIsbn` est une fonction pure sans aucune dépendance.

**Périmètre** : 1 fichier source + 1 fichier de tests. Pas de composant, template, styles, ni i18n.

---

## Constitution Check

| Principe | Question | Statut |
|---|---|---|
| I. Réutilisabilité | Fonctionne dans un projet Angular vierge sans config ? | ✅ `isbnValidator()` s'ajoute dans `FormControl`. `validerIsbn()` fonctionne sans Angular. |
| II. i18n | Toutes les chaînes visibles externalisées ? | ✅ avec adaptation — le validator retourne des clés d'erreur, pas de texte visible. Les messages sont la responsabilité de l'app hôte. |
| III. Tree-shaking | Export isolé dans `public-api.ts` ? | ✅ `export *` depuis `lib/isbn/` |
| IV. Versionnage | Version correcte ? CHANGELOG à jour ? | ⏳ Sera `0.4.0` après implémentation |
| V. Qualité de la spec | Spec révisée et validée ? | ✅ Décisions actées par Maive le 2026-06-02 |
| Contraintes | Aucune dépendance directe ajoutée ? | ✅ Zéro nouvelle dépendance |

---

## Structure du projet

### Documentation (cette feature)

```text
specs/004-validator-isbn/
├── spec.md              ← Spécification validée
├── plan.md              ← Ce fichier
├── research.md          ← Algorithmes ISBN + pattern Angular ValidatorFn
├── data-model.md        ← Règles de validation + table de vérification
├── quickstart.md        ← 5 cas d'utilisation + checklist manuelle
├── contracts/
│   └── validator-api.md ← Contrat public de l'API
├── checklists/
│   └── requirements.md  ← Checklist qualité de la spec
└── tasks.md             ← Généré par /speckit-tasks
```

### Code source (bibliothèque)

```text
src/frontend/projects/ngx-parrecrivains/src/
├── public-api.ts                            ← Ajouter : export * from './lib/isbn/isbn.validator'
└── lib/
    └── isbn/
        ├── isbn.validator.ts                ← ISBN_ERREURS + IsbnOptions + IsbnResultat + validerIsbn() + isbnValidator()
        └── isbn.validator.spec.ts           ← Tests unitaires Vitest
```

### Test visuel (app hôte)

```text
src/frontend/projects/parrecrivains/src/app/features/test-isbn/
├── TEST-isbn.ts
├── TEST-isbn.html
└── TEST-isbn.scss
```

Route : `test/isbn` dans `app.routes.ts` (section TEST — SUPPRIMER AVANT PUBLICATION)

---

## Décisions de design

### Un seul fichier

`isbn.validator.ts` contient tout : constantes, interfaces, fonction pure, factory Angular. La logique de calcul n'importe rien d'Angular — `validerIsbn()` est totalement indépendante. Seule `isbnValidator()` importe `AbstractControl` et `ValidatorFn` de `@angular/forms`.

### Ordre des validations (fail-fast)

```
1. Vide/null/undefined  → null  (retour immédiat)
2. Format               → isbnFormat
3. Préfixe ISBN-13      → isbnPrefixe
4. Checksum             → isbnChecksum
5. Cohérence année      → isbnCoherence  (seulement si annee fournie)
```

Un seul message d'erreur retourné à la fois.

### Algorithme ISBN-10

```
somme = Σ d[i] × (10 - i)  pour i = 0..9
        (d[9] = 10 si 'X' ou 'x')
valide = somme % 11 === 0
```

### Algorithme ISBN-13

```
poids  = [1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1]
somme  = Σ d[i] × poids[i]  pour i = 0..12
valide = somme % 10 === 0
```

### Zone grise

```
ISBN-10 + annee > 2006  → isbnCoherence
ISBN-13 + annee < 2005  → isbnCoherence
2005 ≤ annee ≤ 2006     → null (les deux formats coexistaient)
```

### Tests sans TestBed

```typescript
const ctrl = new FormControl('9782764633291', isbnValidator());
// ctrl.valid === true

validerIsbn('9782764633291')  // { valide: true }
```
