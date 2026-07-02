# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Contexte technique

**Langage/Version** : TypeScript 5.x, Angular 21+ (workspace `src/frontend`)

**Dépendances** : Angular 21 (`peerDependency`), `@ngx-translate/core ^17` (`peerDependency`), `tslib ^2.3.0` (seule dépendance directe) — aucune autre dep directe sans justification explicite

**Stockage** : N/A — la lib ne persiste rien. État géré par Signals Angular, émis vers l'app hôte via outputs si nécessaire.

**Tests** : Vitest (JAMAIS Karma — retiré Angular v21)

**Plateforme cible** : Navigateur web (Chrome 120+, Firefox 121+, Safari 17+) — 320px / 768px / 1024px / 1920px

**Type de projet** : Bibliothèque Angular publiable sur npm (`ngx-parrecrivains`)

**Objectifs de performance** : [décrire les contraintes spécifiques à cet élément, ou N/A]

**Contraintes** : Standalone, `ChangeDetectionStrategy.OnPush`, `inject()`, signals — voir tableau Conventions Angular 21 dans la constitution

**Périmètre** : [décrire : X composant(s) + Y service(s) + Z type(s) exportés, ou pipe seul, etc.]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principe | Question | Statut |
|---|---|---|
| I. Réutilisabilité | L'élément fonctionne-t-il indépendamment dans un projet Angular vierge ? | ☐ |
| II. i18n | Toutes les chaînes visibles sont-elles dans `public/i18n/*.json` ? | ☐ |
| III. Tree-shaking | L'export est-il isolé dans `public-api.ts` ? Standalone component ? | ☐ |
| IV. Versionnage | La version dans `package.json` est-elle correcte (0.x.x) ? CHANGELOG à jour ? | ☐ |
| V. Qualité de la spec | La spec est-elle révisée et validée avant d'ouvrir ce plan ? | ☐ |
| Contraintes | Aucune dépendance externe ajoutée ? Responsive testé sur 4 formats ? | ☐ |

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Code source (bibliothèque)

<!--
  ACTION REQUIRED: Remplacer les placeholders par les chemins réels de cet élément.
  Supprimer les lignes qui ne s'appliquent pas (ex. : un pipe n'a pas de .html ni de sous-composants).
-->

```text
src/frontend/projects/ngx-parrecrivains/src/
├── public-api.ts                              ← export * de l'élément + ses types
└── lib/
    └── [nom-element]/
        ├── [nom-element].ts                   ← composant / pipe / service / validator
        ├── [nom-element].html                 ← (composants uniquement)
        ├── [nom-element].scss                 ← (composants visuels uniquement)
        ├── [nom-element].spec.ts              ← (si tests demandés)
        ├── types/
        │   └── [nom-element].types.ts         ← interfaces, types, constantes exportés
        ├── composants/                        ← (sous-composants internes, si nécessaire)
        │   └── [sous-composant]/
        └── services/                          ← (services internes, si nécessaire)
            └── [service].ts

src/frontend/projects/ngx-parrecrivains/public/
└── i18n/
    ├── fr.json                                ← clés i18n de cet élément (si texte visible)
    ├── en.json
    └── cr.json
```

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
