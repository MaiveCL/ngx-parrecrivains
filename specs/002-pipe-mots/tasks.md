---
description: "Task list — MotsPipe / WordsPipe"
---

# Tasks : MotsPipe / WordsPipe

**Input** : Documents de conception dans `specs/002-pipe-mots/`

**Prérequis** : plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ contracts/pipe-api.md ✅

## Format : `[ID] [P?] [Story?] Description`

- **[P]** : Peut tourner en parallèle (fichiers différents, pas de dépendances)
- **[Story]** : User story concernée (US1, US2, US3, US4)
- Chemins absolus de la lib : `src/frontend/projects/ngx-parrecrivains/`

---

## Phase 1 : Mise en place

**Objectif** : Créer la structure de fichiers squelette

- [x] T001 Créer le dossier `src/frontend/projects/ngx-parrecrivains/src/lib/mots/`
- [x] T002 [P] Créer le fichier squelette `src/frontend/projects/ngx-parrecrivains/src/lib/mots/mots.pipe.ts` (classes vides `MotsPipe` et `WordsPipe` avec décorateurs `@Pipe`)
- [x] T003 [P] Créer le fichier squelette `src/frontend/projects/ngx-parrecrivains/src/lib/mots/mots.pipe.spec.ts` (structure de tests vide)

**Checkpoint** : Dossier et squelettes en place — prêt pour l'implémentation

---

## Phase 2 : Fondation

**Objectif** : Infrastructure de base — aucune user story ne peut être testée sans ça

- [x] T004 Ajouter `export * from './lib/mots/mots.pipe';` dans `src/frontend/projects/ngx-parrecrivains/src/public-api.ts`

**Checkpoint** : Export public en place — les stories peuvent démarrer

---

## Phase 3 : User Story 1 — Décompte en français (Priorité : P1) 🎯 MVP

**Objectif** : `{{ 1234 | mots }}` → `"1 234 mots"`, `{{ 1 | mots }}` → `"1 mot"`, `{{ 0 | mots }}` → `"0 mot"`

**Test indépendant** : Importer `MotsPipe` dans un projet Angular vierge et vérifier les résultats de la checklist quickstart.md (section française).

### Tests — US1

> **Écrire les tests en PREMIER, vérifier qu'ils ÉCHOUENT avant d'implémenter**

- [x] T005 [P] [US1] Dans `mots.pipe.spec.ts` — écrire les tests US1 : `transform(1234)` → `"1 234 mots"`, `transform(1)` → `"1 mot"`, `transform(0)` → `"0 mot"`, `transform(1234, 'fr')` → `"1 234 mots"`

### Implémentation — US1

- [x] T006 [US1] Dans `mots.pipe.ts` — implémenter la table de formes linguistiques intégrées (`fr`/`en`/`cr`, singulier/pluriel) et la logique de sélection singulier vs pluriel (valeur === 1)
- [x] T007 [US1] Dans `mots.pipe.ts` — implémenter la logique de normalisation de l'input (`null` → 0, négatif → 0, décimal → `Math.floor`)
- [x] T008 [US1] Dans `mots.pipe.ts` — implémenter le formatage des milliers via `Intl.NumberFormat` : table de correspondance langue → locale BCP 47 (`fr`/`cr` → `'fr-FR'`, `en` → `'en-US'`)
- [x] T009 [US1] Dans `mots.pipe.ts` — assembler la méthode `transform()` complète (normalisation + formatage nombre + sélection forme + concaténation) avec langue par défaut `'fr'`

**Checkpoint** : `{{ 1234 | mots }}` → `"1 234 mots"`, `{{ 1 | mots }}` → `"1 mot"` — US1 testable indépendamment

---

## Phase 4 : User Story 2 — Décompte en anglais (Priorité : P1)

**Objectif** : `{{ 1234 | mots:'en' }}` → `"1,234 words"`, `{{ 1 | mots:'en' }}` → `"1 word"`

