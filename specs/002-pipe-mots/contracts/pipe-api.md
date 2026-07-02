# Contrat d'API — MotsPipe / WordsPipe

**Branch** : `002-pipe-mots` | **Date** : 2026-06-01

---

## Exports publics (`public-api.ts`)

```typescript
export * from './lib/mots/mots.pipe';
```

---

## MotsPipe

```typescript
@Pipe({ name: 'mots' })
export class MotsPipe implements PipeTransform {
  transform(
    value:        number | null,  // nombre de mots (requis)
    langue?:      string,         // code langue — défaut 'fr'
    singulier?:   string,         // forme singulière custom (prime sur les intégrées)
    pluriel?:     string,         // forme plurielle custom (prime sur les intégrées)
    zeroPluriel?: boolean         // true = 0 pluriel, false = 0 singulier — prime sur la table intégrée
  ): string
}
```

### Comportement contractuel

| `value` | `langue` | `singulier` | `pluriel` | Résultat |
|---|---|---|---|---|
| `value` | `langue` | `singulier` | `pluriel` | `zeroPluriel` | Résultat |
|---|---|---|---|---|---|
| `1234` | (absent) | — | — | — | `"1 234 mots"` |
| `1` | `'fr'` | — | — | — | `"1 mot"` |
| `0` | `'fr'` | — | — | — | `"0 mot"` (zeroPluriel=false intégré) |
| `1234` | `'en'` | — | — | — | `"1,234 words"` |
| `1` | `'en'` | — | — | — | `"1 word"` |
| `0` | `'en'` | — | — | — | `"0 words"` (zeroPluriel=true intégré) |
| `1234` | `'cr'` | — | — | — | `"1 234 nêhiyaw-pîkiskwêwina"` |
| `1` | `'cr'` | — | — | — | `"1 nêhiyaw-pîkiskwêwin"` |
| `0` | `'cr'` | — | — | — | `"0 nêhiyaw-pîkiskwêwin"` (non documenté → fallback false) |
| `1234` | `'pt'` | `'palavra'` | `'palavras'` | — | `"1 234 palavras"` ¹ |
| `0` | `'pt'` | `'palavra'` | `'palavras'` | — | `"0 palavra"` (fallback false) |
| `0` | `'pt'` | `'palavra'` | `'palavras'` | `true` | `"0 palavras"` (explicite) |
| `0` | `'en'` | — | — | `false` | `"0 word"` (surcharge intégrée) |
| `null` | (absent) | — | — | — | `"0 mot"` |
| `-5` | (absent) | — | — | — | `"0 mot"` |
| `1.7` | (absent) | — | — | — | `"1 mot"` |
| `1234` | `'xx'` | — | — | — | `"1 234 mots"` (fallback 'fr') |

¹ Le formatage des milliers utilise la locale `'pt'` via `Intl.NumberFormat` (tentative directe) — résultat dépendant du runtime. En pratique, les navigateurs cibles supportent tous `'pt'`.

### Garanties

- Ne lève jamais d'exception (input `null`, négatif ou locale invalide → comportement défini)
- Retourne toujours une `string` non vide
- Résultat déterministe pour un même triplet (value, langue, singulier, pluriel)
- Pure pipe : Angular peut mettre le résultat en cache

---

## WordsPipe

```typescript
@Pipe({ name: 'words' })
export class WordsPipe extends MotsPipe {}
```

Comportement : **identique à `MotsPipe`** — même signature `transform()`, même logique.
Le sélecteur `words` est le seul ajout.

---

## Usage en template

```html
<!-- Français (défaut) -->
{{ totalMots | mots }}

<!-- Langue explicite -->
{{ totalMots | mots:'en' }}
{{ totalMots | mots:'cr' }}

<!-- Alias anglophone -->
{{ wordCount | words }}
{{ wordCount | words:'en' }}

<!-- Langue custom avec formes personnalisées -->
{{ total | mots:'pt':'palavra':'palavras' }}         <!-- 0 palavra  (défaut singulier) -->
{{ total | mots:'pt':'palavra':'palavras':true }}    <!-- 0 palavras (convention pluriel) -->
{{ total | mots:'en':undefined:undefined:false }}   <!-- surcharge : 0 word au lieu de 0 words -->
```

---

## Usage en TypeScript

```typescript
import { MotsPipe } from 'ngx-parrecrivains';

const pipe = new MotsPipe();
pipe.transform(1234);                              // "1 234 mots"
pipe.transform(1234, 'en');                        // "1,234 words"
pipe.transform(0, 'en');                           // "0 words"  (zeroPluriel=true intégré)
pipe.transform(0, 'fr');                           // "0 mot"    (zeroPluriel=false intégré)
pipe.transform(1, 'fr');                           // "1 mot"
pipe.transform(null);                              // "0 mot"
pipe.transform(0, 'pt', 'palavra', 'palavras');    // "0 palavra"  (fallback false)
pipe.transform(0, 'pt', 'palavra', 'palavras', true); // "0 palavras"
```
