<!--
SYNC IMPACT REPORT
==================
Version change: 1.1.0 → 2.0.0

Restructuration majeure :
  Fusion de la constitution du site de démo (ngx-parrecrivains v1.1.0)
  et de la constitution de la lib (parrecrivains v1.5.0).
  Constitution restructurée en 3 parties : Globale / Lib / Tutoriel.
  La lib source a été migrée dans ce repo depuis parrecrivains (branche transfertLib).

Amendment: 2026-07-02
-->

# ngx-parrecrivains — Constitution du projet

---

## Partie I — Principes globaux

Ces principes s'appliquent à TOUT le contenu de ce repo : lib source ET app tutoriel/test.

### G-I. Langue du code

Tout ce qui est créé dans ce repo utilise le **français** : noms de composants, variables,
méthodes, classes, interfaces, types, fichiers, commentaires.
Ce qui vient de l'extérieur (APIs Angular, npm) reste en anglais tel quel.

### G-II. Sécurité — non-négociable

La sécurité des utilisateurs ne peut JAMAIS être sacrifiée pour la commodité ou la performance.
La lib étant utilisée par des projets tiers, on ne peut pas se fier au backend des utilisateurs.

- **Aucun bypass sans approbation explicite de Maive** : `bypassSecurityTrustHtml()`,
  `bypassSecurityTrustResourceUrl()`, `bypassSecurityTrustScript()`, `bypassSecurityTrustStyle()`,
  `dangerouslySetInnerHTML`, `eval()` et équivalents sont INTERDITS sauf validation explicite.
- **Le LLM ne prend pas de décision de sécurité de façon autonome** : s'arrêter, expliquer,
  attendre une décision de Maive avant de continuer.
- **Sanitisation par défaut** : utiliser les mécanismes de sécurité du framework.

*Origine : incident bypassSecurityTrustHtml() dans ZoneLectureComponent, 2026-06-01.*

### G-III. Flux SpecKit — ordre obligatoire

```
/speckit-constitution   → une seule fois, ou à chaque amendement majeur
/speckit-specify        → specs/NNN-feature/spec.md
/speckit-clarify        → résolution des ambiguïtés avant planification
/speckit-checklist      → validation de la qualité de la spec
/speckit-plan           → specs/NNN-feature/plan.md
/speckit-tasks          → specs/NNN-feature/tasks.md
/speckit-analyze        → vérification de cohérence globale avant implémentation
/speckit-implement      → code source
```

La correction manuelle des specs générées par le LLM est OBLIGATOIRE avant de passer à
l'étape suivante (hallucinations, biais, date limite de connaissance août 2025).

### G-IV. Gouvernance

- Cette constitution PRIME sur toutes les autres pratiques et conventions du projet.
- Tout amendement DOIT incrémenter la version selon semver.
- MAJOR : suppression ou redéfinition incompatible d'un principe existant.
- MINOR : ajout d'un principe ou d'une section.
- PATCH : clarification, reformulation, correction typographique.
- Les templates (plan, spec, tasks) DOIVENT être mis à jour si un principe change.
- La constitution DOIT être commitée séparément du code source.
- **Maive est la seule décideuse finale** — le LLM propose, Maive décide.

---

## Partie II — Lib ngx-parrecrivains

Ces principes s'appliquent à la lib source (`src/projects/ngx-parrecrivains/`).

### L-I. Réutilisabilité

Chaque élément (composant, pipe, service, validator) DOIT fonctionner indépendamment
dans tout projet Angular, sans couplage à `parrecrivains` ni à aucun autre élément de la lib.

- Aucune dépendance croisée entre éléments de la lib
- API publique stable et documentée avant implémentation
- Testable de manière isolée depuis un projet Angular vierge

**Rationale** : `ngx-parrecrivains` est publiée sur npm pour toute l'industrie littéraire.
`parrecrivains` est le client principal mais pas le seul. Un couplage interne rendrait la lib
inutilisable pour des tiers.

### L-II. i18n obligatoire

Tout texte visible par l'utilisateur DOIT être externalisé dans les fichiers de traduction.
Aucune chaîne de caractères hardcodée dans les composants.

- Langues supportées : français (défaut), anglais, cri (`cr`) — dans cet ordre de priorité
- Fichiers : `public/i18n/fr.json`, `public/i18n/en.json`, `public/i18n/cr.json`
- Librairie : `@ngx-translate/core` + `@ngx-translate/http-loader`
- Le composant DOIT fonctionner sans configuration i18n (fallback français intégré)

### L-III. Tree-shaking

Chaque élément DOIT être exporté séparément dans `public-api.ts`.
Aucun module barrel qui force le chargement de toute la lib.

- Composants Angular Standalone UNIQUEMENT (jamais NgModule)
- `sideEffects: false` dans `package.json`
- `public-api.ts` : `export *` exclusivement — JAMAIS exports nommés explicites
- Un import d'un pipe ne DOIT PAS forcer le chargement d'un composant, et vice versa

### L-IV. Versionnage sémantique

- `0.x.x` — développement initial, API instable
- `1.0.0` — uniquement quand l'API est stable et utilisée en production
- Toute rupture d'API = incrément MAJEUR
- `CHANGELOG.md` obligatoire à chaque publication

### L-V. Qualité de la spec

Chaque élément DOIT avoir sa propre spec SpecKit complète et révisée AVANT implémentation.
Tout écart entre spec et implémentation DOIT déclencher une mise à jour des specs.

### L-VI. Contraintes techniques

