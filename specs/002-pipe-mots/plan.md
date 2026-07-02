# Plan d'implémentation : MotsPipe / WordsPipe

**Branche** : `002-pipe-mots` | **Date** : 2026-06-01 | **Spec** : [spec.md](./spec.md)

---

## Résumé

Créer `MotsPipe` (sélecteur `mots`) et son alias `WordsPipe` (sélecteur `words`) dans la bibliothèque `ngx-parrecrivains`. Ces pipes transforment un nombre de mots en chaîne typographiquement correcte (formatage des milliers + accord singulier/pluriel) selon la langue active. Ils supportent le français, l'anglais et le cri en natif, et acceptent des formes custom pour toute autre langue.

---

## Contexte technique

**Langage/Version** : TypeScript 5.x, Angular 21+ (workspace `src/frontend`)

**Dépendances** : Angular 21 (`peerDependency`), `tslib ^2.3.0` — `@ngx-translate/core` non requis (le pipe n'injecte rien)

**Stockage** : N/A — pipe pur, sans état, sans persistance

**Tests** : Vitest — tous les cas contractuels testés unitairement

**Plateforme cible** : Navigateur web (Chrome 120+, Firefox 121+, Safari 17+) — `Intl.NumberFormat` disponible dans tous les cibles

**Type de projet** : Bibliothèque Angular publiable sur npm (`ngx-parrecrivains`)

**Objectifs de performance** : N/A — pipe synchrone, transformation O(1)

**Contraintes** : Pure pipe (pas de `pure: false`), aucune injection de service, `Intl.NumberFormat` natif uniquement

**Périmètre** : 2 classes de pipe dans 1 fichier + 1 fichier de tests

---

## Vérification constitution

*GATE : Doit passer avant Phase 0. Revérifié après Phase 1.*

| Principe | Question | Statut |
|---|---|---|
| I. Réutilisabilité | L'élément fonctionne-t-il indépendamment dans un projet Angular vierge ? | ✅ Pipe pur, aucune dépendance croisée avec les autres éléments de la lib |
| II. i18n | Toutes les chaînes visibles sont-elles externalisées ? | ✅ avec adaptation : les formes de mots sont des données de transformation, pas des chaînes d'UI. Le paramètre `langue` EST le mécanisme i18n. Voir research.md §4. |
| III. Tree-shaking | Export isolé dans `public-api.ts` ? Standalone ? | ✅ `export *` dans `public-api.ts`, `@Pipe` standalone |
| IV. Versionnage | Version correcte ? CHANGELOG à jour ? | ⏳ Sera incrémentée à `0.2.0` après implémentation |
| V. Qualité de la spec | Spec révisée et validée avant ce plan ? | ✅ Spec validée et amendée par l'auteure le 2026-06-01 |
| Contraintes | Aucune dépendance directe ajoutée ? | ✅ `Intl.NumberFormat` est une API native, zéro dep |

---

## Structure du projet

### Documentation (cette feature)

```text
specs/002-pipe-mots/
├── spec.md              ← Spécification révisée
├── plan.md              ← Ce fichier
├── research.md          ← Décisions techniques documentées
├── data-model.md        ← Tables de correspondance + règles de normalisation
├── quickstart.md        ← Guide de validation en projet vierge
├── contracts/
│   └── pipe-api.md      ← Contrat public de l'API
├── checklists/
│   └── requirements.md  ← Checklist de qualité de la spec
└── tasks.md             ← Généré par /speckit-tasks
```

### Code source (bibliothèque)

```text
src/frontend/projects/ngx-parrecrivains/src/
├── public-api.ts                          ← Ajouter : export * from './lib/mots/mots.pipe'
└── lib/
    └── mots/
        ├── mots.pipe.ts                   ← MotsPipe + WordsPipe
        └── mots.pipe.spec.ts              ← Tests unitaires Vitest
```

### Test visuel (app hôte — confirmation humaine)

```text
src/frontend/projects/parrecrivains/src/app/features/test-pipe-mots/
├── TEST-pipe-mots.ts        ← Composant (nav latérale + switch de cas)
├── TEST-pipe-mots.html      ← Template avec | mots et | words en live
└── TEST-pipe-mots.scss      ← Styles sombres, même pattern que test-liseuse/
```

Route : `test/pipe-mots` dans `app.routes.ts`

**Pattern de test visuel** : chaque feature de la lib doit avoir un composant dans `features/test-<feature>/` avec une route `test/<feature>` pour permettre la validation humaine avant publication.

---

## Décisions de design

### Architecture du pipe

- **`MotsPipe`** : classe principale, contient toute la logique dans `transform()`
- **`WordsPipe extends MotsPipe`** : classe vide avec `@Pipe({ name: 'words' })` — hérite `transform()` intégralement
- Les deux dans le même fichier `mots.pipe.ts` (WordsPipe = 3 lignes)

### Signature `transform()`

```typescript
transform(
  value:      number | null,
  langue?:    string,       // défaut 'fr'
  singulier?: string,       // prime sur les traductions intégrées
  pluriel?:   string        // prime sur les traductions intégrées
): string
```

### Normalisation de l'input

```
null | NaN | < 0  →  0
décimal           →  Math.floor(value)
entier ≥ 0        →  valeur telle quelle
```

### Sélection singulier/pluriel

```
valeur normalisée === 1  →  forme singulier
tout autre cas           →  forme pluriel
```

### Priorité des formes de mots

```
1. custom (singulier/pluriel params)  ← prioritaire
2. lookup table intégrée (fr/en/cr)
3. fallback 'fr' si langue inconnue
```

### Locale Intl.NumberFormat

```
'fr' | 'cr'  →  'fr-FR'
'en'         →  'en-US'
autre        →  tentative directe (try/catch), fallback 'fr-FR'
```
