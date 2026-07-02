# ngx-parrecrivains

[![npm version](https://badge.fury.io/js/ngx-parrecrivains.svg)](https://www.npmjs.com/package/ngx-parrecrivains)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Angular](https://img.shields.io/badge/Angular-21%2B-red.svg)](https://angular.dev)
![Fait au Québec](https://img.shields.io/badge/Fait%20au-Québec-003DA5)

[Français](#fr) | [English](#en)

---

## Présentation / Overview

| 🇫🇷 Français | 🇬🇧 English |
|---|---|
| `ngx-parrecrivains` est une bibliothèque Angular open source conçue pour l'industrie littéraire. Elle regroupe des composants, services et utilitaires réutilisables dans toute application Angular liée au monde du livre.<br>Initialement développée dans le cadre d'un projet de recherche de fin d'études pour favoriser le développement du projet [parrecrivains](https://parrecrivains.com) — initiative sociale de soutien pour l'industrie littéraire. | `ngx-parrecrivains` is an open-source Angular library designed for the literary industry. It bundles reusable components, services and utilities for any Angular application in the book world.<br>Initially developed as part of a final-year research project to support [parrecrivains](https://parrecrivains.com) — a social initiative for the literary industry. |

### Contenu actuel / Current contents

| Élément / Element | Type | Import | Version |
|---|---|---|---|
| `ngx-liseuse-manuscrit` | Composant / Component | `LiseuseManuscritComponent` | 0.1.0 |
| `\| mots` · `\| words` | Pipe | `MotsPipe` · `WordsPipe` | 0.2.0 |
| `TempsLectureService` | Service | `TempsLectureService` | 0.3.0 |
| `isbnValidator` · `validerIsbn` | Validateur / Validator | `isbnValidator`, `validerIsbn`, `ISBN_ERREURS` | 0.4.0 |

### Améliorations prévues / Planned additions

| Version | Élément / Element | Description |
|---|---|---|
| v0.5.0 | `normaliserIsbn()` + pipe `\| isbn` | Normalisation de format · ISBN normalization and formatting |
| v0.5.0 | `IsbnLookupService` | Métadonnées via Open Library (gratuit, sans clé) · Book metadata via Open Library (free, no API key) |
| — | `CarteComponent` | Carte auteur/manuscrit récursive · Recursive author/manuscript card |
| — | `CarousselComponent` | Carrousel générique · Generic carousel |

### IA & éthique / AI & ethics

**🇫🇷** Cette bibliothèque est développée en collaboration avec **[Claude Code](https://claude.ai/code)** (Anthropic) selon une approche de **Specification Driven Development (SDD)** via **[SpecKit](https://github.com/github/spec-kit)** (GitHub). La SDD consiste à rédiger des spécifications formelles complètes *avant* d'écrire la moindre ligne de code, ce qui encadre l'IA avec des règles explicites plutôt que de la laisser improviser. 

De plus, je met à jour ces règles chaque fois que je repère du code déprécié, bizare ou insécuritaire. Bref, je m'assure que le code créé est celui que j'aurais moi-même écrit ou mieu, ce qui est plus facile à gérer et m'aide en même temps à me perfectionner moi aussi.

Flux appliqué pour chaque élément de la lib :

| Commande | Artefact |
|---|---|
| `/speckit-constitution` | Règles non-négociables du projet (i18n, réutilisabilité, sécurité, tree-shaking, versionnage) |
| `/speckit-specify` | Spécification fonctionnelle : API publique, comportements, cas limites |
| `/speckit-plan` | Plan d'implémentation : architecture, décisions de design, contrats d'API |
| `/speckit-tasks` | Liste de tâches ordonnées avec marqueurs de parallélisme |
| `/speckit-implement` | Code source, tests, documentation |

Chaque artefact a été relu et corrigé manuellement avant l'étape suivante. L'IA est un multiplicateur de productivité — les décisions architecturales, les corrections de sécurité et les validations visuelles ont toutes été faites à initiative humaine.

---

**🇬🇧** This library is developed in collaboration with **[Claude Code](https://claude.ai/code)** (Anthropic) using a **Specification Driven Development (SDD)** approach via **[SpecKit](https://github.com/github/spec-kit)** (GitHub). SDD means writing complete formal specifications *before* writing any code, giving the AI explicit rules to follow rather than letting it improvise.

Beyond that, I update these rules whenever I spot deprecated, unusual, or insecure code. In short, I make sure the generated code is what I would have written myself — or better — which is easier to maintain and helps me improve my own skills along the way.

Workflow applied for each library element:

| Command | Artifact |
|---|---|
| `/speckit-constitution` | Non-negotiable project rules (i18n, reusability, security, tree-shaking, versioning) |
| `/speckit-specify` | Functional specification: public API, behaviors, edge cases |
| `/speckit-plan` | Implementation plan: architecture, design decisions, API contracts |
| `/speckit-tasks` | Ordered task list with parallelism markers |
| `/speckit-implement` | Source code, tests, documentation |

Each artifact was manually reviewed and corrected before moving to the next step. AI is a productivity multiplier — architectural decisions, security fixes, and visual validations were all human-initiated.

### Démo / Demo

| 🇫🇷 Français | 🇬🇧 English |
|---|---|
| Un dépôt de démo est disponible sur GitHub : **[ngx-parrecrivains-demo](https://github.com/MaiveCL/ngx-parrecrivains)**. Il contient un tutoriel complet accessible aux débutants, avec des exemples d'utilisation concrets pour chaque composant et service de la bibliothèque. | A demo repository is available on GitHub: **[ngx-parrecrivains-demo](https://github.com/MaiveCL/ngx-parrecrivains)**. It includes a complete beginner-friendly tutorial with real-world usage examples for each component and service in the library. |

---

<a name="fr"></a>
## 🇫🇷 Documentation — Français

> 🇬🇧 English version: [Documentation — English](#en)

### Installation

```bash
npm install ngx-parrecrivains
```

**Prérequis** : Angular 21+

### Utilisation rapide

```typescript
import { LiseuseManuscritComponent } from 'ngx-parrecrivains';

@Component({
  imports: [LiseuseManuscritComponent],
  template: `<ngx-liseuse-manuscrit [contenu]="texte" />`
})
export class AppComponent {
  texte = 'Il était une fois, dans une bibliothèque sans fin...';
}
```

### Composants et services

---

#### `ngx-liseuse-manuscrit`

Affiche un manuscrit avec contrôles de lecture intégrés.

**Formats supportés** : texte brut, HTML, PDF (`File`), Google Docs (URL), OneDrive (URL).

##### Inputs

| Input | Type | Requis | Défaut | Description |
|---|---|---|---|---|
| `contenu` | `string \| File \| null` | ✅ | — | Contenu à afficher |
| `titre` | `string \| undefined` | — | `undefined` | Titre affiché dans le panneau info |
| `auteur` | `string \| undefined` | — | `undefined` | Auteur affiché dans le panneau info |
| `langue` | `string` | — | `'fr'` | Langue de l'interface (`'fr'`, `'en'`, `'cr'`) |
| `config` | `Partial<ConfigLecture>` | — | `{}` | Configuration initiale, fusionnée avec `CONFIG_LECTURE_DEFAUT` |
| `textSelectable` | `boolean` | — | `true` | Autoriser la sélection du texte |
| `estimatedReadingTime` | `string \| number \| undefined` | — | `undefined` | Temps de lecture estimé (ex. depuis la BD) |

##### Outputs

| Output | Payload | Description |
|---|---|---|
| `progressionLecture` | `number` | Progression de défilement 0–100 %, throttle 250 ms |
| `readingTime` | `number` | Secondes de lecture active (pause si onglet masqué) |

##### Exemples

**Avec métadonnées et config initiale**

```html
<ngx-liseuse-manuscrit
  [contenu]="html"
  [titre]="'L\'archipel des mots'"
  [auteur]="'Camille Tremblay'"
  [langue]="'fr'"
  [config]="{ modeNuit: true, largeurColonneCh: 65 }"
/>
```

**Fichier PDF**

```typescript
fichier = signal<File | null>(null);

surSelection(event: Event) {
  const input = event.target as HTMLInputElement;
  this.fichier.set(input.files?.[0] ?? null);
}
```

```html
<input type="file" accept=".pdf" (change)="surSelection($event)" />
<ngx-liseuse-manuscrit [contenu]="fichier()" />
```

**URL Google Docs** (lien de partage `/edit` converti automatiquement en `/preview`)

```html
<ngx-liseuse-manuscrit
  [contenu]="'https://docs.google.com/document/d/ABC123/edit?usp=sharing'"
/>
```

**Suivi de progression**

```typescript
@Component({
  imports: [LiseuseManuscritComponent],
  template: `
    <ngx-liseuse-manuscrit
      [contenu]="manuscrit()"
      [estimatedReadingTime]="tempsEstime()"
      (progressionLecture)="mettreAJourProgression($event)"
      (readingTime)="enregistrerTemps($event)"
    />
  `
})
export class LectureComponent {
  manuscrit = input.required<string>();
  tempsEstime = input<string | undefined>(undefined);

  mettreAJourProgression(pourcent: number) { /* ... */ }
  enregistrerTemps(secondes: number) { /* ... */ }
}
```

---

#### `mots` / `words`

Pipe Angular qui formate un nombre de mots avec l'accord singulier/pluriel et le formatage typographique des milliers selon la langue.

**Langues intégrées** : français (`fr`, défaut), anglais (`en`), cri (`cr`).

##### Signature

```typescript
{{ valeur | mots }}
{{ valeur | mots: langue }}
{{ valeur | mots: langue : singulier : pluriel }}
{{ valeur | mots: langue : singulier : pluriel : zeroPluriel }}

// Alias anglophone — comportement identique
{{ valeur | words: 'en' }}
```

| Paramètre | Type | Défaut | Description |
|---|---|---|---|
| `valeur` | `number \| null` | — | Nombre de mots (`null` → `0`) |
| `langue` | `string` | `'fr'` | Code langue : `'fr'`, `'en'`, `'cr'`, ou toute locale BCP 47 |
| `singulier` | `string` | — | Forme custom singulier (prioritaire sur la table intégrée) |
| `pluriel` | `string` | — | Forme custom pluriel (prioritaire sur la table intégrée) |
| `zeroPluriel` | `boolean` | `false` (fr/cr) / `true` (en) | Forcer le pluriel pour zéro |

##### Exemples

```typescript
import { MotsPipe, WordsPipe } from 'ngx-parrecrivains';

@Component({
  imports: [MotsPipe],
  template: `
    {{ nombreMots | mots }}           <!-- "1 234 mots" -->
    {{ nombreMots | mots:'en' }}      <!-- "1,234 words" -->
    {{ nombreMots | mots:'cr' }}      <!-- "1 234 nêhiyaw-pîkiskwêwina" -->
    {{ 1 | mots }}                    <!-- "1 mot" -->
    {{ 0 | mots }}                    <!-- "0 mot" -->
    {{ 0 | mots:'en' }}               <!-- "0 words" -->
  `
})
export class MonComposant {
  nombreMots = signal(1234);
}
```

**Forme custom** (toute autre langue via `Intl.NumberFormat`) :

```html
{{ 1234 | mots:'pt':'palavra':'palavras' }}   <!-- "1 234 palavras" -->
{{ 1    | mots:'pt':'palavra':'palavras' }}   <!-- "1 palavra" -->
```

**Normalisation automatique** : `null` → `0`, négatif → `0`, décimal → `Math.floor`.

---

#### `TempsLectureService`

Service sans état pour estimer le temps de lecture à partir d'un nombre de mots.

##### Méthodes

| Méthode | Signature | Description |
|---|---|---|
| `estimer` | `(nombreMots: number \| null, vitesseMots?: number) → number` | Retourne le temps estimé en **secondes**. |
| `formater` | `(secondes: number) → string` | Retourne une chaîne affichable (`"5 min"`, `"1 h 05 min"`). |

##### Constante

| Constante | Valeur | Description |
|---|---|---|
| `VITESSE_LECTURE_DEFAUT` | `200` | Vitesse de lecture adulte en mots/min. Approximation — surcharger via `vitesseMots` si nécessaire. |

##### Exemples

```typescript
import { inject } from '@angular/core';
import { TempsLectureService, VITESSE_LECTURE_DEFAUT } from 'ngx-parrecrivains';

@Component({ /* ... */ })
export class FicheManuscritComponent {
  private readonly tempsLecture = inject(TempsLectureService);
  readonly nombreMots = input.required<number>();

  readonly tempsAffiche = computed(() =>
    this.tempsLecture.formater(this.tempsLecture.estimer(this.nombreMots()))
  );
  // 1000 mots  → "5 min"
  // 45000 mots → "3 h 45 min"
}
```

**Vitesse personnalisée** :

```typescript
// Lecture jeunesse (120 mots/min)
this.tempsLecture.formater(this.tempsLecture.estimer(nombreMots, 120));
```

**Passer le résultat à la liseuse** :

```html
<ngx-liseuse-manuscrit
  [contenu]="manuscrit()"
  [estimatedReadingTime]="tempsLecture.estimer(nombreMots())"
/>
```

**Normalisation automatique** : `null`, `undefined`, `NaN`, `Infinity`, négatif → `0` secondes.

---

#### `isbnValidator` / `validerIsbn`

Validator Angular (`ValidatorFn`) et fonction pure pour valider mathématiquement un ISBN-10 ou ISBN-13. Valide le checksum (mod 11 pour ISBN-10, mod 10 pondéré pour ISBN-13), le préfixe `978`/`979` (ISBN-13), et optionnellement la cohérence du format avec l'année de publication.

`validerIsbn()` est une **fonction pure sans dépendance Angular** — utilisable partout, testable sans TestBed.

##### Dans un formulaire réactif

```typescript
import { isbnValidator } from 'ngx-parrecrivains';

// Validation seule
readonly isbn = new FormControl('', isbnValidator());

// Avec cohérence d'année (ISBN-10 après 2006 ou ISBN-13 avant 2005 → erreur)
readonly isbn = new FormControl('', isbnValidator({ annee: 2015 }));
```

##### Hors formulaire

```typescript
import { validerIsbn } from 'ngx-parrecrivains';

validerIsbn('9780306406157')        // { valide: true }
validerIsbn('9780306406156')        // { valide: false, erreur: 'isbnChecksum' }
validerIsbn('9990306406157')        // { valide: false, erreur: 'isbnPrefixe' }
validerIsbn('12345')                 // { valide: false, erreur: 'isbnFormat' }
validerIsbn('0306406152', 2010)     // { valide: false, erreur: 'isbnCoherence' }
validerIsbn('')                      // { valide: true } — champ optionnel
```

##### Clés d'erreur (`ISBN_ERREURS`)

```typescript
import { ISBN_ERREURS } from 'ngx-parrecrivains';
// ISBN_ERREURS.FORMAT    → 'isbnFormat'
// ISBN_ERREURS.PREFIXE   → 'isbnPrefixe'
// ISBN_ERREURS.CHECKSUM  → 'isbnChecksum'
// ISBN_ERREURS.COHERENCE → 'isbnCoherence'
```

| Clé | Valeur | Déclenchée quand |
|---|---|---|
| `FORMAT` | `'isbnFormat'` | Longueur ≠ 10/13, caractères invalides, tirets, X mal placé |
| `PREFIXE` | `'isbnPrefixe'` | ISBN-13 sans préfixe `978` ou `979` |
| `CHECKSUM` | `'isbnChecksum'` | Chiffre de contrôle mathématiquement incorrect |
| `COHERENCE` | `'isbnCoherence'` | Format anachronique avec l'année (zone grise 2005–2006 : les deux formats acceptés) |

##### Affichage des erreurs

```html
@if (isbn.errors?.['isbnFormat']) {
  <span>Format invalide — entrez 10 ou 13 chiffres sans tirets.</span>
}
@if (isbn.errors?.['isbnChecksum']) {
  <span>Ce numéro ISBN est incorrect.</span>
}
@if (isbn.errors?.['isbnCoherence']) {
  <span>Format incohérent avec l'année de publication.</span>
}
```

---

### Types exportés

```typescript
import type {
  ConfigLecture,
  EtatLecture,
  ErreurLiseuse,
  CodeErreurLiseuse,
  FormatContenu,
  ModeAffichage,
  LangueSupported,
  TranslateServiceLike,
  IsbnOptions,
  IsbnResultat,
} from 'ngx-parrecrivains';

import {
  CONFIG_LECTURE_DEFAUT,
  LANGUES_SUPPORTEES,
  LANGUE_DEFAUT,
  TRANSLATE_SERVICE_TOKEN,
  ISBN_ERREURS,
  VITESSE_LECTURE_DEFAUT,
} from 'ngx-parrecrivains';
```

#### `ConfigLecture`

| Champ | Type | Défaut | Description |
|---|---|---|---|
| `taillePolicePx` | `number` | `18` | Taille de police (16–24) |
| `interligne` | `number` | `1.6` | Interligne (1,4–1,8) |
| `largeurColonneCh` | `number` | `70` | Largeur de colonne en `ch` (45–90) |
| `modeNuit` | `boolean` | `false` | Mode nuit |
| `brightness` | `number` | `100` | Luminosité CSS (0–200) |
| `contrast` | `number` | `100` | Contraste CSS (0–200) |
| `sepia` | `number` | `0` | Sépia CSS (0–100) |
| `superpositionOpacite` | `number` | `0` | Opacité de la superposition RGBA (0–1) |
| `superpositionCouleur` | `'noir' \| 'blanc'` | `'noir'` | Couleur de superposition |
| `niveauZoom` | `number` | `1.0` | Zoom (0,5–2,0, texte/HTML uniquement) |
| `modePagination` | `boolean` | `false` | Pagination par page entière |
| `pleinEcran` | `boolean` | `false` | Plein écran |
| `panneauInfoVisible` | `boolean` | `false` | Panneau d'informations visible |

### i18n

Trois langues intégrées sans configuration : **français** (défaut), **anglais**, **cri** (`cr`).

```typescript
// Aucune configuration requise — fonctionne hors de la boîte :
<ngx-liseuse-manuscrit [contenu]="texte" [langue]="'en'" />
```

Si votre application utilise déjà `@ngx-translate/core`, la liseuse s'y branche
automatiquement via `TRANSLATE_SERVICE_TOKEN`. Fournissez le token dans votre
configuration d'application :

```typescript
// app.config.ts
import { TRANSLATE_SERVICE_TOKEN } from 'ngx-parrecrivains';
import { TranslateService } from '@ngx-translate/core';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    { provide: TRANSLATE_SERVICE_TOKEN, useExisting: TranslateService },
  ],
};
```

Les clés de la liseuse sont préfixées `liseuse.*` — vous pouvez les surcharger
dans vos propres fichiers de traduction.

Sans `@ngx-translate/core` : les textes s'affichent dans la langue de l'input `[langue]`
via le fallback interne, sans aucune configuration.

### Personnalisation CSS

```css
ngx-liseuse-manuscrit {
  --liseuse-fond: #f5f0e8;          /* fond jour */
  --liseuse-texte: #2c1810;         /* texte jour */
  --liseuse-fond-nuit: #0d0d0d;     /* fond nuit */
  --liseuse-texte-nuit: #f0e6d0;    /* texte nuit */
}
```

### Sécurité

**HTML** — Le contenu HTML passé via `[contenu]` est sanitisé automatiquement par Angular (`[innerHTML]`). Les balises de mise en forme standard (titres, paragraphes, listes, citations) sont conservées ; les scripts et attributs dangereux sont supprimés. Si votre HTML provient d'une source externe non fiable (API tierce, contenu utilisateur), sanitisez-le avant de le passer au composant :

```typescript
import { inject } from '@angular/core';
import { DomSanitizer, SecurityContext } from '@angular/platform-browser';

// Dans votre composant
private readonly sanitizer = inject(DomSanitizer);

readonly contenuPropre = computed(() =>
  this.sanitizer.sanitize(SecurityContext.HTML, this.contenuBrut()) ?? ''
);
```

**Iframes (Google Docs, OneDrive)** — Les URLs sont validées selon un pattern strict avant d'être chargées. L'iframe embarque `sandbox="allow-scripts allow-forms allow-popups"` qui restreint ce que le contenu peut faire. `allow-same-origin` est volontairement absent : le combiner avec `allow-scripts` permettrait au document embarqué de retirer son propre sandbox via script.

**CSP recommandé** — Pour une défense en profondeur côté serveur, configurez l'en-tête `Content-Security-Policy` avec `frame-src docs.google.com onedrive.live.com 1drv.ms blob:`. Cela empêche le navigateur de charger tout autre domaine en iframe, indépendamment du code client.

### Ressources — nouveau développeur

- [Guide du nouveau développeur](https://github.com/MaiveCL/parrecrivains/blob/main/docs/comment_publier_npx-parrecrivains/index.md)
- [Publier sur npm — séquence complète](https://github.com/MaiveCL/parrecrivains/blob/main/docs/publier-npm.md)
- [CHANGELOG](./CHANGELOG.md)
- [Dépôt source](https://github.com/MaiveCL/parrecrivains)
- [Site de démo](https://github.com/MaiveCL/ngx-parrecrivains)

### Licence

MIT © 2026 [parrecrivains](https://parrecrivains.com)

---

<a name="en"></a>
## 🇬🇧 Documentation — English

> 🇫🇷 Version française : [Documentation — Français](#fr)

### Installation

```bash
npm install ngx-parrecrivains
```

**Requirements**: Angular 21+

### Quick start

```typescript
import { LiseuseManuscritComponent } from 'ngx-parrecrivains';

@Component({
  imports: [LiseuseManuscritComponent],
  template: `<ngx-liseuse-manuscrit [contenu]="text" />`
})
export class AppComponent {
  text = 'Once upon a time, in an endless library...';
}
```

### Components and services

---

#### `ngx-liseuse-manuscrit`

Displays a manuscript with built-in reading controls.

**Supported formats**: plain text, HTML, PDF (`File`), Google Docs (URL), OneDrive (URL).

##### Inputs

| Input | Type | Required | Default | Description |
|---|---|---|---|---|
| `contenu` | `string \| File \| null` | ✅ | — | Content to display |
| `titre` | `string \| undefined` | — | `undefined` | Title shown in the info panel |
| `auteur` | `string \| undefined` | — | `undefined` | Author shown in the info panel |
| `langue` | `string` | — | `'fr'` | UI language (`'fr'`, `'en'`, `'cr'`) |
| `config` | `Partial<ConfigLecture>` | — | `{}` | Initial config, merged with `CONFIG_LECTURE_DEFAUT` |
| `textSelectable` | `boolean` | — | `true` | Allow text selection |
| `estimatedReadingTime` | `string \| number \| undefined` | — | `undefined` | Reading time estimate (e.g. from database) |

##### Outputs

| Output | Payload | Description |
|---|---|---|
| `progressionLecture` | `number` | Scroll progress 0–100%, throttled 250 ms |
| `readingTime` | `number` | Active reading seconds (pauses when tab is hidden) |

##### Examples

**With metadata and initial config**

```html
<ngx-liseuse-manuscrit
  [contenu]="html"
  [titre]="'The Archipelago of Words'"
  [auteur]="'Camille Tremblay'"
  [langue]="'en'"
  [config]="{ modeNuit: true, largeurColonneCh: 65 }"
/>
```

**PDF file**

```typescript
fichier = signal<File | null>(null);

onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  this.fichier.set(input.files?.[0] ?? null);
}
```

```html
<input type="file" accept=".pdf" (change)="onFileSelected($event)" />
<ngx-liseuse-manuscrit [contenu]="fichier()" />
```

**Google Docs URL** (`/edit` share links are automatically converted to `/preview`)

```html
<ngx-liseuse-manuscrit
  [contenu]="'https://docs.google.com/document/d/ABC123/edit?usp=sharing'"
/>
```

**Progress tracking**

```typescript
@Component({
  imports: [LiseuseManuscritComponent],
  template: `
    <ngx-liseuse-manuscrit
      [contenu]="manuscript()"
      [estimatedReadingTime]="estimatedTime()"
      (progressionLecture)="updateProgress($event)"
      (readingTime)="recordTime($event)"
    />
  `
})
export class ReadingComponent {
  manuscript = input.required<string>();
  estimatedTime = input<string | undefined>(undefined);

  updateProgress(percent: number) { /* persist to API */ }
  recordTime(seconds: number) { /* reading analytics */ }
}
```

---

#### `mots` / `words`

Angular pipe that formats a word count with singular/plural agreement and typographic thousands formatting based on language.

**Built-in languages**: French (`fr`, default), English (`en`), Cree (`cr`).

##### Signature

```typescript
{{ value | words }}
{{ value | words: language }}
{{ value | words: language : singular : plural }}
{{ value | words: language : singular : plural : zeroPlural }}

// French alias — identical behavior
{{ value | mots: 'fr' }}
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `value` | `number \| null` | — | Word count (`null` → `0`) |
| `language` | `string` | `'fr'` | Language code: `'fr'`, `'en'`, `'cr'`, or any BCP 47 locale |
| `singular` | `string` | — | Custom singular form (overrides built-in table) |
| `plural` | `string` | — | Custom plural form (overrides built-in table) |
| `zeroPlural` | `boolean` | `false` (fr/cr) / `true` (en) | Force plural form for zero |

##### Examples

```typescript
import { MotsPipe, WordsPipe } from 'ngx-parrecrivains';

@Component({
  imports: [MotsPipe],
  template: `
    {{ wordCount | mots }}           <!-- "1 234 mots" -->
    {{ wordCount | mots:'en' }}      <!-- "1,234 words" -->
    {{ wordCount | mots:'cr' }}      <!-- "1 234 nêhiyaw-pîkiskwêwina" -->
    {{ 1 | mots }}                   <!-- "1 mot" -->
    {{ 0 | mots }}                   <!-- "0 mot" -->
    {{ 0 | mots:'en' }}              <!-- "0 words" -->
  `
})
export class MyComponent {
  wordCount = signal(1234);
}
```

**Custom form** (any other language via `Intl.NumberFormat`):

```html
{{ 1234 | mots:'pt':'palavra':'palavras' }}   <!-- "1 234 palavras" -->
{{ 1    | mots:'pt':'palavra':'palavras' }}   <!-- "1 palavra" -->
```

**Auto-normalization**: `null` → `0`, negative → `0`, decimal → `Math.floor`.

---

#### `TempsLectureService`

Stateless service for estimating reading time from a word count.

##### Methods

| Method | Signature | Description |
|---|---|---|
| `estimer` | `(nombreMots: number \| null, vitesseMots?: number) → number` | Returns estimated time in **seconds**. |
| `formater` | `(secondes: number) → string` | Returns a display-ready string (`"5 min"`, `"1 h 05 min"`). |

##### Constant

| Constant | Value | Description |
|---|---|---|
| `VITESSE_LECTURE_DEFAUT` | `200` | Adult reading speed in words/min. Approximation — override via `vitesseMots` if needed. |

##### Examples

```typescript
import { inject } from '@angular/core';
import { TempsLectureService, VITESSE_LECTURE_DEFAUT } from 'ngx-parrecrivains';

@Component({ /* ... */ })
export class ManuscriptCardComponent {
  private readonly tempsLecture = inject(TempsLectureService);
  readonly wordCount = input.required<number>();

  readonly readingTime = computed(() =>
    this.tempsLecture.formater(this.tempsLecture.estimer(this.wordCount()))
  );
  // 1000 words  → "5 min"
  // 45000 words → "3 h 45 min"
}
```

**Custom speed**:

```typescript
// Young reader (120 wpm)
this.tempsLecture.formater(this.tempsLecture.estimer(wordCount, 120));
```

**Pass result to the reader component**:

```html
<ngx-liseuse-manuscrit
  [contenu]="manuscript()"
  [estimatedReadingTime]="tempsLecture.estimer(wordCount())"
/>
```

**Auto-normalization**: `null`, `undefined`, `NaN`, `Infinity`, negative → `0` seconds.

---

#### `isbnValidator` / `validerIsbn`

Angular `ValidatorFn` factory and pure function for mathematically validating ISBN-10 and ISBN-13 numbers. Validates checksum (mod 11 for ISBN-10, weighted mod 10 for ISBN-13), `978`/`979` prefix (ISBN-13), and optionally the consistency of the format with the publication year.

`validerIsbn()` is a **pure function with no Angular dependency** — usable anywhere, testable without TestBed.

##### In a reactive form

```typescript
import { isbnValidator } from 'ngx-parrecrivains';

// Validation only
readonly isbn = new FormControl('', isbnValidator());

// With year consistency (ISBN-10 after 2006 or ISBN-13 before 2005 → error)
readonly isbn = new FormControl('', isbnValidator({ annee: 2015 }));
```

##### Outside a form

```typescript
import { validerIsbn } from 'ngx-parrecrivains';

validerIsbn('9780306406157')        // { valide: true }
validerIsbn('9780306406156')        // { valide: false, erreur: 'isbnChecksum' }
validerIsbn('9990306406157')        // { valide: false, erreur: 'isbnPrefixe' }
validerIsbn('12345')                 // { valide: false, erreur: 'isbnFormat' }
validerIsbn('0306406152', 2010)     // { valide: false, erreur: 'isbnCoherence' }
validerIsbn('')                      // { valide: true } — optional field
```

##### Error keys (`ISBN_ERREURS`)

```typescript
import { ISBN_ERREURS } from 'ngx-parrecrivains';
// ISBN_ERREURS.FORMAT    → 'isbnFormat'
// ISBN_ERREURS.PREFIXE   → 'isbnPrefixe'
// ISBN_ERREURS.CHECKSUM  → 'isbnChecksum'
// ISBN_ERREURS.COHERENCE → 'isbnCoherence'
```

| Key | Value | Triggered when |
|---|---|---|
| `FORMAT` | `'isbnFormat'` | Length ≠ 10/13, invalid characters, dashes, misplaced X |
| `PREFIXE` | `'isbnPrefixe'` | ISBN-13 without `978` or `979` prefix |
| `CHECKSUM` | `'isbnChecksum'` | Mathematically incorrect check digit |
| `COHERENCE` | `'isbnCoherence'` | Format inconsistent with year (grace period 2005–2006: both formats accepted) |

##### Displaying errors in the template

```html
@if (isbn.errors?.['isbnFormat']) {
  <span>Invalid format — enter 10 or 13 digits without dashes.</span>
}
@if (isbn.errors?.['isbnChecksum']) {
  <span>This ISBN number is incorrect.</span>
}
@if (isbn.errors?.['isbnCoherence']) {
  <span>Format inconsistent with publication year.</span>
}
```

---

### Exported types

```typescript
import type {
  ConfigLecture,
  EtatLecture,
  ErreurLiseuse,
  CodeErreurLiseuse,
  FormatContenu,
  ModeAffichage,
  LangueSupported,
  TranslateServiceLike,
  IsbnOptions,
  IsbnResultat,
} from 'ngx-parrecrivains';

import {
  CONFIG_LECTURE_DEFAUT,
  LANGUES_SUPPORTEES,
  LANGUE_DEFAUT,
  TRANSLATE_SERVICE_TOKEN,
  ISBN_ERREURS,
  VITESSE_LECTURE_DEFAUT,
} from 'ngx-parrecrivains';
```

### i18n

Three languages built in with no configuration: **French** (default), **English**, **Cree** (`cr`).

```typescript
// No configuration required — works out of the box:
<ngx-liseuse-manuscrit [contenu]="text" [langue]="'en'" />
```

If your app already uses `@ngx-translate/core`, the component integrates automatically
via `TRANSLATE_SERVICE_TOKEN`. Provide the token in your app configuration:

```typescript
// app.config.ts
import { TRANSLATE_SERVICE_TOKEN } from 'ngx-parrecrivains';
import { TranslateService } from '@ngx-translate/core';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    { provide: TRANSLATE_SERVICE_TOKEN, useExisting: TranslateService },
  ],
};
```

The component's translation keys are prefixed `liseuse.*` — you can override them
in your own translation files.

Without `@ngx-translate/core`: texts are displayed in the language of `[langue]`
using the built-in fallback, with no configuration needed.

### CSS customization

```css
ngx-liseuse-manuscrit {
  --liseuse-fond: #f5f0e8;          /* day background */
  --liseuse-texte: #2c1810;         /* day text */
  --liseuse-fond-nuit: #0d0d0d;     /* night background */
  --liseuse-texte-nuit: #f0e6d0;    /* night text */
}
```

### Security

**HTML** — HTML content passed via `[contenu]` is automatically sanitized by Angular (`[innerHTML]`). Standard formatting tags (headings, paragraphs, lists, blockquotes) are preserved; scripts and dangerous attributes are stripped. If your HTML comes from an untrusted external source (third-party API, user-generated content), sanitize it before passing it to the component:

```typescript
import { inject } from '@angular/core';
import { DomSanitizer, SecurityContext } from '@angular/platform-browser';

// In your component
private readonly sanitizer = inject(DomSanitizer);

readonly cleanContent = computed(() =>
  this.sanitizer.sanitize(SecurityContext.HTML, this.rawContent()) ?? ''
);
```

**Iframes (Google Docs, OneDrive)** — URLs are validated against a strict pattern before being loaded. The iframe includes `sandbox="allow-scripts allow-forms allow-popups"` that limits what embedded content can do. `allow-same-origin` is intentionally omitted: combining it with `allow-scripts` would allow the embedded document to remove its own sandbox via script.

**Recommended CSP** — For server-side defense in depth, set a `Content-Security-Policy` header with `frame-src docs.google.com onedrive.live.com 1drv.ms blob:`. This prevents the browser from loading any other domain in an iframe, regardless of client-side code.

### Resources — new developer

- [New developer guide](https://github.com/MaiveCL/parrecrivains/blob/main/docs/comment_publier_npx-parrecrivains/index.md)
- [Publishing to npm — complete sequence](https://github.com/MaiveCL/parrecrivains/blob/main/docs/publier-npm.md)
- [CHANGELOG](./CHANGELOG.md)
- [Source repository](https://github.com/MaiveCL/parrecrivains)
- [Demo site](https://github.com/MaiveCL/ngx-parrecrivains)

### License

MIT © 2026 [parrecrivains](https://parrecrivains.com)
