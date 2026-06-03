# Feature Specification: Scaffold Pédagogique Interactif (tuto-depart)

**Feature Branch**: `001-tuto-interactif`

**Created**: 2026-06-03

**Status**: Draft

**Input**: User description: scaffold pédagogique interactif — page d'accueil installation + une
page de tuto par composant ngx-parrecrivains avec boutons de test pré-câblés

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Installation guidée (Priority: P1)

Un·e étudiant·e ou développeur·e externe arrive sur le site pour la première fois. Il·elle
consulte la page d'accueil, comprend ce qui a déjà été fait (projet créé, dépendances de base
installées), et suit les étapes restantes pour être prêt·e à intégrer un composant de la lib.

**Why this priority**: C'est la porte d'entrée obligatoire. Sans setup réussi, aucune autre
page ne peut être utilisée. C'est aussi ce qui sera démontré le jour de la démo en classe.

**Independent Test**: Peut être validé indépendamment en demandant à quelqu'un de suivre la
page d'accueil depuis zéro et de vérifier que l'environnement est fonctionnel à la fin.

**Acceptance Scenarios**:

1. **Given** que l'utilisateur arrive sur la page d'accueil, **When** il la parcourt,
   **Then** il voit une section « Ce qui est déjà fait » listant les étapes complétées
   (ex. projet Angular créé, structure de base en place).
2. **Given** la section « À faire », **When** l'utilisateur suit les étapes,
   **Then** il peut cloner la branche, installer la lib et confirmer que l'environnement
   est prêt à recevoir un composant.
3. **Given** la page d'accueil, **When** l'utilisateur sélectionne une langue (fr/en),
   **Then** tout le contenu textuel s'affiche dans la langue choisie.

---

### User Story 2 — Intégration d'un composant (Priority: P1)

L'utilisateur·trice navigue vers la page de tutoriel d'un composant. Il·elle suit les 3 actions
minimales demandées (ajouter l'import, la balise HTML, et l'élément spécifique au type de
composant), et voit le composant s'afficher dans l'emplacement prévu.

**Why this priority**: C'est l'objectif central du tuto. Chaque page de composant doit être
autonome et mener à un résultat visible.

**Independent Test**: Peut être validé en testant une seule page (ex. isbnValidator) sans
avoir vu les autres pages de composants.

**Acceptance Scenarios**:

1. **Given** une page de composant vierge, **When** l'utilisateur ajoute les 3 éléments
   demandés dans son code, **Then** le composant s'affiche dans l'emplacement réservé.
2. **Given** la section d'instructions d'intégration, **When** l'utilisateur copie le
   snippet fourni, **Then** il peut le coller directement dans son fichier sans modification.
3. **Given** une page de composant, **When** l'emplacement est vide (avant intégration),
   **Then** une zone visuelle clairement balisée indique où le composant apparaîtra.

---

### User Story 3 — Tests interactifs pré-câblés (Priority: P2)

Sans écrire de logique applicative, l'utilisateur·trice clique sur des boutons de test
pré-programmés qui couvrent les cas d'utilisation courants du composant. Un encadré montre le
code/payload du bouton avant le clic. Un résultat s'affiche après.

**Why this priority**: Permet de valider l'intégration rapidement sans avoir à inventer des
données de test. Rend la démo vivante et convaincante.

**Independent Test**: Peut être validé en vérifiant que chaque bouton produit un résultat
visible et distinct, sans que l'utilisateur ait eu à écrire la moindre ligne de logique.

**Acceptance Scenarios**:

1. **Given** un composant correctement intégré, **When** l'utilisateur clique sur un bouton
   de test, **Then** le composant reçoit les données du bouton et réagit visuellement.
2. **Given** un bouton de test, **When** l'utilisateur le survole ou le consulte avant de
   cliquer, **Then** un encadré affiche le payload/code que ce bouton enverra.
3. **Given** la page isbnValidator, **When** l'utilisateur clique « ISBN valide »
   puis « ISBN invalide », **Then** les deux résultats s'affichent distinctement dans
   la zone de résultat.

---

### User Story 4 — Diagnostic et configuration (Priority: P3)

L'utilisateur·trice rencontre un problème à l'intégration. Il·elle consulte la section
« Problèmes fréquents » de la page du composant et trouve une solution applicable.

**Why this priority**: Réduit le besoin d'aide externe pendant un exercice en classe. Complète
le tutoriel sans en être le cœur.

**Independent Test**: Peut être validé en vérifiant que les erreurs les plus communes sont
documentées avec cause + solution, indépendamment du reste du tutoriel.

**Acceptance Scenarios**:

1. **Given** la section « Problèmes fréquents », **When** l'utilisateur la consulte,
   **Then** chaque entrée présente : le symptôme, la cause probable, et la solution.
2. **Given** un problème d'import manquant, **When** l'utilisateur cherche dans la section,
   **Then** il trouve l'entrée correspondante avec la ligne exacte à ajouter.

---

### Edge Cases

- Que se passe-t-il si l'utilisateur teste les boutons avant d'avoir intégré le composant ?
  → L'emplacement reste vide mais aucune erreur cassante ne doit apparaître.
