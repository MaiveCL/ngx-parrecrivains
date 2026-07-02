# Plan d'implémentation : TempsLectureService

**Branche** : `003-service-temps-lecture` | **Date** : 2026-06-02 | **Spec** : [spec.md](./spec.md)

---

## Résumé

Créer `TempsLectureService` dans la bibliothèque `ngx-parrecrivains` : un service Angular injectable sans état qui (1) estime le temps de lecture en secondes à partir d'un nombre de mots et d'une vitesse, et (2) formate cette durée en chaîne affichable (`"5 min"`, `"1 h 05 min"`). Zéro dépendance externe, instanciable sans TestBed.

---

## Contexte technique

**Langage/Version** : TypeScript 5.x, Angular 21+ (workspace `src/frontend`)

**Dépendances** : `tslib ^2.3.0` uniquement — Angular est `peerDependency`. Aucune nouvelle dépendance.

**Stockage** : N/A — service sans état, aucun signal, aucune subscription.

**Tests** : Vitest — instanciation directe avec `new TempsLectureService()`, sans TestBed.

**Plateforme cible** : Navigateur web (Chrome 120+, Firefox 121+, Safari 17+) — service pur, aucune API navigateur utilisée.

**Type de projet** : Bibliothèque Angular publiable sur npm (`ngx-parrecrivains`)

**Objectifs de performance** : N/A — calcul synchrone O(1), négligeable.

**Contraintes** : `@Injectable({ providedIn: 'root' })`. Aucun `inject()` — le service n'a pas de dépendances. Pas de `ChangeDetectionStrategy` (service, pas composant).

**Périmètre** : 1 service + 1 constante + 1 fichier de tests. Pas de composant, pas de template, pas de styles, pas de fichiers i18n.

---

## Constitution Check

*GATE : Doit passer avant Phase 0. Revérifié après Phase 1.*

| Principe | Question | Statut |
|---|---|---|
| I. Réutilisabilité | Fonctionne dans un projet Angular vierge sans config ? | ✅ Aucune dep croisée — `new TempsLectureService()` suffit |
| II. i18n | Toutes les chaînes visibles sont externalisées ? | ✅ avec adaptation : `formater()` retourne des abréviations numériques universelles (`"h"`, `"min"`) — pas des chaînes UI traduisibles. Aucun fichier i18n requis. |
| III. Tree-shaking | Export isolé dans `public-api.ts` ? | ✅ `export *` depuis `lib/temps-lecture/` |
| IV. Versionnage | Version correcte ? CHANGELOG à jour ? | ⏳ Sera incrémentée à `0.3.0` après implémentation |
| V. Qualité de la spec | Spec révisée et validée avant ce plan ? | ✅ Deux décisions de design actées par Maive le 2026-06-02 |
| Contraintes | Aucune dépendance directe ajoutée ? | ✅ Zéro nouvelle dépendance |

---

## Structure du projet

### Documentation (cette feature)

```text
specs/003-service-temps-lecture/
├── spec.md              ← Spécification validée
├── plan.md              ← Ce fichier
├── research.md          ← Décisions techniques documentées
├── data-model.md        ← Règles de normalisation + tables de vérification
├── quickstart.md        ← Guide de validation manuelle
├── contracts/
│   └── service-api.md   ← Contrat public de l'API
├── checklists/
│   └── requirements.md  ← Checklist qualité de la spec
└── tasks.md             ← Généré par /speckit-tasks
```

### Code source (bibliothèque)

```text
src/frontend/projects/ngx-parrecrivains/src/
├── public-api.ts                               ← Ajouter : export * from './lib/temps-lecture/temps-lecture.service'
└── lib/
    └── temps-lecture/
        ├── temps-lecture.service.ts            ← TempsLectureService + VITESSE_LECTURE_DEFAUT
        └── temps-lecture.service.spec.ts       ← Tests unitaires Vitest
```

### Test visuel (app hôte)

```text
src/frontend/projects/parrecrivains/src/app/features/test-temps-lecture/
├── TEST-temps-lecture.ts
├── TEST-temps-lecture.html
└── TEST-temps-lecture.scss
```

Route : `test/temps-lecture` dans `app.routes.ts` (section TEST — SUPPRIMER AVANT PUBLICATION)

---

## Décisions de design

### Architecture du service

- **`TempsLectureService`** : classe avec deux méthodes publiques pures (`estimer`, `formater`) et zéro état.
- **`VITESSE_LECTURE_DEFAUT`** : constante exportée séparément, pas un membre de classe — permet l'import sans instancier le service.
- `@Injectable({ providedIn: 'root' })` — singleton injectable partout, aucun `providers` requis.

### Logique `estimer()`

```
normaliser(nombreMots) → Math.floor si décimal, 0 si null/négatif
normaliser(vitesse)    → VITESSE_LECTURE_DEFAUT si ≤ 0 ou absent
résultat               → Math.round((mots / vitesse) * 60)
```

### Logique `formater()`

```
0 secondes             → "0 min"
1–59 secondes          → "1 min"   (Math.ceil → minimum 1)
60–3599 secondes       → "X min"
≥ 3600 secondes        → "X h MM min"  (MM sur 2 chiffres)
```

### Tests sans TestBed

Le service n'a aucun `inject()` → instanciable directement :
```typescript
const service = new TempsLectureService();
```
Tous les tests utilisent ce pattern — cohérent avec `MotsPipe`.