**Test indépendant** : Passer le paramètre `'en'` et vérifier virgule + mot anglais.

### Tests — US2

- [x] T010 [P] [US2] Dans `mots.pipe.spec.ts` — écrire les tests US2 : `transform(1234, 'en')` → `"1,234 words"`, `transform(1, 'en')` → `"1 word"`, `transform(0, 'en')` → `"0 word"`

### Implémentation — US2

- [x] T011 [US2] Dans `mots.pipe.ts` — vérifier que la table de locales couvre déjà `'en'` → `'en-US'` et que la table de formes couvre `'en'` (normalement déjà fait en T006/T008 — sinon compléter)

**Checkpoint** : US1 et US2 fonctionnelles indépendamment

---

## Phase 5 : User Story 3 — Alias `words` (Priorité : P2)

**Objectif** : `{{ 1234 | words:'en' }}` → `"1,234 words"` — comportement identique à `| mots`

**Test indépendant** : Importer `WordsPipe`, utiliser `| words` dans un template, vérifier résultat identique à `| mots`.

### Tests — US3

- [x] T012 [P] [US3] Dans `mots.pipe.spec.ts` — écrire les tests US3 : instancier `WordsPipe`, vérifier `transform(1234, 'en')` → `"1,234 words"` et `transform(1234)` → `"1 234 mots"` (même logique que MotsPipe)

### Implémentation — US3

- [x] T013 [US3] Dans `mots.pipe.ts` — ajouter la classe `WordsPipe extends MotsPipe` avec `@Pipe({ name: 'words' })` (corps vide — hérite `transform()`)

**Checkpoint** : US1, US2 et US3 fonctionnelles — `words` interchangeable avec `mots`

---

## Phase 6 : User Story 4 — Décompte en cri (Priorité : P3)

**Objectif** : `{{ 1234 | mots:'cr' }}` → `"1 234 nêhiyaw-pîkiskwêwina"`, `{{ 1 | mots:'cr' }}` → `"1 nêhiyaw-pîkiskwêwin"`

**Test indépendant** : Passer `'cr'` et vérifier les formes cries avec espace fine insécable.

### Tests — US4

- [x] T014 [P] [US4] Dans `mots.pipe.spec.ts` — écrire les tests US4 : `transform(1234, 'cr')` → `"1 234 nêhiyaw-pîkiskwêwina"`, `transform(1, 'cr')` → `"1 nêhiyaw-pîkiskwêwin"`

### Implémentation — US4

- [x] T015 [US4] Dans `mots.pipe.ts` — vérifier que la table de formes contient bien les formes cries (normalement déjà en T006 — sinon compléter avec `'cr': { singulier: 'nêhiyaw-pîkiskwêwin', pluriel: 'nêhiyaw-pîkiskwêwina' }`)

**Checkpoint** : Les 4 user stories fonctionnelles indépendamment

---

## Phase 7 : Cas limites et paramètres custom

**Objectif** : Robustesse (null, négatif, décimal, langue inconnue) + support custom `singulier`/`pluriel`

**Test indépendant** : Passer des valeurs limites et des formes custom, vérifier qu'aucune exception n'est levée.

### Tests — Cas limites

- [x] T016 [P] Dans `mots.pipe.spec.ts` — écrire les tests de cas limites : `transform(null)` → `"0 mot"`, `transform(-5)` → `"0 mot"`, `transform(1.7)` → `"1 mot"`, `transform(1000000)` → `"1 000 000 mots"`

### Tests — Paramètres custom

- [x] T017 [P] Dans `mots.pipe.spec.ts` — écrire les tests custom : `transform(1234, 'pt', 'palavra', 'palavras')` → `"1 234 palavras"`, `transform(1, 'pt', 'palavra', 'palavras')` → `"1 palavra"`

### Tests — Fallback langue inconnue

