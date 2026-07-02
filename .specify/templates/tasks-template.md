---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Conventions de chemins

- **Élément principal** : `src/frontend/projects/ngx-parrecrivains/src/lib/[nom-element]/`
- **Types exportés** : `src/frontend/projects/ngx-parrecrivains/src/lib/[nom-element]/types/`
- **i18n** : `src/frontend/projects/ngx-parrecrivains/public/i18n/[fr|en|cr].json`
- **Public API** : `src/frontend/projects/ngx-parrecrivains/src/public-api.ts`
- **Tests** : `[nom-element].spec.ts` au même niveau que le fichier testé

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

  The /speckit-tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/

  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment

  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1 : Mise en place (infrastructure partagée)

**Objectif** : Créer la structure de fichiers et les types de base

- [ ] T001 Créer le dossier `src/lib/[nom-element]/` et les fichiers squelettes (.ts, .html si composant, .scss si visuel)
- [ ] T002 [P] Définir les types, interfaces et constantes dans `types/[nom-element].types.ts`
- [ ] T003 [P] Ajouter les clés i18n dans `public/i18n/fr.json`, `en.json`, `cr.json`

---

## Phase 2 : Fondation (prérequis bloquants)

**Objectif** : Infrastructure de base requise avant toute user story

**⚠️ CRITIQUE** : Aucune user story ne peut démarrer avant cette phase

Exemples de tâches fondatrices (adapter selon l'élément) :

- [ ] T004 Implémenter le service interne de base (si nécessaire)
- [ ] T005 [P] Mettre en place `TraductionService` ou autre service partagé (si non existant)
- [ ] T006 Exporter l'élément dans `public-api.ts` (`export *`)

**Checkpoint** : Fondation prête — les user stories peuvent démarrer

---

## Phase 3 : User Story 1 — [Titre] (Priorité : P1) 🎯 MVP

**Objectif** : [Ce que cette story livre]

**Test indépendant** : [Comment vérifier que cette story fonctionne seule]

### Tests — US1 (OPTIONNEL — uniquement si demandé dans la spec) ⚠️

> **NOTE : Écrire les tests en PREMIER, vérifier qu'ils ÉCHOUENT avant d'implémenter**

- [ ] T010 [P] [US1] Test unitaire `[nom-element].spec.ts` — cas nominal
- [ ] T011 [P] [US1] Test unitaire `[nom-element].spec.ts` — cas limite / erreur

### Implémentation — US1

- [ ] T012 [P] [US1] Implémenter `[nom-element].ts` — logique principale
- [ ] T013 [P] [US1] Implémenter `[nom-element].html` (si composant)
- [ ] T014 [US1] Implémenter `[nom-element].scss` (si composant visuel)
- [ ] T015 [US1] Brancher les clés i18n dans le template / la logique

**Checkpoint** : US1 fonctionnelle et testable indépendamment

---

## Phase 4 : User Story 2 — [Titre] (Priorité : P2)

**Objectif** : [Ce que cette story livre]

**Test indépendant** : [Comment vérifier que cette story fonctionne seule]

### Tests — US2 (OPTIONNEL) ⚠️

- [ ] T018 [P] [US2] Test unitaire `[nom-element].spec.ts` — cas nominal US2
- [ ] T019 [P] [US2] Test unitaire `[nom-element].spec.ts` — cas limite US2

### Implémentation — US2

- [ ] T020 [P] [US2] Implémenter [fonctionnalité] dans `[nom-element].ts`
- [ ] T021 [US2] Mettre à jour le template (si composant)
- [ ] T022 [US2] Intégrer avec US1 si nécessaire

**Checkpoint** : US1 et US2 fonctionnelles et testables indépendamment

---

## Phase 5 : User Story 3 — [Titre] (Priorité : P3)

**Objectif** : [Ce que cette story livre]

**Test indépendant** : [Comment vérifier que cette story fonctionne seule]

### Tests — US3 (OPTIONNEL) ⚠️

- [ ] T024 [P] [US3] Test unitaire — cas nominal US3
- [ ] T025 [P] [US3] Test unitaire — cas limite US3

### Implémentation — US3

- [ ] T026 [P] [US3] Implémenter [fonctionnalité] dans `[nom-element].ts`
- [ ] T027 [US3] Mettre à jour le template (si composant)

**Checkpoint** : Toutes les user stories fonctionnelles indépendamment

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N : Finition & transversal

**Objectif** : Améliorations qui touchent plusieurs user stories

- [ ] TXXX [P] Mettre à jour `CHANGELOG.md` avec la nouvelle version
- [ ] TXXX [P] Vérifier `public-api.ts` — tous les types nécessaires exportés ?
- [ ] TXXX Valider le quickstart.md (installer dans un projet Angular vierge)
- [ ] TXXX Tests complémentaires si demandés
- [ ] TXXX Incrémenter la version dans `package.json` (semver)

---

## Ordre d'exécution

### Dépendances entre phases

- **Phase 1 (Mise en place)** : aucune dépendance — démarrage immédiat
- **Phase 2 (Fondation)** : dépend de la Phase 1 — BLOQUE toutes les user stories
- **User stories (Phase 3+)** : dépendent de la Phase 2 — ensuite ordre P1 → P2 → P3
- **Phase N (Finition)** : dépend de toutes les user stories visées

### Au sein de chaque user story

- Tests (si demandés) DOIVENT être écrits et ÉCHOUER avant l'implémentation
- Types/interfaces avant la logique
- Logique principale avant le template
- Template avant les styles
- Story complète avant de passer à la suivante

### Opportunités de parallélisme

- Les tâches marquées `[P]` n'ont pas de dépendances entre elles — les soumettre simultanément
- Les tests d'une même story marqués `[P]` peuvent tourner en parallèle

---

## Notes

- `[P]` = fichiers différents, aucune dépendance — exécuter en parallèle
- `[USn]` = traçabilité vers la user story
- Chaque user story doit être testable indépendamment avant de passer à la suivante
- Committer après chaque tâche ou groupe logique
- Éviter : tâches vagues, conflits sur le même fichier, dépendances croisées entre stories
