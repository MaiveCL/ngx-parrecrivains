# Feature Specification: Liseuse de manuscrit (ngx-manuscript-reader)

**Feature Branch**: `001-manuscript-reader`

**Created**: 2026-05-27

**Status**: Draft

---

## User Scenarios & Testing

### User Story 1 — Lire un manuscrit dans une interface confortable (Priority: P1)

Un lecteur reçoit un accès à un manuscrit littéraire via une application web.
Il ouvre le composant liseuse, qui affiche le contenu dans une mise en page conçue
pour la lecture longue durée — colonnes étroites, typographie généreuse, sans distractions.

**Why this priority**: C'est la raison d'être du composant. Toutes les autres fonctionnalités
en dépendent.

**Independent Test**: Fournir un contenu texte brut → vérifier que le texte s'affiche
avec les marges correctes, la taille de police par défaut, la largeur de colonne adaptée
à l'écran, et aucun élément UI superflu visible.

**Acceptance Scenarios**:

1. **Given** un contenu texte fourni en string, **When** le composant est initialisé,
   **Then** le texte s'affiche dans une colonne de ~70 caractères/ligne sur ordinateur
   et ~35 sur mobile.
2. **Given** une police à 18px par défaut, **When** le lecteur n'a pas modifié les réglages,
   **Then** le texte est affiché en 18px avec un interligne de 1.6.
3. **Given** le titre et l'auteur fournis en inputs, **When** le panneau d'informations
   est visible, **Then** titre et auteur apparaissent dans le panneau latéral.
4. **Given** un fichier .pdf fourni, **When** le composant charge le document,
   **Then** le PDF s'affiche tel quel via rendu natif (sans extraction de texte).
5. **Given** une URL Google Docs publique, **When** le composant charge l'URL,
   **Then** le document s'affiche dans un iframe embarqué.

---

### User Story 2 — Adapter l'affichage à ses préférences visuelles (Priority: P2)

Un lecteur lit pendant une heure dans un environnement sombre. Il active le mode nuit,
augmente la taille de police, et ajoute un filtre sépia pour réduire la fatigue oculaire.
Un autre lecteur sur une tablette à l'extérieur augmente la luminosité via le curseur.

**Why this priority**: Le confort de lecture est central pour un manuscrit long. Ces réglages
différencient la liseuse d'un simple affichage de texte.

**Independent Test**: Activer le mode nuit → vérifier le changement de thème.
Modifier la taille de police → vérifier l'ajustement immédiat sans rechargement.

**Acceptance Scenarios**:

1. **Given** le mode nuit activé, **When** le lecteur bascule le toggle,
   **Then** le fond et le texte s'inversent (fond sombre, texte clair) dans les DEUX modes
   d'affichage (optimisé et natif).
2. **Given** une taille de police ajustable, **When** le lecteur la modifie entre 16px et 24px,
   **Then** le texte s'adapte immédiatement (mode optimisé uniquement).
3. **Given** les filtres CSS disponibles, **When** le lecteur ajuste brightness, contrast ou sepia,
   **Then** le filtre s'applique à toute la zone de lecture.
4. **Given** une superposition RGBA disponible, **When** le lecteur l'active,
   **Then** une couche noire ou blanche semi-transparente se superpose au contenu,
   permettant de contourner les limites de contraste matériel de l'écran.
5. **Given** le mode plein écran, **When** le lecteur l'active,
   **Then** la liseuse recouvre tout le viewport par-dessus l'interface du site hôte.

---

### User Story 3 — Naviguer naturellement selon son appareil (Priority: P3)

Sur mobile, un lecteur fait glisser son doigt vers la gauche pour passer à la page suivante.
Sur ordinateur, il utilise la roulette de la souris ou clique sur les flèches de navigation.

**Why this priority**: La navigation doit être intuitive et correspondre aux conventions
de chaque type d'appareil.

