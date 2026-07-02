# Feature Specification : MotsPipe / WordsPipe

**Feature Branch** : `002-pipe-mots`

**Created** : 2026-06-01

**Status** : Draft

---

## User Scenarios & Testing

### User Story 1 — Afficher un décompte de mots en français (Priorité : P1)

Un développeur intègre la liseuse ou un panneau d'informations dans une interface
francophone. Il veut afficher le nombre de mots d'un manuscrit de façon lisible et
typographiquement correcte — sans coder lui-même la logique de pluriel ni le formatage
des milliers.

**Why this priority** : C'est le cas d'usage central. Toute l'industrie littéraire
québécoise travaille en français. Sans ce comportement, le pipe n'a pas de raison d'exister.

**Independent Test** : Passer `1234` au pipe sans argument de langue → obtenir `"1 234 mots"`.
Passer `1` → `"1 mot"`. Passer `0` → `"0 mot"`.

**Acceptance Scenarios** :

1. **Given** un nombre de mots `1234`, **When** `{{ 1234 | mots }}`, **Then** le résultat est `"1 234 mots"` (espace fine insécable U+202F comme séparateur de milliers).
2. **Given** un nombre de mots `1`, **When** `{{ 1 | mots }}`, **Then** le résultat est `"1 mot"` (singulier).
3. **Given** un nombre de mots `0`, **When** `{{ 0 | mots }}`, **Then** le résultat est `"0 mot"` (singulier — zéro traité comme singulier).
4. **Given** un nombre de mots `1234`, **When** `{{ 1234 | mots:'fr' }}`, **Then** le résultat est identique à sans argument de langue.
5. **Given** `{{ 1234 | mots:'pt':'palavra':'palavras' }}`, **Then** le résultat est `"1 234 palavras"`.

---

### User Story 2 — Afficher un décompte de mots en anglais (Priorité : P1)

Un développeur intègre le composant dans une interface anglophone ou bilingue.
Il passe `'en'` comme paramètre et obtient le formatage anglophone standard.

**Why this priority** : La lib est publiée pour toute l'industrie littéraire, pas
seulement les francophones. L'anglais est requis dès la v0.1.

**Independent Test** : Passer `1234` avec `'en'` → `"1,234 words"`. Passer `1` → `"1 word"`.

**Acceptance Scenarios** :

1. **Given** un nombre de mots `1234`, **When** `{{ 1234 | mots:'en' }}`, **Then** le résultat est `"1,234 words"` (virgule comme séparateur de milliers).
2. **Given** un nombre de mots `1`, **When** `{{ 1 | mots:'en' }}`, **Then** le résultat est `"1 word"` (singulier).
3. **Given** un nombre de mots `0`, **When** `{{ 0 | mots:'en' }}`, **Then** le résultat est `"0 words"` (convention anglaise : zéro est pluriel).

---

### User Story 3 — Utiliser l'alias anglophone `words` (Priorité : P2)

Un développeur dont le codebase est en anglais préfère un sélecteur cohérent avec
sa nomenclature. Il utilise `| words` au lieu de `| mots` — comportement identique.

**Why this priority** : La lib vise à être adoptée au-delà de parrecrivains.
Un développeur anglophone ne devrait pas avoir à utiliser un pipe nommé `mots`.

**Independent Test** : `{{ 1234 | words:'en' }}` → `"1,234 words"`. `{{ 1 | words }}` → `"1 mot"`.

**Acceptance Scenarios** :

1. **Given** le pipe `words` importé, **When** `{{ 1234 | words:'en' }}`, **Then** le résultat est `"1,234 words"` — identique à `| mots:'en'`.
2. **Given** aucun argument de langue, **When** `{{ 1234 | words }}`, **Then** le résultat est `"1 234 mots"` — la langue par défaut est toujours `'fr'`.

---

### User Story 4 — Afficher un décompte en cri (Priorité : P3)

Un développeur intègre la lib dans une interface qui supporte le cri (cr).
Le formatage des milliers suit la convention francophone ; le mot "mots" est traduit.

**Why this priority** : La lib s'engage à supporter les langues autochtones. Le cri
est la troisième langue supportée dès la v0.1.

**Independent Test** : `{{ 1234 | mots:'cr' }}` → `"1 234 nêhiyaw-pîkiskwêwina"`.

**Acceptance Scenarios** :

1. **Given** un nombre de mots `1234`, **When** `{{ 1234 | mots:'cr' }}`, **Then** le résultat est `"1 234 nêhiyaw-pîkiskwêwina"` (espace fine insécable, pluriel cri).
2. **Given** un nombre de mots `1`, **When** `{{ 1 | mots:'cr' }}`, **Then** le résultat est `"1 nêhiyaw-pîkiskwêwin"` (singulier cri).

---

### Edge Cases

- `null` en entrée → traité comme `0` → `"0 mot"` (fr) / `"0 words"` (en) selon la convention de la langue
- `(0, 'fr')` → `"0 mot"` (convention française : zéro singulier)
- `(0, 'en')` → `"0 words"` (convention anglaise : zéro pluriel)
- `(0, 'cr')` → `"0 nêhiyaw-pîkiskwêwin"` (convention non documentée → fallback singulier)
- `(0, 'pt', 'palavra', 'palavras')` → `"0 palavra"` (défaut fallback singulier pour custom)
- `(0, 'pt', 'palavra', 'palavras', true)` → `"0 palavras"` (convention pluriel explicite)
- Nombre négatif → traité comme `0` → `"0 mot"`
- Langue non supportée (ex. `'es'`, `'de'`) → fallback silencieux vers `'fr'`
- `1.7` (nombre décimal) → arrondi vers le bas → traité comme `1`
- `singulier`/`pluriel` fournis avec une langue non supportée → les formes custom sont utilisées, pas de fallback nécessaire pour le mot
- Très grand nombre (ex. `1 000 000`) → formaté correctement selon la locale