- [x] T018 [P] Dans `mots.pipe.spec.ts` — écrire les tests de fallback : `transform(1234, 'xx')` → `"1 234 mots"` (fallback 'fr' pour le mot), `transform(1234, 'es', 'palabra', 'palabras')` → commence par un nombre formaté suivi de la forme custom

### Implémentation — Paramètres custom et Intl dynamique

- [x] T019 Dans `mots.pipe.ts` — ajouter les paramètres `singulier?: string` et `pluriel?: string` à la signature `transform()` ; implémenter la priorité : custom forms > table intégrée > fallback 'fr'
- [x] T020 Dans `mots.pipe.ts` — implémenter la tentative de locale dynamique pour les langues non reconnues : `try { new Intl.NumberFormat(langue) } catch { fallback 'fr-FR' }`

**Checkpoint** : Tous les cas du contrat `contracts/pipe-api.md` passent

---

## Phase 8 : Test visuel dans l'app parrecrivains

**Objectif** : Confirmer visuellement que le pipe fonctionne depuis l'app hôte (consommatrice de la lib) — non automatisé, confirmé par un humain dans le navigateur.

- [x] T020b [P] Créer le composant `src/frontend/projects/parrecrivains/src/app/features/test-pipe-mots/` (TEST-pipe-mots.ts, .html, .scss) qui liste tous les cas du contrat et affiche le résultat en temps réel via `| mots` et `| words` dans le template
- [x] T020c [P] Ajouter la route `test/pipe-mots` dans `app.routes.ts` → accessible à `/test/pipe-mots`

**Checkpoint** : Ouvrir `/test/pipe-mots` dans le navigateur — chaque cas affiche la valeur attendue

---

## Phase 9 : Finition

- [x] T021 [P] Incrémenter la version dans `src/frontend/projects/ngx-parrecrivains/package.json` → `0.2.0`
- [x] T022 [P] Mettre à jour `src/frontend/projects/ngx-parrecrivains/CHANGELOG.md` avec la section `[0.2.0]`
- [x] T022b Mettre à jour `src/frontend/projects/ngx-parrecrivains/README.md` — ajouter une section `MotsPipe / WordsPipe` (fr + en) documentant la signature `transform()`, les langues supportées (fr/en/cr), les formes custom, le fallback, et des exemples d'utilisation dans un template Angular
- [ ] T023 — ⏳ DIFFÉRÉ — Validation dans le repo de démo (github.com/MaiveCL/ngx-parrecrivains-demo) faite globalement à la fin, une fois tous les composants de la lib terminés (liseuse + pipe-mots + futurs)

---

## Ordre d'exécution

### Dépendances entre phases

- **Phase 1** (Mise en place) : démarre immédiatement
- **Phase 2** (Fondation) : dépend de Phase 1
- **Phase 3** (US1 fr) : dépend de Phase 2 — BLOQUE US2/US3/US4
- **Phase 4** (US2 en) : dépend de Phase 3 complétée (table de formes déjà en place)
- **Phase 5** (US3 words) : dépend de Phase 3 (MotsPipe doit exister)
- **Phase 6** (US4 cr) : dépend de Phase 3 (table de formes déjà en place)
- **Phase 7** (cas limites + custom) : dépend de Phase 3 (transform() doit exister)
- **Phase 8** (finition) : dépend de toutes les phases

### Opportunités de parallélisme

- T002 et T003 (squelettes) : parallèles
- T005 (tests US1), T010 (tests US2), T012 (tests US3), T014 (tests US4) : écrire en parallèle avant d'implémenter
- T016, T017, T018 (tests cas limites) : parallèles entre eux
- T021 et T022 (version + CHANGELOG) : parallèles

---

## Notes

- `[P]` = fichiers différents, sans dépendances — soumettre en parallèle
- `[USn]` = traçabilité vers la user story
- T006 + T007 + T008 construisent ensemble le `transform()` assemblé en T009 — séquentiel
- T011 et T015 peuvent être des no-ops si T006/T008 sont bien faits — vérifier simplement
- Committer après chaque phase ou groupe logique