**Independent Test**: Sur mobile (ou simulation), glisser horizontalement → vérifier
le changement de page. Sur ordinateur, utiliser la roulette → vérifier le défilement ou
la pagination selon le format actif.

**Acceptance Scenarios**:

1. **Given** un écran mobile (< 768px), **When** le lecteur glisse horizontalement
   (gauche→droite ou droite→gauche), **Then** la page précédente ou suivante s'affiche.
2. **Given** un écran ordinateur, **When** le lecteur utilise la roulette de la souris,
   **Then** le contenu défile (mode défilement) ou change de page (mode pagination).
3. **Given** le mode pagination actif, **When** le lecteur clique sur les flèches
   de navigation, **Then** la page change et le numéro de page se met à jour.
4. **Given** le panneau d'informations ouvert ou fermé, **When** le lecteur clique
   sur le toggle correspondant, **Then** le panneau latéral apparaît ou disparaît
   sans affecter le contenu principal.

---

### User Story 4 — Suivre sa progression de lecture (Priority: P3)

Un lecteur veut savoir où il en est dans un long manuscrit. Il voit en temps réel
le pourcentage lu, le nombre de mots total, le temps de lecture estimé (fourni par
l'application), et le temps réel qu'il a déjà passé à lire activement.
L'application hôte reçoit ces données via des événements pour les persister.

**Why this priority**: Fonctionnalité de confort, pas bloquante pour le MVP.

**Independent Test**: Faire défiler un contenu long → vérifier que le pourcentage
de progression s'incrémente et que les deux événements sont émis vers le composant parent.

**Acceptance Scenarios**:

1. **Given** un contenu en mode optimisé, **When** le lecteur fait défiler le texte,
   **Then** la barre de progression affiche le pourcentage lu en temps réel.
2. **Given** `estimatedReadingTime` fourni en input, **When** le composant est initialisé,
   **Then** le temps estimé s'affiche dans le panneau d'informations.
3. **Given** aucun `estimatedReadingTime` fourni, **When** le composant est initialisé,
   **Then** aucun temps estimé n'est affiché (pas de valeur inventée).
4. **Given** un lecteur actif sur la liseuse, **When** il passe à un autre onglet,
   **Then** le chronomètre de lecture réelle (`readingTime`) se met en pause.
5. **Given** une progression qui change, **When** le seuil change,
   **Then** le composant émet `progressionLecture` (pourcentage 0–100) et `readingTime`
   (secondes écoulées en lecture active).

---

### User Story 5 — Gérer les cas d'erreur avec clarté (Priority: P2)

Un lecteur tente d'ouvrir un document dont le format n'est pas supporté, ou un document
privé auquel il n'a pas accès. Il voit un message clair en français (ou dans sa langue
configurée) qui explique le problème et suggère une action.

**Why this priority**: Une erreur silencieuse ou un écran blanc brise la confiance
dans l'outil.

**Independent Test**: Fournir un format non reconnu → vérifier qu'un message d'erreur
localisé s'affiche (pas de composant vide).

**Acceptance Scenarios**:

1. **Given** un format de fichier non reconnu, **When** le composant tente de le charger,
   **Then** un message d'erreur localisé s'affiche (ex. : « Format non supporté »).
2. **Given** un contenu vide ou null, **When** le composant est initialisé,
   **Then** un message approprié s'affiche (ex. : « Aucun manuscrit à afficher »).
3. **Given** une URL de document privé sans accès, **When** le composant tente de le charger,
   **Then** un message clair s'affiche (ex. : « Document privé — accès non autorisé »).
4. **Given** une langue non supportée passée en input, **When** le composant s'initialise,
   **Then** le français est utilisé comme langue de secours sans erreur.

---

### Edge Cases

- Manuscrit vide (chaîne vide, fichier 0 octet)
- Contenu extrêmement long (> 500 000 mots)
- Format de fichier non reconnu (ex. : `.xlsx`, `.zip`)
- Langue non supportée (ex. : `es`, `de`) → fallback `fr`
- Écran 320px minimum (téléphone très petit)
- Document Google Docs ou OneDrive privé (V2 — message clair en V1)
- Réseau lent ou indisponible lors du chargement d'un iframe
- Contenu HTML malformé en mode optimisé