---

## API Publique

### Sélecteurs

```
mots    ← MotsPipe (classe principale)
words   ← WordsPipe (alias, hérite de MotsPipe)
```

### Inputs

| Input | Type | Requis | Défaut | Description |
|---|---|---|---|---|
| `value` | `number \| null` | ✅ | — | Nombre de mots à formater |
| `langue` | `'fr' \| 'en' \| 'cr'` | — | `'fr'` | Langue du formatage et de la traduction |
| `singulier`    | `string \| undefined`  | — | `undefined` | Forme singulière custom (ex: `'palavra'`) — prime sur les traductions intégrées |
| `pluriel`      | `string \| undefined`  | — | `undefined` | Forme plurielle custom (ex: `'palavras'`) — prime sur les traductions intégrées |
| `zeroPluriel`  | `boolean \| undefined` | — | `undefined` | Convention pour le zéro : `true` = pluriel (anglais), `false` = singulier (français). Si absent → valeur de la langue intégrée, sinon `false`. Prime sur la table intégrée — permet de surcharger même `'en'`. |

### Outputs

Aucun output — c'est un pipe pur (transformation valeur → chaîne).

### Valeur retournée

`string` — ex. `"1 234 mots"`, `"1 word"`, `"1 nêhiyaw-pîkiskwêwin"`

### Types / interfaces exportés

- `MotsPipe` — classe principale du pipe
- `WordsPipe` — alias anglophone (hérite de `MotsPipe`)

---

## Requirements

### Formatage des nombres

- **FR-001** : Le pipe DOIT utiliser le séparateur de milliers de la locale active :
  - `'fr'` et `'cr'` → espace fine insécable (U+202F)
  - `'en'` → virgule (`,`)
- **FR-002** : Un nombre négatif ou `null` DOIT être traité comme `0` sans lever d'erreur.
- **FR-003** : Un nombre décimal DOIT être arrondi vers le bas avant traitement.

### Traduction du mot "mots"

- **FR-004** : Le pipe DOIT retourner le singulier pour la valeur `1`, et toujours pour la valeur `0` si la convention de la langue est `zeroPluriel = false`.
- **FR-005** : Le pipe DOIT retourner le pluriel pour `0` si la convention de la langue est `zeroPluriel = true`, et pour toutes les valeurs ≥ 2.
- **FR-004b** : Résolution de `zeroPluriel` — priorité en cascade :
  1. Paramètre `zeroPluriel` fourni explicitement → toujours prioritaire (surcharge la table intégrée)
  2. Valeur définie dans la table intégrée pour la langue active
  3. `false` par défaut (convention française — singulier pour 0)
- **FR-006** : Les formes linguistiques intégrées DOIVENT être :
  - `'fr'` : singulier `"mot"`, pluriel `"mots"`, `zeroPluriel: false` (0 mot)
  - `'en'` : singulier `"word"`, pluriel `"words"`, `zeroPluriel: true` (0 words)
  - `'cr'` : singulier `"nêhiyaw-pîkiskwêwin"`, pluriel `"nêhiyaw-pîkiskwêwina"`, `zeroPluriel` non documenté → fallback `false`

### Langue et fallback

- **FR-007** : La langue par défaut DOIT être `'fr'` si aucun argument n'est passé.
- **FR-008** : Toute langue non reconnue DOIT silencieusement utiliser `'fr'` comme fallback.
- **FR-013** : Si `singulier` et/ou `pluriel` sont fournis, ils priment sur les traductions intégrées pour toutes les langues.

### Architecture et exportation

- **FR-009** : `MotsPipe` DOIT contenir toute la logique de transformation.
- **FR-010** : `WordsPipe` DOIT hériter de `MotsPipe` sans redéfinir la logique — sélecteur `words` uniquement.
- **FR-011** : Les deux pipes DOIVENT être exportés dans `public-api.ts` et utilisables indépendamment l'un de l'autre.
- **FR-012** : Le pipe DOIT fonctionner sans aucune dépendance directe supplémentaire (formatage via API native du navigateur/runtime).

---

## Success Criteria

- **SC-001** : Un développeur peut afficher `"1 234 mots"` avec `{{ 1234 | mots }}` sans aucune configuration préalable.
- **SC-002** : Le résultat est typographiquement correct pour chaque locale (séparateur de milliers approprié, accord singulier/pluriel).
- **SC-003** : Une valeur `null` ou négative ne provoque jamais d'erreur visible ni de crash.
- **SC-004** : Un développeur anglophone peut utiliser `| words` de façon interchangeable avec `| mots`.
- **SC-005** : Le pipe peut être installé et utilisé dans un projet Angular vierge avec uniquement `npm install ngx-parrecrivains`.
- **SC-006** : Un développeur peut passer ses propres formes singulier/pluriel pour supporter n'importe quelle langue via `{{ n | mots:'pt':'palavra':'palavras' }}`.

---

## Assumptions

- Le formatage des milliers est délégué à l'API native `Intl.NumberFormat` disponible dans tous les navigateurs cibles (Chrome 120+, Firefox 121+, Safari 17+).
- Le cri utilise le même formatage des milliers que le français (convention documentée dans la lib).
- Le pipe est `pure` (sans état, déterministe) — Angular peut le mettre en cache automatiquement.
- `WordsPipe` n'a pas de comportement propre : tout changement futur à `MotsPipe` s'applique automatiquement à `WordsPipe` par héritage.
- La valeur `0` est affichée au singulier en français et en anglais (convention grammaticale standard retenue).