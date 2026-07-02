# Data Model : MotsPipe / WordsPipe

**Branch** : `002-pipe-mots` | **Date** : 2026-06-01

---

## Entités

Ce pipe est une transformation pure sans persistance ni entités complexes.
Les seules "données" sont les tables de correspondance internes.

---

## Table de formes linguistiques intégrées

Lookup table statique embarquée dans `MotsPipe`.

| Langue | Singulier | Pluriel | `zeroPluriel` |
|---|---|---|---|
| `'fr'` | `"mot"` | `"mots"` | `false` (0 mot) |
| `'en'` | `"word"` | `"words"` | `true` (0 words) |
| `'cr'` | `"nêhiyaw-pîkiskwêwin"` | `"nêhiyaw-pîkiskwêwina"` | `undefined` — non documenté |

Clé d'accès : `langue` normalisé. Si absent du tableau → fallback `'fr'` pour les formes, `false` pour `zeroPluriel`.

---

## Table de correspondance locale → BCP 47

| Langue | Locale Intl.NumberFormat |
|---|---|
| `'fr'` | `'fr-FR'` |
| `'cr'` | `'fr-FR'` |
| `'en'` | `'en-US'` |
| Autre | tentative directe (try/catch), fallback `'fr-FR'` |

---

## Règles de normalisation de l'input

| Condition | Résultat normalisé |
|---|---|
| `null` | `0` |
| `< 0` (négatif) | `0` |
| Décimal (ex. `1.7`) | `Math.floor(value)` → `1` |
| `≥ 0` entier | valeur telle quelle |

---

## Règle singulier/pluriel

| Valeur normalisée | `zeroPluriel` résolu | Forme retournée |
|---|---|---|
| `=== 1` | (n'a pas d'effet) | singulier |
| `=== 0` | `false` | singulier |
| `=== 0` | `true` | pluriel |
| `>= 2` | (n'a pas d'effet) | pluriel |

### Résolution de `zeroPluriel`

```
1. paramètre explicite fourni         → prioritaire (surcharge même les langues intégrées)
2. table intégrée[langue].zeroPluriel → si défini (non undefined)
3. false                              → fallback général (convention française)
```

---

## Priorité des formes de mots

```
si (singulier/pluriel custom fournis) → utiliser les custom forms
sinon → chercher dans la lookup table par langue
si (langue non trouvée dans la table) → utiliser 'fr' comme fallback
```