---

## Requirements

### Formats d'entrée — Mode optimisé (texte extrait, pleinement configurable)

- **FR-001**: Le composant DOIT accepter une chaîne HTML comme contenu.
- **FR-002**: Le composant DOIT accepter du texte brut (string).
- **FR-003**: Le composant DOIT accepter les formats `.txt` et `.md` (contenu fourni en string ou File).

### Formats d'entrée — Mode natif (rendu tel quel)

- **FR-004**: Le composant DOIT afficher les fichiers `.pdf` via un rendu natif intégré.
- **FR-005**: Le composant DOIT afficher les fichiers `.docx`, `.odt`, `.rtf`, `.epub`
  via rendu natif ou iframe.
- **FR-005b** : Les URLs Google Docs contenant `/edit` DOIVENT être automatiquement transformées en `/preview` par FormatContenuService avant injection dans l'iframe.
- **FR-006**: Le composant DOIT embarquer une URL Google Docs publique dans un iframe.
- **FR-007**: Le composant DOIT embarquer une URL OneDrive publique dans un iframe.
- **FR-008**: L'accès privé Google Docs / OneDrive via compte collaborateur est hors périmètre V1
  (prévu en V2).

### Inputs du composant

- **FR-009**: Le composant DOIT accepter un input `contenu` (string, File, ou URL).
- **FR-010**: Le composant DOIT accepter un input `titre` (string, optionnel).
- **FR-011**: Le composant DOIT accepter un input `auteur` (string, optionnel).
- **FR-012**: Le composant DOIT accepter un input `langue` (string ISO 639-1, défaut `fr`).
- **FR-012b**: Le composant DOIT accepter un input `textSelectable` (boolean, défaut `true`).
  Quand `false` : sélection désactivée + clic droit désactivé.
  La documentation du composant DOIT avertir que cette protection est une friction côté client,
  non une sécurité absolue.
- **FR-012c**: Le composant DOIT accepter un input optionnel `estimatedReadingTime`
  (string ou number). Valeur calculée en amont par `ReadingTimeService` (v0.3.0 de
  `ngx-parrecrivains`) et transmise à la liseuse pour affichage uniquement.
  La liseuse n'effectue aucun calcul interne de temps de lecture estimé.
- **FR-014b**: Le composant DOIT accepter un input optionnel `config` de type
  `Partial<ConfigLecture>` (défaut `{}`), permettant au développeur de surcharger
  les valeurs par défaut de `ConfigLecture` à l'initialisation.
  Les clés non fournies utilisent `CONFIG_LECTURE_DEFAUT`.
  En interne, le composant fusionne : `{ ...CONFIG_LECTURE_DEFAUT, ...config() }`.
  Cela inclut `largeurColonneCh` (défaut 70, min 45, max 90) — non exposé comme
  input séparé.

### Outputs du composant

- **FR-013**: Le composant DOIT émettre un événement `progressionLecture` avec le pourcentage
  lu (0–100, number) à chaque changement significatif de position.
- **FR-013b**: Le composant DOIT émettre un événement `readingTime` (number, secondes)
  mesurant le temps réel passé à lire activement.
  La mesure DOIT s'arrêter automatiquement quand la liseuse n'est pas visible à l'écran
  ou quand l'onglet/la fenêtre perd le focus.
  Distinct du temps estimé (`estimatedReadingTime`) : l'un est prédit avant la lecture,
  l'autre est mesuré pendant.

### Typographie — Mode optimisé uniquement

- **FR-014**: La largeur de colonne DOIT être d'environ 70 caractères/ligne sur ordinateur
  et 35 caractères/ligne sur mobile.
- **FR-015**: La taille de police par défaut DOIT être 18px, ajustable entre 16px et 24px.
- **FR-016**: L'interligne par défaut DOIT être 1.6, ajustable entre 1.4 et 1.8.

