---
description: "Task list — TempsLectureService"
---

# Tasks : TempsLectureService

**Input** : Documents de conception dans `specs/003-service-temps-lecture/`

**Prérequis** : plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ contracts/service-api.md ✅

## Format : `[ID] [P?] [Story?] Description`

- **[P]** : Peut tourner en parallèle (fichiers différents, pas de dépendances)
- **[Story]** : User story concernée (US1, US2, US3)
- Chemin de base lib : `src/frontend/projects/ngx-parrecrivains/`

---

## Phase 1 : Mise en place

**Objectif** : Créer la structure de fichiers squelette

- [x] T001 Créer le dossier `src/frontend/projects/ngx-parrecrivains/src/lib/temps-lecture/`
- [x] T002 [P] Créer le fichier squelette `src/frontend/projects/ngx-parrecrivains/src/lib/temps-lecture/temps-lecture.service.ts` — classe `TempsLectureService` vide avec `@Injectable({ providedIn: 'root' })` + constante `VITESSE_LECTURE_DEFAUT = 200` exportée
- [x] T003 [P] Créer le fichier squelette `src/frontend/projects/ngx-parrecrivains/src/lib/temps-lecture/temps-lecture.service.spec.ts` — structure de describe vide avec import de `TempsLectureService`

**Checkpoint** : Dossier et squelettes en place — prêt pour l'implémentation

---

## Phase 2 : Fondation

**Objectif** : Export public — aucune user story ne peut être testée sans ça

- [x] T004 Ajouter `export * from './lib/temps-lecture/temps-lecture.service';` dans `src/frontend/projects/ngx-parrecrivains/src/public-api.ts`

**Checkpoint** : Export public en place — les stories peuvent démarrer

---

## Phase 3 : User Story 1 — Estimation en secondes (Priorité : P1) 🎯 MVP

**Objectif** : `estimer(1000)` → `300`, `estimer(0)` → `0`, `estimer(null)` → `0`

**Test indépendant** : Instancier `new TempsLectureService()` sans TestBed et vérifier les résultats de la table de vérification du data-model.md (section `estimer`).

### Tests — US1

> **Écrire les tests en PREMIER, vérifier qu'ils ÉCHOUENT avant d'implémenter**

- [x] T005 [P] [US1] Dans `temps-lecture.service.spec.ts` — écrire les tests US1 : `estimer(1000)` → `300`, `estimer(0)` → `0`, `estimer(null)` → `0`, `estimer(undefined)` → `0`, `estimer(NaN)` → `0`, `estimer(Infinity)` → `0`, `estimer(-5)` → `0`, `estimer(1000.7)` → `300`

### Implémentation — US1

- [x] T006 [US1] Dans `temps-lecture.service.ts` — implémenter la normalisation de l'input (`null`/négatif → 0, décimal → `Math.floor`) et le calcul `Math.round((nombreMots / vitesse) * 60)` avec `VITESSE_LECTURE_DEFAUT` comme vitesse par défaut

**Checkpoint** : `estimer(1000)` → `300` — US1 testable indépendamment sans TestBed

---

## Phase 4 : User Story 2 — Durée formatée (Priorité : P1)

**Objectif** : `formater(300)` → `"5 min"`, `formater(3900)` → `"1 h 05 min"`, `formater(0)` → `"0 min"`

**Test indépendant** : Appeler `formater()` avec les valeurs de la table de vérification du data-model.md (section `formater`).

### Tests — US2

> **Écrire les tests en PREMIER, vérifier qu'ils ÉCHOUENT avant d'implémenter**

- [x] T007 [P] [US2] Dans `temps-lecture.service.spec.ts` — écrire les tests US2 : `formater(0)` → `"0 min"`, `formater(45)` → `"1 min"`, `formater(60)` → `"1 min"`, `formater(300)` → `"5 min"`, `formater(3600)` → `"1 h 00 min"`, `formater(3900)` → `"1 h 05 min"`, `formater(60000)` → `"16 h 40 min"`

### Implémentation — US2

- [x] T008 [US2] Dans `temps-lecture.service.ts` — implémenter `formater(secondes)` : cas `0` → `"0 min"` ; `1–59 s` → `"1 min"` (Math.ceil) ; `< 3600 s` → `"X min"` ; `≥ 3600 s` → `"X h MM min"` (minutes sur 2 chiffres avec padding zéro)

**Checkpoint** : US1 et US2 fonctionnelles indépendamment

---

## Phase 5 : User Story 3 — Vitesse personnalisée (Priorité : P2)

**Objectif** : `estimer(1000, 100)` → `600`, `estimer(1000, 0)` → `300` (fallback)