| Contrainte | Valeur |
|---|---|
| Angular | 21+, Standalone uniquement, `ChangeDetectionStrategy.OnPush` |
| TypeScript | Mode strict, aucun `any`, inférence de type préférée |
| Dépendances directes | `tslib` uniquement — Angular et `@ngx-translate/core` sont `peerDependency` |
| Formats d'écran | 320px+ / 768px+ / 1024px+ / 1920px+ (éléments visuels seulement) |
| Accessibilité | WCAG AA minimum sur tous les composants visuels |
| Licence | MIT — fichier `LICENSE` inclus dans `dist/` via `ng-package.json` |
| Publication | Non-scopé (`ngx-parrecrivains`), accès public, registre npm officiel |

### L-VII. Conventions Angular 21 — non-négociables

| Sujet | À FAIRE | INTERDIT |
|---|---|---|
| Injection | `inject()` dans le corps de la classe | Injection par paramètre constructeur |
| Inputs/Outputs | `input()`, `output()`, `model()`, `input.required()` | `@Input()`, `@Output()` décorateurs |
| Queries DOM | `viewChild()`, `viewChildren()`, `contentChild()`, `contentChildren()` | `@ViewChild`, `@ViewChildren`, `@ContentChild`, `@ContentChildren` |
| Lifecycle DOM — une fois | `afterNextRender()` dans le constructeur | `implements AfterViewInit` + `ngAfterViewInit()` |
| Lifecycle DOM — chaque rendu | `afterEveryRender()` dans le constructeur | `implements AfterViewChecked` + `ngAfterViewChecked()` |
| Cleanup abonnements | `DestroyRef` + `takeUntilDestroyed()` | `ngOnDestroy()` pour désabonnements RxJS |
| Host events | `host: { '(event)': 'handler($event)' }` dans `@Component` | `@HostListener`, `@HostBinding` |
| Templates | `@if`, `@for`, `@switch` | `*ngIf`, `*ngFor`, `*ngSwitch` |
| Liaisons CSS/Style | Binding `[class]` / `[style]` | `ngClass`, `ngStyle` |
| Fichiers | `.ts` + `.html` + `.scss` séparés | Template ou styles inline dans `@Component` |
| Réactivité | `signal()`, `computed()`, `effect()`, `linkedSignal()` | Dupliquer l'état ; `mutate()` |
| Zoneless | Aucun import `zone.js`, aucun `NgZone` | `NgZone`, `ApplicationRef.tick()`, `zone.js` |
| Standalone | Ne PAS écrire `standalone: true` (défaut v20+) | `NgModule`, `HttpClientModule` |
| Nommage | Français pour tout ce qu'on crée | Anglais pour les APIs externes |
| Gestures mobiles | CSS `touch-action` | `preventDefault()` sur touch/wheel |
| Blob URLs | `effect()` avec variable dédiée par type de blob | `computed()` pour créer des Blob URLs |
| Services injectés | `private readonly` | Public ou sans `readonly` sauf besoin template |

> **Imports** : vérifier systématiquement les imports inutilisés après génération de code.

Ces conventions s'appliquent AUSSI à l'app tutoriel (Partie III) — le code exemple doit
être irréprochable puisque les visiteurs s'en inspirent.

---

## Partie III — App tutoriel/test

Ces principes s'appliquent à l'app Angular (`src/src/`) qui sert à la fois de test local
et de site tutoriel/démo.

### T-I. Deux modes de build — même app

Il est impossible dans un seul build Angular d'avoir certaines pages qui utilisent la lib
locale et d'autres qui utilisent la lib npm. Toutes les pages utilisent la même résolution.

| Mode | Commande | Résolution | Usage |
|---|---|---|---|
| Test local | `ng serve` | Path alias → `dist/ngx-parrecrivains/` | Valider avant publication |
| Démo déployée | `ng build --ts-config=tsconfig.demo.json` | npm publié | GitHub Pages |

⚠️ Ne jamais déployer sur GitHub Pages avec le `tsconfig.json` par défaut (path alias actif).

### T-II. Démo vivante

Chaque composant ou fonctionnalité de la lib DOIT avoir une page de démo comportant :

1. **Live demo** — composant interactif directement utilisable
2. **Snippet minimal** — code copy-paste fonctionnel, prêt à l'emploi
3. **Cas d'erreur volontaire** — illustration des messages de validation
4. **Données mockées** — fichiers `assets/mock/` ou services in-memory
5. **Explication textuelle** — intégrée dans la page, jamais dans un fichier séparé

### T-III. Frontend pur

Ce repo DOIT rester une SPA Angular statique. Aucun backend réel n'est autorisé.

**Interdits absolus** : backend réel, SSR, SSG, base de données persistante.

### T-IV. Exemples copy-paste

Tout snippet publié DOIT être reproductible immédiatement dans un projet Angular vierge
après `npm install ngx-parrecrivains`. Aucune dépendance sur des fichiers internes au repo.

### T-V. Simulation de données

Toutes les données DOIVENT être simulées côté frontend :
- Fichiers JSON dans `src/src/assets/mock/`
- Services Angular (`providedIn: 'root'`)
- `HttpInterceptor` Angular simulant des réponses HTTP

### T-VI. Usage pédagogique — branches git

Deux branches coexistent et NE DOIVENT JAMAIS être mergées l'une dans l'autre :

- **`main`** : démo complète, lib installée, tous les composants fonctionnels
- **`tuto-depart`** : scaffold pédagogique — instructions d'installation, placeholders,
  lib PAS encore installée

`tuto-depart` DOIT rester en arrière de `main`.

### T-VII. Documentation multilingue

Le site DOIT proposer un sélecteur de langue. Français par défaut, anglais obligatoire en v1,
langues autochtones par contribution externe. Textes externalisés dans `assets/i18n/`.

---

**Version** : 2.0.0 | **Ratifiée** : 2026-07-02 | **Last Amended** : 2026-07-02