### Contrôles visuels — Disponibles dans les DEUX modes

- **FR-017**: Le composant DOIT proposer un mode fenêtre (intégré dans la page) et un mode
  plein écran (par-dessus tout le contenu du site hôte).
- **FR-018**: Le composant DOIT permettre d'afficher ou masquer le panneau d'informations.
- **FR-019**: Le composant DOIT proposer un zoom (agrandir / réduire la vue).
- **FR-020**: Le composant DOIT proposer un mode jour et un mode nuit.
- **FR-021**: Le composant DOIT proposer des filtres CSS ajustables : brightness, contrast, sepia.
- **FR-022**: Le composant DOIT proposer une superposition RGBA (noire ou blanche, opacité
  variable) pour contourner les limites matérielles de l'écran.
- **FR-023**: La pagination ou le défilement DOIT s'adapter automatiquement au format d'écran.

### Navigation

- **FR-024**: Sur mobile, le glissement horizontal (swipe) DOIT changer de page.
- **FR-025**: Sur ordinateur, la roulette de la souris DOIT permettre le défilement
  ou la pagination selon le mode actif.
- **FR-026**: Sur ordinateur, la navigation se fait via la roulette de la souris et les
  flèches de navigation. Le cliquer-glisser n'est PAS utilisé pour la pagination
  (préservation de la sélection de texte).
- **FR-026b**: Le composant DOIT accepter un input `textSelectable` (boolean, défaut `true`).
  Si `false` : la sélection de texte est désactivée via `user-select: none` et le menu
  contextuel (clic droit) est désactivé.

  > ⚠️ **Limite documentée** : aucune protection côté client n'est inviolable. Si le texte
  > est envoyé au navigateur, un utilisateur motivé peut toujours le récupérer via les outils
  > de développement ou le DOM. `textSelectable: false` est une friction, pas une protection
  > absolue. La vraie protection du texte est une responsabilité serveur (pagination serveur,
  > envoi partiel, watermarking invisible) — hors périmètre de ce composant.

### Affichage des informations — Mode optimisé uniquement

- **FR-027**: Le composant DOIT afficher le nombre de mots du contenu.
- **FR-028a**: Le composant DOIT afficher le temps de lecture estimé si et seulement si
  l'input `estimatedReadingTime` est fourni. Aucun calcul interne — affichage de la valeur
  reçue telle quelle, formatée selon la langue active.
- **FR-028b**: Le composant DOIT afficher le temps réel de lecture actif en cours de session,
  mis à jour en temps réel depuis l'output `readingTime`. La mesure s'arrête quand la liseuse
  n'est pas visible ou active (Page Visibility API + Intersection Observer).
- **FR-029**: Le composant DOIT afficher la progression de lecture (pourcentage).

### Internationalisation

- **FR-030**: Toutes les chaînes de l'interface DOIVENT être externalisées en i18n.
- **FR-031**: Les langues supportées DOIVENT inclure le français (`fr`, défaut),
  l'anglais (`en`) et le cri (`cr`).
- **FR-032**: Toute langue non supportée DOIT utiliser le français comme langue de secours.

### Accessibilité

- **FR-033**: Le composant DOIT fonctionner sur un écran d'une largeur minimale de 320px.

---

## Key Entities

- **Manuscrit** : contenu littéraire identifié par titre, auteur, langue ; peut être
  fourni sous plusieurs formats.
- **ModeAffichage** : optimisé (texte extrait, configurable) ou natif (rendu tel quel).
- **ConfigLecture** : ensemble des préférences visuelles du lecteur (police, interligne,
  mode jour/nuit, filtres, zoom).
- **ProgressionLecture** : pourcentage lu (0–100), calculable en mode optimisé.
- **TempsEstimé** : durée de lecture prédite avant la session, calculée par `ReadingTimeService`
  (v0.3.0) et transmise via l'input `estimatedReadingTime`. La liseuse l'affiche, ne le calcule pas.
