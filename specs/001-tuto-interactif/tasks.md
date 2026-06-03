# Tasks: Scaffold Pédagogique Interactif (tuto-depart)

**Input**: Design documents from `/specs/001-tuto-interactif/`

**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅

**Tests**: Non demandés dans la spec — section tests omise.

**Organisation**: Tâches groupées par user story pour permettre implémentation et validation
indépendantes. Les 4 pages de tuto (US2–US4) sont développées en parallèle une fois les
composants partagés prêts.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Peut s'exécuter en parallèle (fichiers différents, aucune dépendance incomplète)
- **[Story]**: User story associée (US1–US4 depuis spec.md)
- Chemins relatifs à la racine du repo

---

## Phase 1: Setup (Infrastructure partagée)

**Objectif**: Fichiers de base, config Angular, structure de dossiers.

- [ ] T001 Ajouter `provideHttpClient()` dans `src/src/app/app.config.ts` (import depuis `@angular/common/http`)
- [ ] T002 [P] Créer les fichiers i18n vides avec structure JSON de base dans `src/src/assets/i18n/fr.json` et `src/src/assets/i18n/en.json` (objet vide `{}` pour l'instant — rempli par phase)
- [ ] T003 [P] Créer les dossiers de feature : `src/src/app/accueil/`, `src/src/app/tutos/isbn/`, `src/src/app/tutos/mots/`, `src/src/app/tutos/temps-lecture/`, `src/src/app/tutos/liseuse/`, `src/src/app/shared/nav/`, `src/src/app/shared/snippet/`, `src/src/app/shared/slot/`, `src/src/app/shared/services/`

**Checkpoint**: La config Angular compile (`ng build` réussit).

---

## Phase 2: Fondation (Prérequis bloquants)

**Objectif**: Services et composants partagés utilisés par toutes les pages de tuto.

**⚠️ CRITIQUE**: Aucune page de tuto ne peut être implémentée avant que cette phase soit complète.

- [ ] T004 Créer `LangueService` dans `src/src/app/shared/services/langue.service.ts` — signal `langue = signal<'fr' | 'en'>('fr')`, signal `traductions = signal<Record<string,string>>({})`, méthode `charger(l)` via HttpClient, méthode `t(cle: string): string` retournant `traductions()[cle] ?? cle`
- [ ] T005 [P] Créer `SnippetComponent` dans `src/src/app/shared/snippet/snippet.ts` — input `code: string`, input `label?: string`, bouton "Copier" qui copie `code` dans le presse-papiers, template inline, `ChangeDetectionStrategy.OnPush`
- [ ] T006 [P] Créer `SlotComponent` dans `src/src/app/shared/slot/slot.ts` — affiche un `<div>` avec style cadre pointillé + texte placeholder "Le composant apparaîtra ici" + `<ng-content>` pour le contenu projeté, template inline, `ChangeDetectionStrategy.OnPush`
- [ ] T007 Créer `NavComponent` dans `src/src/app/shared/nav/nav.ts` et `nav.html` — injecte `LangueService`, liens `routerLink` vers `/`, `/tutos/isbn`, `/tutos/mots`, `/tutos/temps-lecture`, `/tutos/liseuse`, bouton sélecteur fr/en appelant `langue.charger()`, `routerLinkActive="active"` sur chaque lien
- [ ] T008 Mettre à jour `AppComponent` dans `src/src/app/app.ts` et `src/src/app/app.html` — ajouter `<app-nav>` + `<router-outlet>`, injecter `LangueService` et appeler `charger('fr')` au `ngOnInit`, importer `NavComponent` et `RouterOutlet`
- [ ] T009 Configurer les 5 routes lazy-loaded dans `src/src/app/app.routes.ts` selon le contrat `specs/001-tuto-interactif/contracts/routes.md` (accueil + 4 tutos + `**` → redirect)

**Checkpoint**: `ng serve` fonctionne, la navbar s'affiche, la navigation entre routes fonctionne (pages vides acceptées).

---

## Phase 3: User Story 1 — Installation guidée (P1) 🎯 MVP

**Objectif**: Un·e étudiant·e arrive sur la page d'accueil et comprend ce qui est déjà fait
et ce qu'il·elle doit faire pour démarrer.

**Test indépendant**: Ouvrir `/` → voir les deux sections "Déjà fait" et "À faire" avec
leurs commandes, changer la langue → tout le contenu change.

### Implémentation US1

- [ ] T010 [US1] Créer `AccueilComponent` dans `src/src/app/accueil/accueil.ts` et `accueil.html` — injecte `LangueService`, affiche titre + description via `langue.t('accueil.titre')`, liste `etapesFaites` (statut 'fait', 3 étapes) et `etapesAfaire` (statut 'afaire', 4 étapes) depuis `data-model.md`, chaque étape affiche label + commande dans un `<app-snippet>`, `ChangeDetectionStrategy.OnPush`
- [ ] T011 [US1] Ajouter section "Choisissez un composant" dans `src/src/app/accueil/accueil.html` — 4 cartes cliquables (routerLink) vers chaque page de tuto avec nom du composant et version
- [ ] T012 [P] [US1] Remplir les clés i18n de l'accueil dans `src/src/assets/i18n/fr.json` et `src/src/assets/i18n/en.json` — toutes les clés `accueil.*` et `nav.*` selon le contrat `specs/001-tuto-interactif/contracts/i18n-keys.md`
- [ ] T013 [US1] Ajouter styles de base dans `src/src/app/accueil/accueil.scss` — mise en page des deux sections (fait/afaire), cartes de navigation, icône ✅ / ⬜ selon statut

**Checkpoint**: Ouvrir `http://localhost:4200/` → page d'accueil complète et fonctionnelle,
changement de langue fr↔en opérationnel.

---

## Phase 4: User Story 2 — Intégration d'un composant (P1)

**Objectif**: Chaque page de tuto présente les informations du composant, les snippets
d'intégration, et un slot visuel réservé au composant à venir.

**Test indépendant**: Ouvrir n'importe quelle page de tuto `/tutos/isbn` (ou autre) →
voir la section info + les 3 snippets d'intégration + le slot avec cadre pointillé.
Chaque page est testable indépendamment des autres.

### Implémentation US2

- [ ] T014 [P] [US2] Créer `TutoIsbnComponent` dans `src/src/app/tutos/isbn/tuto-isbn.ts` et `tuto-isbn.html` :
  - TS : `isbn = new FormControl('', [Validators.required])` (PAS d'isbnValidator — intentionnel), signal `dernierTest = signal<string>('')`
  - HTML : section info (titre, version, description, tableau des clés d'erreur), 3 blocs `<app-snippet>` (import TS / ajout dans imports[] N/A / usage dans FormControl), `<app-slot>` contenant le formulaire pré-câblé (input + `@if` pour chaque type d'erreur — messages présents mais erreurs jamais déclenchées sans isbnValidator)
  - `ChangeDetectionStrategy.OnPush`, importe `ReactiveFormsModule`, `SnippetComponent`, `SlotComponent`

- [ ] T015 [P] [US2] Créer `TutoMotsComponent` dans `src/src/app/tutos/mots/tuto-mots.ts` et `tuto-mots.html` :
  - TS : `nombreMots = signal(1234)`
  - HTML : section info (titre, version, description, table des paramètres), 3 blocs `<app-snippet>` (import MotsPipe / ajout dans imports[] / `{{ nombreMots() | mots }}`), `<app-slot>` contenant `<p>{{ nombreMots() }}</p>` (sans le pipe — c'est l'élément manquant que l'utilisateur ajoute)
  - `ChangeDetectionStrategy.OnPush`, importe `SnippetComponent`, `SlotComponent`

- [ ] T016 [P] [US2] Créer `TutoTempsLectureComponent` dans `src/src/app/tutos/temps-lecture/tuto-temps-lecture.ts` et `tuto-temps-lecture.html` :
  - TS : `nombreMots = signal(1000)`, `tempsAffiche = signal('??')` (placeholder — sera remplacé par un `computed()` quand l'utilisateur injecte le service)
  - HTML : section info (titre, version, description, tableau des méthodes), 3 blocs `<app-snippet>` (import + inject / computed() / usage dans template), `<app-slot>` contenant `<p>{{ tempsAffiche() }}</p>`
  - `ChangeDetectionStrategy.OnPush`, importe `SnippetComponent`, `SlotComponent`

- [ ] T017 [P] [US2] Créer `TutoLiseuseComponent` dans `src/src/app/tutos/liseuse/tuto-liseuse.ts` et `tuto-liseuse.html` :
  - TS : `contenu = signal('Il était une fois, dans une bibliothèque sans fin...')`
  - HTML : section info (titre, version, description, table des inputs/outputs), 3 blocs `<app-snippet>` (import LiseuseManuscritComponent / ajout dans imports[] / `<ngx-liseuse-manuscrit [contenu]="contenu()" />`), `<app-slot>` vide (l'utilisateur y ajoute la balise)
  - `ChangeDetectionStrategy.OnPush`, importe `SnippetComponent`, `SlotComponent`

- [ ] T018 [US2] Remplir les clés i18n des 4 pages de tuto (sections info + snippets + labels slot) dans `src/src/assets/i18n/fr.json` et `src/src/assets/i18n/en.json` — clés `tuto.isbn.*`, `tuto.mots.*`, `tuto.temps.*`, `tuto.liseuse.*`, `commun.*` selon le contrat i18n-keys.md

**Checkpoint**: Naviguer vers chaque page de tuto (`/tutos/isbn`, `/tutos/mots`, etc.) →
chaque page affiche sa section info, ses 3 snippets copiables, et un slot avec cadre pointillé.

---

## Phase 5: User Story 3 — Tests interactifs pré-câblés (P2)

**Objectif**: Chaque page de tuto propose des boutons de test qui manipulent des signals
Angular pré-câblés et affichent le payload qu'ils vont envoyer.

**Test indépendant**: Ouvrir `/tutos/mots` → cliquer "1 234 mots" → voir `nombreMots`
changer dans le slot (1234 → `{{ nombreMots() }}`). Boutons fonctionnent même sans la lib
installée.

### Implémentation US3

- [ ] T019 [P] [US3] Ajouter les boutons de test dans `src/src/app/tutos/isbn/tuto-isbn.ts` et `tuto-isbn.html` :
  - TS : méthode `testerIsbn(valeur: string)` → `this.isbn.setValue(valeur); this.dernierTest.set(valeur)`, 3 scénarios (ISBN-13 valide `9782764633291`, format invalide `12345`, checksum incorrect `9782764633290`)
  - HTML : section "Boutons de test" avec 3 boutons, sous chaque bouton un `<app-snippet>` affichant le `codeDisplay` du scénario, zone résultat montrant `isbn.errors | json` ou "Valide ✅"

- [ ] T020 [P] [US3] Ajouter les boutons de test dans `src/src/app/tutos/mots/tuto-mots.ts` et `tuto-mots.html` :
  - TS : méthode `testerMots(n: number)` → `this.nombreMots.set(n)`, 4 scénarios (1, 1234, 45231, 0)
  - HTML : section "Boutons de test" avec 4 boutons, `<app-snippet>` par bouton affichant `nombreMots.set(n)`, zone résultat affichant la valeur actuelle de `nombreMots()`

- [ ] T021 [P] [US3] Ajouter les boutons de test dans `src/src/app/tutos/temps-lecture/tuto-temps-lecture.ts` et `tuto-temps-lecture.html` :
  - TS : méthode `testerTemps(n: number)` → `this.nombreMots.set(n)`, 3 scénarios (600, 80000, 15000)
  - HTML : section "Boutons de test" avec 3 boutons, `<app-snippet>` par bouton affichant `nombreMots.set(n)`, zone résultat affichant `nombreMots()` mots → `tempsAffiche()`

- [ ] T022 [P] [US3] Ajouter les boutons de test dans `src/src/app/tutos/liseuse/tuto-liseuse.ts` et `tuto-liseuse.html` :
  - TS : méthode `testerContenu(c: string)` → `this.contenu.set(c)`, 3 scénarios (texte brut, HTML, URL Google Docs)
  - HTML : section "Boutons de test" avec 3 boutons, `<app-snippet>` par bouton affichant le code `contenu.set(...)`, zone résultat affichant les premiers 100 caractères de `contenu()` ou le type détecté

- [ ] T023 [US3] Ajouter les clés i18n des boutons de test dans `src/src/assets/i18n/fr.json` et `src/src/assets/i18n/en.json` — clés `tuto.*.test.*` et `commun.tests.*` selon le contrat i18n-keys.md

**Checkpoint**: Sur chaque page de tuto, cliquer chaque bouton → le `<app-snippet>` adjacent
affiche le code, la zone résultat change. Aucune erreur console. Aucun appel à `ngx-parrecrivains`.

---

## Phase 6: User Story 4 — Diagnostic et configuration (P3)

**Objectif**: Chaque page de tuto propose une section "Problèmes fréquents" avec au moins
3 entrées (symptôme + cause + solution) couvrant les erreurs d'intégration courantes.

**Test indépendant**: Ouvrir `/tutos/isbn` → voir la section "Problèmes fréquents" avec
≥ 3 entrées, chacune ayant les 3 champs requis. Testable sans boutons ni slot.

### Implémentation US4

- [ ] T024 [P] [US4] Ajouter section "Problèmes fréquents" dans `src/src/app/tutos/isbn/tuto-isbn.html` — 3 entrées : (1) aucune erreur ISBN malgré ISBN incorrect → isbnValidator() manquant, (2) isbnFormat sur ISBN avec tirets → entrer sans tirets, (3) erreur TypeScript Cannot find module → npm install ngx-parrecrivains
- [ ] T025 [P] [US4] Ajouter section "Problèmes fréquents" dans `src/src/app/tutos/mots/tuto-mots.html` — 3 entrées : (1) nombre sans formatage → pipe | mots manquant, (2) MotsPipe inconnu → manquant dans imports[], (3) espace étrange → comportement normal (espace fine insécable)
- [ ] T026 [P] [US4] Ajouter section "Problèmes fréquents" dans `src/src/app/tutos/temps-lecture/tuto-temps-lecture.html` — 3 entrées : (1) temps reste à "??" → service non injecté, (2) valeur en secondes au lieu de "5 min" → utiliser formater(), (3) Cannot find module → npm install
- [ ] T027 [P] [US4] Ajouter section "Problèmes fréquents" dans `src/src/app/tutos/liseuse/tuto-liseuse.html` — 3 entrées : (1) liseuse invisible → balise manquante dans le template, (2) hauteur à 0 → ajouter height CSS sur conteneur, (3) "Document privé" Google Docs → configurer le partage public
- [ ] T028 [US4] Ajouter les clés i18n des problèmes fréquents dans `src/src/assets/i18n/fr.json` et `src/src/assets/i18n/en.json` — clés `tuto.*.probleme.*` et `commun.problemes.*` selon le contrat i18n-keys.md

**Checkpoint**: Chaque page de tuto affiche une section "Problèmes fréquents" complète
avec ≥ 3 entrées formatées (symptôme / cause / solution).

---

## Phase 7: Polish & Finalisation

**Objectif**: Styles visuels cohérents, accessibilité de base, validation fonctionnelle
avant démo.

- [ ] T029 Ajouter styles globaux dans `src/src/styles.scss` — police de base, couleurs (fond, texte, accent), reset minimal, variables CSS pour réutilisation
- [ ] T030 [P] Ajouter styles `src/src/app/shared/nav/nav.scss` — layout horizontal navbar, lien actif mis en évidence, bouton langue, responsive basique
- [ ] T031 [P] Affiner styles `src/src/app/shared/slot/slot.ts` — cadre pointillé avec couleur, icône ou texte placeholder centré, hauteur minimale visible même sans contenu
- [ ] T032 [P] Affiner styles `src/src/app/shared/snippet/snippet.ts` — fond sombre (code block), monospace, bouton "Copier" positionné en haut à droite, feedback visuel au clic
- [ ] T033 Valider accessibilité WCAG AA de base — attributs `aria-label` sur les boutons sans texte visible, contraste couleurs suffisant, focus visible sur tous les éléments interactifs (vérifier dans `nav.html`, `accueil.html`, chaque `tuto-*.html`)

**Checkpoint final**: `ng build --base-href /ngx-parrecrivains/` réussit sans erreur.
Naviguer manuellement toutes les pages, tester changement de langue, tester tous les boutons.

---

## Dépendances & Ordre d'exécution

### Dépendances entre phases

- **Phase 1** (Setup) : aucune dépendance — commence immédiatement
- **Phase 2** (Fondation) : dépend de Phase 1 — **bloque toutes les user stories**
- **Phase 3** (US1 - Accueil) : dépend de Phase 2
- **Phase 4** (US2 - Pages tuto) : dépend de Phase 2 (T005, T006 — SlotComponent, SnippetComponent)
- **Phase 5** (US3 - Boutons) : dépend de Phase 4 (les pages doivent exister)
- **Phase 6** (US4 - Problèmes) : dépend de Phase 4 (les pages doivent exister)
- **Phase 7** (Polish) : dépend de toutes les phases précédentes

### Dépendances entre user stories

- **US1** : peut commencer dès Phase 2 terminée — indépendante de US2/US3/US4
- **US2** : peut commencer dès Phase 2 terminée — les 4 pages sont indépendantes entre elles [T014–T017]
- **US3** : dépend de Phase 4 (US2) — les boutons s'ajoutent aux pages existantes
- **US4** : dépend de Phase 4 (US2) — la section s'ajoute aux pages existantes

### Opportunités de parallélisme

- **T002, T003** : en parallèle (fichiers différents)
- **T005, T006** : en parallèle (composants distincts)
- **T014, T015, T016, T017** : en parallèle (4 fichiers distincts)
- **T019, T020, T021, T022** : en parallèle (4 fichiers distincts)
- **T024, T025, T026, T027** : en parallèle (4 fichiers distincts)
- **T029, T030, T031, T032** : en parallèle (fichiers distincts)
- **US3 et US4** : peuvent avancer en parallèle après Phase 4

---

## Stratégie d'implémentation

### MVP — Démo de classe (US1 + US2)

1. Compléter Phase 1 (Setup)
2. Compléter Phase 2 (Fondation)
3. Compléter Phase 3 (US1 — Accueil)
4. Compléter Phase 4 (US2 — Pages de tuto sans boutons)
5. **STOP et VALIDER** : le site est déjà utilisable pour la démo — US1 + US2 couvrent les objectifs principaux
6. Poursuivre avec US3 (boutons) puis US4 (problèmes fréquents)

### Livraison incrémentale

1. Setup + Fondation → navbar + routing
2. + US1 → page d'accueil complète → **démo possible**
3. + US2 → pages de tuto avec slots → **démo principale**
4. + US3 → boutons interactifs → **démo enrichie**
5. + US4 → section diagnostic → **démo complète**

---

## Résumé

| Phase | Tâches | User Story |
|---|---|---|
| 1 — Setup | T001–T003 | — |
| 2 — Fondation | T004–T009 | — |
| 3 — Accueil | T010–T013 | US1 (P1) |
| 4 — Pages tuto | T014–T018 | US2 (P1) |
| 5 — Boutons | T019–T023 | US3 (P2) |
| 6 — Problèmes | T024–T028 | US4 (P3) |
| 7 — Polish | T029–T033 | — |
| **Total** | **33 tâches** | |

**Tâches parallélisables** : 20 / 33 (61 %)
