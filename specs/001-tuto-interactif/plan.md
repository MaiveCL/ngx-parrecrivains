# Implementation Plan: Scaffold Pédagogique Interactif (tuto-depart)

**Branch**: `001-tuto-interactif` | **Date**: 2026-06-03 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-tuto-interactif/spec.md`

---

## Summary

Construction d'un site Angular interactif en deux volets : (1) une page d'accueil guidant
l'installation de `ngx-parrecrivains` et (2) quatre pages de tutoriel pour les composants
de la lib (LiseuseManuscrit, MotsPipe, TempsLectureService, isbnValidator).

Chaque page de tuto est pré-câblée avec des signals Angular et des boutons de test
fonctionnels. L'élément *spécifique au composant* (validator, pipe, injection de service,
balise HTML) est intentionnellement absent — c'est ce que l'utilisateur doit ajouter.
Le site compile et tourne sans `ngx-parrecrivains` installée ; l'ajout de la lib et de
l'élément manquant fait apparaître le composant dans l'emplacement réservé.

L'internationalisation fr/en est gérée par un `LangueService` léger (signals + HttpClient)
sans dépendance npm supplémentaire.

---

## Technical Context

**Language/Version**: TypeScript ~5.9 / Angular 21.2.x — standalone components

**Primary Dependencies**:
- `@angular/common`, `@angular/core`, `@angular/forms`, `@angular/router` — déjà installés
- `@angular/common/http` via `provideHttpClient()` — chargement des fichiers i18n JSON
- `ngx-parrecrivains` — **non installée dans `tuto-depart`** ; c'est l'action de l'utilisateur

**Storage**: N/A — aucune persistence. Données de test hardcodées dans des signals Angular.

**Testing**: vitest en place. Pas de tests unitaires pour cette feature (scope pédagogique,
interface visuelle). Validation manuelle selon les checklists des quickstarts de référence.

**Target Platform**: GitHub Pages — SPA statique, base-href `/ngx-parrecrivains/`

**Project Type**: SPA Angular frontend pur — 5 routes, ~10 composants partagés

**Performance Goals**: Chargement initial < 2 s sur connexion standard. Routes lazy-loaded.

**Constraints**:
- Aucun backend, aucune donnée persistante
- Le code TS des pages de tuto ne doit contenir ZÉRO import de `ngx-parrecrivains`
  (la lib n'est pas installée — le site doit compiler sans elle)
- Tous les snippets affichés dans la page sont des chaînes de caractères, pas du code réel importé

---

## Constitution Check

| Principe | Statut | Note |
|---|---|---|
| I. Démo Vivante | ✅ N/A | Constitution I s'applique à `main`. Les pages de tuto sont une catégorie distincte (scaffold pédagogique). |
| II. Frontend Pur | ✅ PASS | SPA Angular statique, aucun backend, deploy GitHub Pages. |
| III. Exemples Copy-Paste | ✅ PASS | Tous les snippets affichés sont autonomes et fonctionnels après `npm install ngx-parrecrivains`. |
| IV. Simulation de Données | ✅ PASS | Données de test hardcodées dans des signals Angular locaux. Aucune API. |
| V. Usage Pédagogique | ✅ PASS | Feature sur `001-tuto-interactif` → mergée dans `tuto-depart`, jamais dans `main`. |
| VI. Documentation Multilingue | ✅ PASS | i18n fr/en via `LangueService` + `assets/i18n/fr.json` + `assets/i18n/en.json`. FR par défaut. |

**Résultat** : aucune violation de constitution. Complexity Tracking non requis.

---

## Project Structure

### Documentation (this feature)

```text
specs/001-tuto-interactif/
├── plan.md              ← ce fichier
├── research.md          ← Phase 0 — décisions techniques
├── data-model.md        ← Phase 1 — entités et structures
├── contracts/
│   ├── routes.md        ← contrat de routing
│   └── i18n-keys.md     ← structure des fichiers de traduction
└── tasks.md             ← Phase 2 (/speckit-tasks — généré séparément)
```

### Source Code

```text
src/src/
├── assets/
│   └── i18n/
│       ├── fr.json              ← traductions françaises (défaut)
│       └── en.json              ← traductions anglaises
└── app/
    ├── app.ts                   ← layout shell (nav + router-outlet)
    ├── app.html
    ├── app.scss
    ├── app.routes.ts            ← 5 routes lazy-loaded
    ├── app.config.ts            ← + provideHttpClient()
    ├── accueil/
    │   ├── accueil.ts           ← page d'accueil / installation guidée
    │   ├── accueil.html
    │   └── accueil.scss
    ├── tutos/
    │   ├── isbn/
    │   │   ├── tuto-isbn.ts
    │   │   ├── tuto-isbn.html
    │   │   └── tuto-isbn.scss
    │   ├── mots/
    │   │   ├── tuto-mots.ts
    │   │   ├── tuto-mots.html
    │   │   └── tuto-mots.scss
    │   ├── temps-lecture/
    │   │   ├── tuto-temps-lecture.ts
    │   │   ├── tuto-temps-lecture.html
    │   │   └── tuto-temps-lecture.scss
    │   └── liseuse/
    │       ├── tuto-liseuse.ts
    │       ├── tuto-liseuse.html
    │       └── tuto-liseuse.scss
    └── shared/
        ├── nav/
        │   ├── nav.ts           ← barre de navigation + sélecteur de langue
        │   ├── nav.html
        │   └── nav.scss
        ├── snippet/
        │   └── snippet.ts       ← bloc de code affiché (copy-paste ready)
        ├── slot/
        │   └── slot.ts          ← zone réservée visuelle (cadre pointillé)
        └── services/
            └── langue.service.ts  ← i18n léger : signals + HttpClient
```

**Structure Decision**: Single-project Angular. Découpage par domaine fonctionnel
(`accueil/`, `tutos/`, `shared/`). Pas de sous-projet, pas de backend.

---

## Mécanique d'intégration pédagogique (par page de tuto)

Chaque page de tuto est conçue pour que l'utilisateur ajoute **un seul élément manquant**
dans son code. Le reste est pré-câblé.

| Page | Pré-câblé (présent dans tuto-depart) | Élément manquant (à ajouter par l'utilisateur) |
|---|---|---|
| `isbnValidator` | `FormControl('', [Validators.required])` + affichage des erreurs + boutons `patchValue()` | `isbnValidator()` dans le tableau de validateurs |
| `MotsPipe` | `nombreMots = signal(1234)` + `{{ nombreMots() }}` dans le template + boutons de changement | `\| mots` dans l'expression du template |
| `TempsLectureService` | `nombreMots = signal(1000)` + `tempsAffiche = signal('??')` + boutons | `inject(TempsLectureService)` + calcul dans `computed()` |
| `LiseuseManuscrit` | `contenu = signal('...')` + boutons de contenu alternatif | Balise `<ngx-liseuse-manuscrit [contenu]="contenu()" />` dans le slot |

**Règle critique** : Le code TypeScript des pages de tuto ne doit importer RIEN de
`ngx-parrecrivains`. Tous les snippets montrant les imports sont des chaînes affichées
par le composant `<app-snippet>`, pas du code réellement exécuté.

---

## Complexity Tracking

> Aucune violation de constitution — section vide.