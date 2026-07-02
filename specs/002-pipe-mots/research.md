# Research : MotsPipe / WordsPipe

**Branch** : `002-pipe-mots` | **Date** : 2026-06-01

---

## 1. Héritage de pipe Angular 21

**Decision** : `WordsPipe extends MotsPipe` dans le même fichier `.ts`, chacun avec son propre décorateur `@Pipe`.

**Rationale** : Angular exige que la classe enfant ait son propre décorateur `@Pipe` pour être reconnue par le compilateur. La classe enfant hérite de `transform()` automatiquement — aucune redéfinition nécessaire. Mettre les deux dans le même fichier évite un fichier quasi-vide.

```typescript
@Pipe({ name: 'mots' })
export class MotsPipe implements PipeTransform {
  transform(...): string { ... }
}

@Pipe({ name: 'words' })
export class WordsPipe extends MotsPipe {}
```

**Alternatives considérées** :
- Deux fichiers séparés : `mots.pipe.ts` + `words.pipe.ts` → bruit inutile, WordsPipe est une ligne
- Un seul décorateur sur la classe mère → ne fonctionne pas, Angular ne voit pas le sélecteur `words`

---

## 2. Stratégie de locale pour Intl.NumberFormat

**Decision** : Table de correspondance langue → locale BCP 47, avec tentative directe pour les langues inconnues.

| `langue` | Locale Intl | Séparateur milliers |
|---|---|---|
| `'fr'` | `'fr-FR'` | espace fine insécable (U+202F) |
| `'cr'` | `'fr-FR'` | espace fine insécable (U+202F) |
| `'en'` | `'en-US'` | virgule (`,`) |
| Autre | tentative directe, fallback `'fr-FR'` | selon la locale |

Pour une langue non reconnue (`'pt'`, `'es'`, etc.) :
1. Tenter `new Intl.NumberFormat(langue)` dans un try/catch
2. Si la locale est valide (le runtime la reconnaît) → utiliser son formatage
3. Si erreur (RangeError) → fallback `'fr-FR'`

**Rationale** : Cette approche permet aux custom `singulier`/`pluriel` de bénéficier du bon formatage de nombres pour leur langue — sans devoir coder toutes les locales du monde dans la lib.

**Alternatives considérées** :
- Fallback systématique vers `'fr-FR'` pour toute langue inconnue → pénalise les usages custom (ex. portugais afficherait des espaces françaises au lieu de points)
- Table de correspondance exhaustive → maintenance impossible, 700+ locales BCP 47

---

## 3. Paramètres custom `singulier` et `pluriel`

**Decision** : Paramètres optionnels en position 3 et 4 du `transform()`, priment sur les traductions intégrées.

**Signature complète** :
```typescript
transform(
  value: number | null,
  langue?: string,
  singulier?: string,
  pluriel?: string
): string
```

**Usage template** :
```
{{ n | mots }}                           → fr par défaut
{{ n | mots:'en' }}                      → anglais intégré
{{ n | mots:'pt':'palavra':'palavras' }} → portugais via custom forms
{{ n | mots:'fr':'texte':'textes' }}     → fr, mais mot custom
```

**Rationale** : Ce pattern rend le pipe extensible à l'infini sans modifier la lib ni injecter un service. L'ordre des paramètres (langue avant les formes) est cohérent avec la priorité d'usage — la langue seule est le cas le plus fréquent.

**Alternatives considérées** :
- Objet options `{ langue, singulier, pluriel }` → Angular ne supporte pas les objets comme paramètres de pipe (pas réactif aux changements internes)
- Sous-classer MotsPipe pour chaque langue → anti-pattern pour un pipe simple

---

## 4. i18n — Pourquoi les formes de mots sont embarquées (pas dans les JSON)

**Decision** : Lookup table interne dans `MotsPipe`, pas de fichiers `public/i18n/*.json`.

**Rationale** :
- Un pipe est un primitif de transformation sans état — injecter `TraductionService` créerait un couplage avec un service de la liseuse (violation du Principe I de la constitution)
- Le Principe II de la constitution ("Tout texte visible externalisé en i18n") vise les chaînes d'interface dans les templates — pas les données de transformation d'un pipe
- Le paramètre `langue` est lui-même le mécanisme d'i18n : il détermine la locale ET le mot traduit

**Adaptation documentée dans la constitution** : Le Principe II s'applique aux composants visuels avec des chaînes d'interface. Pour les pipes de transformation, les données linguistiques sont partie intégrante de l'algorithme.

**Alternatives considérées** :
- Injecter TraductionService → dépendance croisée entre lib elements (violation Principe I)
- Lire les JSON via `fetch` → asynchrone, incompatible avec un pipe pur synchrone
- Forcer l'app hôte à fournir les traductions via un token d'injection → sur-ingénierie pour un cas simple

---

## 5. Type du paramètre `langue`

**Decision** : `string` (pas un union type strict) pour le paramètre de langue.

**Rationale** : Accepter `string` permet à l'app hôte de passer n'importe quelle langue sans erreur TypeScript lorsque des formes custom sont fournies. Les formes intégrées sont sélectionnées via un lookup `Record<'fr' | 'en' | 'cr', { singulier: string; pluriel: string }>` — si la clé n'existe pas, on utilise 'fr' comme fallback (ou les formes custom si fournies).

**Alternatives considérées** :
- `'fr' | 'en' | 'cr'` strict → empêche le type-checking pour les custom forms (`| mots:'pt':...`)
- `'fr' | 'en' | 'cr' | string` → TypeScript élargit à `string` de toute façon

---

## 6. Structure de fichiers

**Decision** :

```
src/frontend/projects/ngx-parrecrivains/src/lib/mots/
├── mots.pipe.ts        ← MotsPipe + WordsPipe (même fichier, WordsPipe = 1 ligne)
└── mots.pipe.spec.ts   ← tests unitaires Vitest
```

Pas de sous-dossier `types/` — aucun type public à exporter au-delà des classes elles-mêmes.

**Rationale** : La simplicité du pipe ne justifie pas une structure plus profonde. Deux classes dans un fichier est idiomatique quand la seconde est triviale.