- Que se passe-t-il si la lib n'est pas encore installée ?
  → La page affiche toujours les instructions et les snippets ; seul le composant est absent.

---

## Requirements *(mandatory)*

### Functional Requirements

**Page d'accueil**

- **FR-001**: La page d'accueil DOIT afficher une section « Ce qui est déjà fait » listant
  les étapes de setup complétées dans la branche (statique, non détecté dynamiquement).
- **FR-002**: La page d'accueil DOIT afficher une section « À faire » avec les étapes
  restantes : cloner la branche, installer la lib, vérifier les prérequis.
- **FR-003**: Chaque étape DOIT inclure la commande exacte à exécuter (copy-paste ready).

**Navigation**

- **FR-004**: Le site DOIT proposer une navigation vers une page de tuto par composant
  (4 pages : LiseuseManuscrit, MotsPipe/WordsPipe, TempsLectureService, isbnValidator).
- **FR-005**: La navigation DOIT inclure un sélecteur de langue (fr/en minimum).

**Pages de composant — structure obligatoire**

- **FR-006**: Chaque page DOIT présenter une section d'information détaillée sur le composant
  (description, propriétés/paramètres, événements émis si applicable).
- **FR-007**: Chaque page DOIT afficher un emplacement réservé visuellement distinct où le
  composant s'affichera une fois intégré.
- **FR-008**: L'emplacement réservé DOIT être visible même avant l'intégration, avec un
  indicateur visuel (ex. cadre pointillé + texte descriptif).
- **FR-009**: Chaque page DOIT fournir les 3 snippets d'intégration minimaux :
  (1) import dans le fichier TypeScript, (2) ajout dans `imports[]` du composant,
  (3) balise HTML à placer dans le template.
- **FR-010**: Pour les composants de type validator ou pipe, la page DOIT indiquer
  l'élément supplémentaire spécifique à ajouter (ex. validator dans `Validators.compose([])`).
- **FR-011**: Chaque page DOIT inclure une section « Problèmes fréquents » couvrant les
  erreurs les plus courantes (import manquant, mauvaise version, mauvaise utilisation).

**Boutons de test**

- **FR-012**: Chaque page DOIT inclure au minimum 2 boutons de test couvrant des cas d'usage
  distincts (ex. données valides / données invalides, ou configurations différentes).
- **FR-013**: Chaque bouton DOIT être accompagné d'un encadré montrant le code ou le payload
  qu'il enverra au composant.
- **FR-014**: Un bouton « Valider » ou équivalent DOIT déclencher l'affichage du résultat
  dans une zone dédiée.
- **FR-015**: Les boutons de test DOIVENT être entièrement pré-câblés — l'utilisateur
  n'écrit aucune logique pour les faire fonctionner.

**Internationalisation**

- **FR-016**: Tout le contenu textuel DOIT être externalisé dans des fichiers de traduction
  (fr par défaut, en minimum) — aucun texte codé en dur dans les templates.
- **FR-017**: Le changement de langue DOIT être immédiat, sans rechargement de page.

### Key Entities

- **TutorialPage** : page dédiée à un composant de la lib ; contient les sections
  info, intégration, slot, test, diagnostic.
- **ComponentSlot** : zone réservée dans la page où le composant apparaîtra une fois
  les imports et la balise ajoutés par l'utilisateur.
- **TestScenario** : bouton pré-câblé avec payload défini, code affiché dans un encadré,
  et zone de résultat associée.
- **InstallationStep** : étape de la checklist d'accueil avec statut (fait / à faire)
  et commande copy-paste.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un étudiant peut compléter le setup et afficher un premier composant en
  moins de 15 minutes en suivant uniquement les instructions du site.
- **SC-002**: Chaque page de composant peut être utilisée indépendamment, sans avoir
  visité les autres.
- **SC-003**: 100 % des boutons de test produisent un résultat visible et distinct sans
  que l'utilisateur écrive la moindre logique.
- **SC-004**: La section « Problèmes fréquents » couvre au minimum 3 erreurs d'intégration
  documentées par composant.
- **SC-005**: Le changement de langue fr ↔ en est disponible sur toutes les pages sans
  rechargement.

---

## Assumptions

- L'utilisateur a Angular CLI installé et une connexion internet disponible pour `npm install`.
- La section « Ce qui est déjà fait » est une liste statique dans le code, pas une détection
  dynamique de l'état du projet.
- Le CSS et la logique des boutons de test sont pré-écrits dans le code de la branche —
  l'utilisateur n'a rien à styler ni à câbler.
- Les 4 composants (v0.1–v0.4) ont chacun leur page de tuto dans `tuto-depart`, même si
  certains composants ne sont pas encore publiés au moment de la démo de classe.
- La page de chaque composant scaffold l'élément manquant spécifique à son type :
  validator pour isbnValidator, pipe dans le template pour MotsPipe, injection de service
  pour TempsLectureService, balise HTML pour LiseuseManuscrit.
- La branche `tuto-depart` ne contient pas la lib installée — c'est l'action demandée
  à l'utilisateur.
