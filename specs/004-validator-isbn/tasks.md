---
description: "Task list — IsbnValidator"
---

# Tasks : IsbnValidator

**Input** : Documents de conception dans `specs/004-validator-isbn/`

**Prérequis** : plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ contracts/validator-api.md ✅

## Format : `[ID] [P?] [Story?] Description`

- **[P]** : Peut tourner en parallèle (fichiers différents, pas de dépendances)
- **[Story]** : User story concernée (US1, US2, US3)
- Chemin de base lib : `src/frontend/projects/ngx-parrecrivains/`

---

## Phase 1 : Mise en place

**Objectif** : Créer la structure de fichiers squelette

- [x] T001 Créer le dossier `src/frontend/projects/ngx-parrecrivains/src/lib/isbn/`
- [x] T002 [P] Créer le fichier squelette `src/frontend/projects/ngx-parrecrivains/src/lib/isbn/isbn.validator.ts` — exporter `ISBN_ERREURS` vide, `isbnValidator()` retournant `() => null`, `validerIsbn()` retournant `{ valide: true }`
- [x] T003 [P] Créer le fichier squelette `src/frontend/projects/ngx-parrecrivains/src/lib/isbn/isbn.validator.spec.ts` — structure de describe vide avec imports

**Checkpoint** : Dossier et squelettes en place

---

## Phase 2 : Fondation

**Objectif** : Export public — requis avant toute user story

- [x] T004 Ajouter `export * from './lib/isbn/isbn.validator';` dans `src/frontend/projects/ngx-parrecrivains/src/public-api.ts`

**Checkpoint** : Export public en place

---

## Phase 3 : User Story 1 — Validation dans un formulaire (Priorité : P1) 🎯 MVP

**Objectif** : `isbnValidator()` valide un ISBN-10 ou ISBN-13 par checksum dans un `FormControl`

**Test indépendant** : `new FormControl('9782764633291', isbnValidator()).valid === true`. `new FormControl('9782764633290', isbnValidator()).errors?.isbnChecksum === true`.

### Tests — US1

> **Écrire les tests en PREMIER, vérifier qu'ils ÉCHOUENT avant d'implémenter**

- [x] T005 [US1] Dans `isbn.validator.spec.ts` — écrire tous les tests US1 via `isbnValidator()` + `FormControl` ET via `validerIsbn()` directement (les deux interfaces partagent la même logique) :
  - Format : `'12345'` → `isbnFormat`, `'978-2-7646-3329-1'` → `isbnFormat`, `''`/`null` → `null`
  - Préfixe : `'9992764633291'` → `isbnPrefixe`
  - Checksum ISBN-13 : `'9782764633291'` → `null`, `'9782764633290'` → `isbnChecksum`
  - Checksum ISBN-10 : `'2764633297'` → `null`, `'2764633290'` → `isbnChecksum`, `'047191177X'` → `null`, `'047191177x'` → `null`
  - `VITESSE_LECTURE_DEFAUT` : vérifier que `ISBN_ERREURS` exporte les 4 clés

### Implémentation — US1

- [x] T006 [US1] Dans `isbn.validator.ts` — définir `ISBN_ERREURS` (objet `as const` avec les 4 clés), `IsbnOptions` (interface), `IsbnResultat` (type union)
- [x] T007 [US1] Dans `isbn.validator.ts` — implémenter `validerIsbn(isbn, annee?)` : étapes fail-fast selon `data-model.md` — vide→null, format (longueur, chars, X), préfixe ISBN-13 (978/979), checksum ISBN-10 (mod 11), checksum ISBN-13 (poids alternés 1/3, mod 10)
- [x] T008 [US1] Dans `isbn.validator.ts` — implémenter `isbnValidator(options?)` : factory retournant `ValidatorFn` qui appelle `validerIsbn(control.value, options?.annee)` et convertit `IsbnResultat` en `ValidationErrors | null`

**Checkpoint** : `new FormControl('9782764633291', isbnValidator()).valid === true` — US1 testable sans TestBed

---

## Phase 4 : User Story 3 — Validation hors formulaire (Priorité : P2)

**Objectif** : `validerIsbn()` fonctionne sans contexte Angular, instanciable sans TestBed

**Test indépendant** : Appeler `validerIsbn('9782764633291')` dans un test Vitest sans aucun import Angular → `{ valide: true }`.

### Tests — US3

- [x] T009 [P] [US3] Dans `isbn.validator.spec.ts` — vérifier que `validerIsbn()` couvre tous les cas de la table de vérification du `data-model.md` (y compris les entrées `null`, `undefined`, tirets) — compléter si des cas manquent depuis T005

### Implémentation — US3

- [x] T010 [US3] Dans `isbn.validator.ts` — vérifier que `validerIsbn()` n'importe aucun symbole Angular (`AbstractControl`, `ValidatorFn`, etc.) — si c'est le cas (devrait être résolu par T007), corriger l'organisation des imports

**Checkpoint** : US1 et US3 fonctionnelles — `validerIsbn()` indépendante d'Angular

---

## Phase 5 : User Story 2 — Cohérence format/année (Priorité : P2)