**Test indépendant** : Passer un deuxième argument à `estimer()` et vérifier le résultat — incluant le fallback sur vitesse invalide.

### Tests — US3

> **Écrire les tests en PREMIER, vérifier qu'ils ÉCHOUENT avant d'implémenter**

- [x] T009 [P] [US3] Dans `temps-lecture.service.spec.ts` — écrire les tests US3 : `estimer(1000, 100)` → `600`, `estimer(1000, 400)` → `150`, `estimer(1000, 0)` → `300` (fallback), `estimer(1000, -50)` → `300` (fallback)

### Implémentation — US3

- [x] T010 [US3] Dans `temps-lecture.service.ts` — vérifier que le paramètre `vitesseMots` est pris en compte dans `estimer()` et que le fallback sur `VITESSE_LECTURE_DEFAUT` est appliqué pour toute valeur ≤ 0 (normalement déjà implicite dans T006 — sinon compléter)

**Checkpoint** : Les 3 user stories fonctionnelles — tous les cas du contrat `contracts/service-api.md` passent

---

## Phase 6 : Test visuel dans l'app parrecrivains

**Objectif** : Confirmer visuellement que le service fonctionne depuis l'app hôte — confirmé par un humain dans le navigateur

- [x] T011 [P] Créer `src/frontend/projects/parrecrivains/src/app/features/test-temps-lecture/TEST-temps-lecture.ts` — composant affichant les cas du quickstart.md : slider pour nombre de mots, affichage `estimer()` + `formater()` en temps réel, champ pour vitesse custom
- [x] T012 [P] Créer `src/frontend/projects/parrecrivains/src/app/features/test-temps-lecture/TEST-temps-lecture.html` — template avec les bindings
- [x] T013 [P] Créer `src/frontend/projects/parrecrivains/src/app/features/test-temps-lecture/TEST-temps-lecture.scss` — styles sombres, même pattern que test-liseuse/ et test-pipe-mots/
- [x] T014 Ajouter la route `test/temps-lecture` dans `src/frontend/projects/parrecrivains/src/app/app.routes.ts` (section TEST — SUPPRIMER AVANT PUBLICATION)

**Checkpoint** : Ouvrir `/test/temps-lecture` dans le navigateur — le slider met à jour l'estimation en temps réel

---

## Phase 7 : Finition

- [x] T015 [P] Incrémenter la version dans `src/frontend/projects/ngx-parrecrivains/package.json` → `0.3.0`
- [x] T016 [P] Mettre à jour `src/frontend/projects/ngx-parrecrivains/CHANGELOG.md` avec la section `[0.3.0]`
- [x] T017 Mettre à jour `src/frontend/projects/ngx-parrecrivains/README.md` — ajouter une section `TempsLectureService` (fr + en) : signature de `estimer()` et `formater()`, `VITESSE_LECTURE_DEFAUT`, exemples d'usage dans un composant Angular
- [ ] T018 — ⏳ DIFFÉRÉ — Validation dans le repo de démo (github.com/MaiveCL/ngx-parrecrivains-demo) faite globalement à la fin, une fois tous les composants de la lib terminés

---

## Ordre d'exécution

### Dépendances entre phases

- **Phase 1** (Mise en place) : démarre immédiatement
- **Phase 2** (Fondation) : dépend de Phase 1
- **Phase 3** (US1) : dépend de Phase 2 — parallèle avec Phase 4
- **Phase 4** (US2) : dépend de Phase 2 — parallèle avec Phase 3 (`formater()` est indépendant de `estimer()` ; le squelette du fichier existe dès T002)
- **Phase 5** (US3) : dépend de Phase 3 (complète le paramètre `vitesseMots` de `estimer()`)
- **Phase 6** (test visuel) : dépend de Phase 3 + 4 + 5
- **Phase 7** (finition) : dépend de toutes les phases

### Opportunités de parallélisme

- T002 et T003 (squelettes) : parallèles
- T005 (tests US1) et T007 (tests US2) : parallèles entre eux — même fichier spec mais sections distinctes ; T009 (tests US3) aussi parallèle
- T006 (impl US1) et T008 (impl US2) : peuvent démarrer en parallèle après T002 — méthodes distinctes dans le même fichier
- T011, T012, T013 (test visuel) : parallèles
- T015 et T016 (version + CHANGELOG) : parallèles

---

## Notes

- Aucun TestBed requis — `new TempsLectureService()` suffit dans tous les tests
- T010 est probablement un no-op si T006 est bien fait — vérifier simplement
- Committer après chaque phase ou groupe logique
