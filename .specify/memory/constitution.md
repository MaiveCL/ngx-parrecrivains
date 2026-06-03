<!--
SYNC IMPACT REPORT
==================
Version change: 1.0.0 → 1.1.0

Principes modifiés :
  Aucun principe existant modifié.

Principes ajoutés :
  VI. Documentation Multilingue — nouveau

Sections modifiées :
  - Contraintes Techniques : ajout ligne i18n

Templates vérifiés :
  ✅ plan-template.md — compatible sans modification
  ✅ spec-template.md — compatible sans modification
  ✅ tasks-template.md — compatible sans modification
  ⚠ Aucun répertoire commands/ présent — aucune vérification nécessaire

Placeholders intentionnellement reportés :
  Aucun — tous les champs sont renseignés.
-->

# ngx-parrecrivains — Constitution du site de démo

## Principes fondamentaux

### I. Démo Vivante

Chaque composant ou fonctionnalité de la librairie `ngx-parrecrivains` DOIT avoir une page de
démonstration interactive dans ce site. Une page de démo DOIT comporter exactement ces cinq
éléments :

1. **Live demo** — composant interactif directement utilisable dans la page
2. **Snippet minimal** — code copy-paste fonctionnel, prêt à l'emploi
3. **Cas d'erreur volontaire** — illustration des messages de validation
4. **Données mockées** — utilisation de fichiers `assets/mock/` ou services in-memory
5. **Explication textuelle** — intégrée dans la page, jamais dans un fichier séparé

**Rationale** : L'objectif principal est qu'un·e développeur·e externe puisse voir, copier, et
exécuter immédiatement un exemple après `npm install ngx-parrecrivains`. Une démo incomplète
est aussi nuisible qu'une absence de démo.

### II. Frontend Pur

Ce repo DOIT rester une SPA Angular statique. Aucun backend réel n'est autorisé. Le déploiement
DOIT se faire via GitHub Pages avec le build :
`ng build --base-href /ngx-parrecrivains/` — output vers `docs/`.

**Interdits absolus** :
- Backend réel (serveur, API, base de données persistante)
- SSR (Server-Side Rendering)
- SSG (Static Site Generation)

**Rationale** : Un site statique sur GitHub Pages est sans coût d'hébergement, toujours
disponible, et ne crée aucune dépendance d'infrastructure pour un projet pédagogique.

### III. Exemples Copy-Paste

Tout snippet de code publié dans ce site DOIT être reproductible immédiatement dans un projet
Angular vierge après installation de `ngx-parrecrivains`. Les snippets NE DOIVENT PAS dépendre
de fichiers internes à ce repo ou d'imports non documentés.

**Rationale** : L'utilisateur final arrive sur ce site pour copier du code. Un exemple qui ne
fonctionne pas hors contexte est un échec de la démo.

### IV. Simulation de Données

Toutes les données utilisées dans les démos DOIVENT être simulées côté frontend via :
- Fichiers JSON dans `src/src/assets/mock/`
- Services Angular (`providedIn: 'root'`)
- `HttpInterceptor` Angular simulant des réponses HTTP

Aucune donnée réelle ou persistante n'est autorisée.

**Rationale** : Garantit que le site fonctionne sans réseau, sans serveur, et sans configuration
préalable — indispensable pour un usage en classe.

### V. Usage Pédagogique

Deux branches coexistent et NE DOIVENT JAMAIS être mergées l'une dans l'autre :

- **`main`** : démo complète, librairie installée, tous les composants fonctionnels
- **`tuto-depart`** : scaffold pédagogique pour classe — instructions d'installation,
  placeholders, librairie PAS encore installée

`tuto-depart` DOIT rester en arrière de `main`. Elle représente le point de départ d'un
exercice guidé, pas un état de développement intermédiaire.

**Rationale** : Les deux branches servent des audiences distinctes. Les fusionner détruirait la
valeur pédagogique du scaffold.

### VI. Documentation Multilingue

Le site de démo DOIT proposer un sélecteur de langue. Le français est la langue par défaut et
la langue de création. L'anglais DOIT être supporté dès la v1. Les langues autochtones PEUVENT
être ajoutées par contribution externe au projet.

Les textes de l'interface et de la documentation DOIVENT être externalisés dans des fichiers de
traduction (ex. `assets/i18n/fr.json`, `assets/i18n/en.json`) — jamais codés en dur dans les
templates. Le code lui-même (noms de variables, commentaires) reste en français conformément
au Principe de langue du projet.

**Rationale** : La librairie `ngx-parrecrivains` vise une accessibilité universelle, notamment
pour les communautés littéraires autochtones. La documentation unilingue contredit cet objectif.
Un sélecteur de langue sans backend est réalisable avec `@ngx-translate/core` ou l'i18n natif
Angular chargé depuis `assets/`.

## Contraintes Techniques

| Contrainte | Valeur |
|---|---|
| Framework | Angular **21.2.x** — standalone components (pas de NgModules) |
| Déploiement | GitHub Pages — build statique |
| Base href | `/ngx-parrecrivains/` (requis au build) |
| Output build | `docs/` (configuré dans `angular.json`) |
| Backend | Aucun autorisé |
| Langue du code produit | Français pour tout ce qui est créé dans ce repo |
| Langue de l'interface | Multilingue — fr (défaut) + en minimum, via fichiers `assets/i18n/` |
| Simulation données | JSON `assets/mock/`, `HttpInterceptor`, services in-memory |
| Librairie couverte | `ngx-parrecrivains` v0.1–v0.4 |

**Composants à couvrir (v0.1 à v0.4) :**
- `LiseuseManuscritComponent` — liseuse de manuscrits avec PDF/Google Docs
- `MotsPipe` / `WordsPipe` — décompte de mots fr/en/cr
- `TempsLectureService` — estimation du temps de lecture
- `isbnValidator` / `validerIsbn` — validateur ISBN-10/13

## Structure des Branches Git

```
main          → démo complète, lib installée, composants fonctionnels
tuto-depart   → scaffold pédagogique : Angular vide + instructions d'installation
```

Ces deux branches partagent le même commit de base initial et divergent intentionnellement.
Aucune fusion entre elles n'est autorisée.

## Gouvernance

Cette constitution PRIME sur toutes les autres pratiques et conventions du projet. Toute
décision de développement doit être vérifiée contre ces principes avant d'être mise en œuvre.

**Procédure d'amendement :**
1. Identifier le principe ou la contrainte à modifier avec justification
2. Incrémenter la version selon les règles sémantiques ci-dessous
3. Mettre à jour la date `Last Amended`
4. Propager les changements aux templates dépendants si nécessaire

**Politique de versionnement sémantique :**
- MAJOR : suppression ou redéfinition incompatible d'un principe existant
- MINOR : ajout d'un nouveau principe ou section avec contenu substantiel
- PATCH : clarification, reformulation, correction typographique

**Révision de conformité :** chaque nouvelle page de démo doit être vérifiée contre le
Principe I (cinq éléments obligatoires) avant d'être considérée comme complète.

**Version**: 1.1.0 | **Ratifiée**: 2026-06-03 | **Last Amended**: 2026-06-03