- **TempsRéel** : durée de lecture active mesurée pendant la session via Page Visibility API
  et Intersection Observer. Émis via l'output `readingTime`. Distinct du temps estimé.

---

## Success Criteria

- **SC-001**: Un lecteur peut ouvrir et lire un manuscrit en texte brut sans configuration
  initiale.
- **SC-002**: Les réglages visuels (mode nuit, taille de police, filtres) prennent effet
  en moins d'une seconde après activation.
- **SC-003**: Sur mobile, le swipe horizontal change de page de manière fluide (sans saccade
  perceptible).
- **SC-004**: Le composant s'affiche correctement sur un écran de 320px sans contenu tronqué
  ni débordement horizontal.
- **SC-005**: Un format non supporté affiche un message d'erreur localisé dans la langue
  configurée.
- **SC-006**: L'événement `progressionLecture` est reçu par le composant parent à chaque
  changement de page ou de position de défilement.
- **SC-007**: Un développeur peut installer et utiliser le composant dans un projet Angular
  vierge avec uniquement `npm install ngx-parrecrivains` et un import dans son module.

---

## Assumptions

- Le contenu en mode natif (.pdf, .docx, etc.) est affiché tel quel — aucun style
  typographique de la liseuse ne s'applique au contenu interne du document.
- Les filtres CSS (brightness, contrast, sepia) et la superposition RGBA s'appliquent
  au conteneur de la liseuse, pas au document hôte.
- Le mode plein écran utilise le mécanisme natif du navigateur ou une superposition CSS
  couvrant tout le viewport — au choix lors de l'implémentation.
- La pagination en mode optimisé se base sur la hauteur visible du composant.
- La liseuse n'effectue aucun calcul de temps de lecture estimé. Cette responsabilité
  appartient à `ReadingTimeService` (v0.3.0 de `ngx-parrecrivains`), composant distinct.
- Le temps réel (`readingTime`) est mesuré côté client via Page Visibility API et
  Intersection Observer — les navigateurs très anciens sans support de ces APIs ne
  bénéficieront pas de cette mesure (dégradation gracieuse : chronomètre non affiché).
- Les URLs Google Docs et OneDrive publiques sont fournies directement par l'application
  hôte — le composant ne gère pas l'authentification OAuth en V1.

---

## Évolutions futures

Ces éléments sont documentés pour ne pas les perdre, mais ne font pas partie du scope actuel (V1 MVP).

### V2 — Court terme

- **Bouton play/pause manuel** pour le chronomètre de lecture réelle (`readingTime`) :
  permettre à la lectrice d'interrompre volontairement la mesure du temps actif.
- **Accès privé Google Docs/OneDrive** via compte parrecrivains collaborateur :
  authentification OAuth déléguée à l'application hôte, iframe protégé ou extraction
  sécurisée selon les permissions du document.
- **Marque-page persistant** : mémoriser la position de lecture entre les sessions
  (via stockage local ou compte parrecrivains).
- **Annotations lecteur** : surlignage et notes marginales privées, associées à une
  position dans le texte.

### V3 — Moyen terme

- **Lecture vocale Text-to-Speech** (Web Speech API ou service externe) : synthèse
  vocale du texte en mode optimisé, avec suivi de la progression synchronisé à la
  lecture visuelle.
- **Vitesse de lecture ajustable** pour la synthèse vocale (0.5× à 2×).
- **Export de la progression** : partage ou sauvegarde du pourcentage lu, du temps
  réel passé, et des annotations.

### Vision long terme

- **Enregistrement audio de l'auteur lisant sa propre œuvre**, synchronisé avec le
  texte affiché (mise en évidence mot à mot ou paragraphe par paragraphe).
  Expérience unique à l'industrie littéraire — rapproche l'auteur et le lecteur,
  particulièrement pertinente pour les œuvres en langues autochtones où l'oralité
  est centrale.