**Objectif** : `isbnValidator({ annee })` et `validerIsbn(isbn, annee)` retournent `isbnCoherence` si le format est anachronique

**Test indépendant** : `validerIsbn('2764633297', 2010)` → `{ valide: false, erreur: 'isbnCoherence' }`. `validerIsbn('2764633297', 2006)` → `{ valide: true }` (zone grise).

### Tests — US2

> **Écrire les tests en PREMIER, vérifier qu'ils ÉCHOUENT avant d'implémenter**

- [x] T011 [P] [US2] Dans `isbn.validator.spec.ts` — écrire les tests US2 :
  - ISBN-10 + `annee` 2010 → `isbnCoherence`
  - ISBN-10 + `annee` 2007 → `isbnCoherence` (hors zone grise)
  - ISBN-13 + `annee` 2003 → `isbnCoherence`
  - ISBN-10 + `annee` 2006 → `null` (zone grise)
  - ISBN-13 + `annee` 2005 → `null` (zone grise)
  - ISBN-10 + `annee` 2003 → `null` (cohérent)
  - ISBN-13 + `annee` 2010 → `null` (cohérent)
  - Sans `annee` → pas de vérification de cohérence

### Implémentation — US2

- [x] T012 [US2] Dans `isbn.validator.ts` — ajouter la logique de cohérence dans `validerIsbn()` : `annee > 2006 && isbn10 → isbnCoherence`, `annee < 2005 && isbn13 → isbnCoherence`, zone grise 2005-2006 → `null`

**Checkpoint** : Les 3 user stories fonctionnelles — tous les cas du contrat `contracts/validator-api.md` passent

---

## Phase 6 : Test visuel dans l'app parrecrivains

**Objectif** : Confirmer visuellement que le validator fonctionne depuis l'app hôte — confirmé par un humain dans le navigateur

- [x] T013 [P] Créer `src/frontend/projects/parrecrivains/src/app/features/test-isbn/TEST-isbn.ts` — composant avec un champ ISBN (FormControl + isbnValidator()), affichage des erreurs en temps réel, section de cas de référence testés via validerIsbn() avec résultats attendus vs réels
- [x] T014 [P] Créer `src/frontend/projects/parrecrivains/src/app/features/test-isbn/TEST-isbn.html`
- [x] T015 [P] Créer `src/frontend/projects/parrecrivains/src/app/features/test-isbn/TEST-isbn.scss` — même pattern que test-liseuse/, test-pipe-mots/, test-temps-lecture/
- [x] T016 Ajouter la route `test/isbn` dans `src/frontend/projects/parrecrivains/src/app/app.routes.ts` (section TEST — SUPPRIMER AVANT PUBLICATION)

**Checkpoint** : Ouvrir `/test/isbn` dans le navigateur — les ISBN valides passent, les invalides affichent la bonne clé d'erreur

---

## Phase 7 : Finition

- [x] T017 [P] Incrémenter la version dans `src/frontend/projects/ngx-parrecrivains/package.json` → `0.4.0`
- [x] T018 [P] Mettre à jour `src/frontend/projects/ngx-parrecrivains/CHANGELOG.md` avec la section `[0.4.0]`
- [x] T019 Mettre à jour `src/frontend/projects/ngx-parrecrivains/README.md` — ajouter section `IsbnValidator` (fr + en) : `isbnValidator()`, `validerIsbn()`, `ISBN_ERREURS`, exemples formulaire + hors formulaire, tableau des clés d'erreur, note zone grise
- [ ] T020 — 🔄 EN COURS (branche 005-validation-demo) — Validation dans le repo de démo faite globalement à la fin, une fois tous les composants terminés

---

## Ordre d'exécution

### Dépendances entre phases

- **Phase 1** (Mise en place) : démarre immédiatement
- **Phase 2** (Fondation) : dépend de Phase 1
- **Phase 3** (US1) : dépend de Phase 2 — BLOQUE US2 et US3
- **Phase 4** (US3) : dépend de Phase 3 (`validerIsbn()` doit exister) — vérification seulement
- **Phase 5** (US2) : dépend de Phase 3 (`validerIsbn()` doit exister pour y ajouter `annee`)
- **Phase 4 et Phase 5** : parallèles entre elles après Phase 3
- **Phase 6** (test visuel) : dépend de Phases 3 + 4 + 5
- **Phase 7** (finition) : dépend de toutes les phases

### Opportunités de parallélisme

- T002 et T003 (squelettes) : parallèles
- T009 (tests US3) et T011 (tests US2) : parallèles après T005/T006/T007/T008
- T010 (vérif US3) et T012 (impl US2) : parallèles
- T013, T014, T015 (test visuel) : parallèles
- T017 et T018 (version + CHANGELOG) : parallèles

---

## Notes

- `validerIsbn()` n'importe rien d'Angular — testable avec un simple appel de fonction
- `isbnValidator()` importe uniquement `AbstractControl` et `ValidatorFn` de `@angular/forms`
- T010 est probablement un no-op si T007 est bien fait — vérifier simplement les imports
- Algorithmes documentés dans `research.md` §1 et §2 — s'y référer pour l'implémentation
- Committer après chaque phase ou groupe logique
