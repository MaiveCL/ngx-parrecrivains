# Plan d'implémentation : Liseuse de manuscrit (ngx-manuscript-reader)

**Branche** : `001-manuscript-reader` | **Date** : 2026-05-28 | **Spec** : [spec.md](./spec.md)

**Entrée** : `/home/etd/parrecrivains/specs/001-manuscript-reader/spec.md`

---

## Résumé

Créer `LiseuseManuscritComponent` — composant Angular 21 standalone publié dans la bibliothèque `ngx-parrecrivains` (v0.1.0 → v0.2.0). Le composant affiche un manuscrit littéraire en mode optimisé (texte extrait, mise en page configurable) ou en mode natif (PDF/iframe), avec contrôles de confort visuel, navigation tactile/souris, suivi de progression et mesure du temps de lecture actif.

---

## Contexte technique

**Langage/Version** : TypeScript 5.x, Angular 21.1+ (workspace `src/frontend`)

**Dépendances primaires** : Angular 21 (`peerDependency`), `@ngx-translate/core ^17` (`peerDependency`), `tslib ^2.3.0` (seule dépendance directe)

**Stockage** : N/A — composant sans persistance. État géré par Signals Angular, émis vers l'app hôte via outputs.

**Tests** : Vitest (JAMAIS Karma — retiré Angular v21)

**Plateforme cible** : Navigateur web (Chrome 120+, Firefox 121+, Safari 17+) — téléphone 320px, tablette 768px, ordinateur 1024px, TV 1920px

**Type de projet** : Bibliothèque Angular publiable sur npm (`ngx-parrecrivains`)

**Objectifs de performance** :
- Réglages visuels en < 1 seconde (SC-002)
- Swipe mobile fluide, sans saccade perceptible (SC-003)
- Aucun décalage de layout sur écran 320px (SC-004)

**Contraintes** :
- Aucune dépendance directe ajoutée au `package.json` de la lib sauf `tslib`
- Composant Standalone, `ChangeDetectionStrategy.OnPush`, `inject()` exclusivement
- TypeScript strict, zéro `any`
- Sélecteur : `ngx-liseuse-manuscrit`

**Périmètre** : 1 composant principal + 3 sous-composants internes + 3 services internes + 1 service public + types exportés

---

## Vérification constitution

*GATE : Doit passer avant Phase 0. Revérifié après Phase 1.*

| Principe | Question | Statut |
|---|---|---|
| I. Réutilisabilité | Fonctionne dans un projet Angular vierge sans `parrecrivains` ? | ✅ Conçu standalone, aucun couplage interne |
| II. i18n | Toutes les chaînes dans `public/i18n/*.json` ? | ✅ Fichiers lib propres + TraductionService interne |
| III. Tree-shaking | Export isolé dans `public-api.ts` ? Standalone ? | ✅ Standalone, `sideEffects: false` déjà en place |
| IV. Versionnage | `0.1.0` actuel → `0.2.0` après ce composant. CHANGELOG à créer. | ✅ Semver respecté |
| V. Qualité spec | Spec révisée et validée (2026-05-27) | ✅ |
| Contraintes | Aucune dep directe hors tslib ? Responsive sur 4 formats ? | ✅ PDF via blob URL natif, swipe via touch events natifs |

---

## Structure du projet

### Documentation (cette feature)

```text
specs/001-manuscript-reader/
├── plan.md              ← Ce fichier (/speckit-plan)
├── research.md          ← Phase 0 (/speckit-plan)
├── data-model.md        ← Phase 1 (/speckit-plan)
├── quickstart.md        ← Phase 1 (/speckit-plan)
├── contracts/           ← Phase 1 (/speckit-plan)
│   └── composant-api.md
└── tasks.md             ← Phase 2 (/speckit-tasks — pas encore créé)
```

### Code source

```text
src/frontend/projects/ngx-parrecrivains/src/
├── public-api.ts                          ← Exporter LiseuseManuscrit + types
└── lib/
    └── liseuse-manuscrit/
        ├── liseuse-manuscrit.ts           ← Composant principal
        ├── liseuse-manuscrit.html
        ├── liseuse-manuscrit.scss
        ├── liseuse-manuscrit.spec.ts
        ├── composants/
        │   ├── panneau-info/
        │   │   ├── panneau-info.ts        ← Panneau latéral d'informations
        │   │   ├── panneau-info.html
        │   │   └── panneau-info.scss
        │   ├── barre-controles/
        │   │   ├── barre-controles.ts     ← Contrôles visuels (police, filtres, plein écran)
        │   │   ├── barre-controles.html
        │   │   └── barre-controles.scss
        │   └── zone-lecture/
        │       ├── zone-lecture.ts        ← Zone d'affichage principale (mode optimisé + natif)
        │       ├── zone-lecture.html
        │       └── zone-lecture.scss
        └── services/
            ├── config-lecture.ts          ← Signal-based, préférences visuelles
            ├── format-contenu.ts          ← Détection du type d'entrée
            └── chronometre-lecture.ts     ← Temps actif (Visibility API + IntersectionObserver)

src/frontend/projects/ngx-parrecrivains/public/i18n/liseuse/
├── fr.json                                ← Langue par défaut
├── en.json
└── cr.json

src/frontend/projects/ngx-parrecrivains/src/lib/
└── types/
    └── liseuse.types.ts                   ← Types exportés publiquement
```

**Décision de structure** : Bibliothèque Angular workspace existante. Le composant est ajouté sous `lib/liseuse-manuscrit/` suivant le même pattern que `boite-texte/`. Les sous-composants (`panneau-info`, `barre-controles`, `zone-lecture`) ne sont pas exportés individuellement — ils sont importés directement par `LiseuseManuscritComponent`.

---

## Suivi de complexité

Aucune violation de constitution à justifier.
