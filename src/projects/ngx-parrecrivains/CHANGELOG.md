# Changelog — ngx-parrecrivains

> 🇬🇧 English version below / Version anglaise ci-dessous

Toutes les modifications notables sont documentées ici.
Format : [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/)
Versionnage : [Semantic Versioning](https://semver.org/lang/fr/)

---

## [0.4.2] — 2026-07-02

### Ajouté

**`VERSION`** — constante exportée de type `Version` (Angular) indiquant la version de la librairie installée.

```typescript
import { VERSION } from 'ngx-parrecrivains';
console.log(VERSION.full); // '0.4.2'
```

---

## [0.4.1] — 2026-06-04

### Corrigé

**`ZoneLectureComponent`** — correctif CSS : l'hôte passe de `display: block` à `display: flex; flex-direction: column` ; `.vue-native` utilise désormais `flex: 1` au lieu de `height: 100%`. Corrige le rendu des vues natives (PDF, iframe) qui pouvaient ne pas occuper toute la hauteur disponible dans certains contextes.

---

## [0.4.0] — 2026-06-03

### Ajouté

#### `isbnValidator` / `validerIsbn`

Validator Angular (`ValidatorFn`) et fonction pure pour valider mathématiquement un ISBN-10 ou ISBN-13.

- **Checksum** : mod 11 pondéré (ISBN-10), mod 10 alternant 1/3 (ISBN-13)
- **Préfixe** : ISBN-13 doit commencer par `978` ou `979`
- **Cohérence optionnelle** : ISBN-10 après 2006 ou ISBN-13 avant 2005 → `isbnCoherence` ; zone grise 2005–2006 acceptée dans les deux formats
- `validerIsbn()` est une **fonction pure sans dépendance Angular** — testable sans TestBed
- Exports : `isbnValidator`, `validerIsbn`, `ISBN_ERREURS`, `IsbnOptions`, `IsbnResultat`

```typescript
import { isbnValidator, validerIsbn, ISBN_ERREURS } from 'ngx-parrecrivains';

// FormControl
new FormControl('', isbnValidator())
new FormControl('', isbnValidator({ annee: 2015 }))

// Fonction pure
validerIsbn('9780306406157')        // { valide: true }
validerIsbn('9780306406156')        // { valide: false, erreur: 'isbnChecksum' }
validerIsbn('0306406152', 2010)     // { valide: false, erreur: 'isbnCoherence' }
```

---

## [0.3.0] — 2026-06-02

### Ajouté

#### `TempsLectureService`

Service Angular injectable sans état pour estimer le temps de lecture d'un texte à partir de son nombre de mots.

**Méthodes**

| Méthode | Signature | Description |
|---|---|---|
| `estimer` | `(nombreMots: number \| null, vitesseMots?: number) → number` | Retourne le temps estimé en **secondes**. Vitesse par défaut : `VITESSE_LECTURE_DEFAUT` (200 mots/min). |
| `formater` | `(secondes: number) → string` | Retourne `"5 min"` ou `"1 h 05 min"`. Valeurs ≤ 0 → `"0 min"`. |

**Constante exportée** : `VITESSE_LECTURE_DEFAUT = 200` — approximation adulte (source anglophone), surcharger via `vitesseMots` si nécessaire.

**Normalisation automatique** : `null`, `undefined`, `NaN`, `Infinity`, négatif → `0`.

```typescript
const s = inject(TempsLectureService);
s.formater(s.estimer(45000));           // "3 h 45 min"
s.formater(s.estimer(45000, 120));      // "6 h 15 min" (lecture lente)
```

### Sécurité

- **`FormatContenuService`** — `url.protocol === 'https:'` ajouté dans `_detecterChaine()`. Une URL `http://` ou `javascript://` sur un domaine légitime (Google Docs, OneDrive) retombe en `'texte-brut'` au lieu de recevoir un `bypassSecurityTrustResourceUrl`.

---

## [0.2.0] — 2026-06-02

### Ajouté

#### `MotsPipe` (`| mots`) et `WordsPipe` (`| words`)

Pipes Angular pour afficher un décompte de mots avec accord singulier/pluriel et formatage typographique des milliers.

**Langues intégrées** : français (`fr`, défaut), anglais (`en`), cri (`cr`).

**Signature** : `{{ valeur | mots: langue : singulier : pluriel : zeroPluriel }}`

| Comportement | Exemple | Résultat |
|---|---|---|
| Pluriel FR | `{{ 1234 \| mots }}` | `"1 234 mots"` |
| Singulier FR | `{{ 1 \| mots }}` | `"1 mot"` |
| Zéro FR (singulier) | `{{ 0 \| mots }}` | `"0 mot"` |
| Pluriel EN | `{{ 1234 \| mots:'en' }}` | `"1,234 words"` |
| Zéro EN (pluriel) | `{{ 0 \| mots:'en' }}` | `"0 words"` |
| Pluriel CR | `{{ 1234 \| mots:'cr' }}` | `"1 234 nêhiyaw-pîkiskwêwina"` |
| Alias anglophone | `{{ 1234 \| words:'en' }}` | `"1,234 words"` |
| Forme custom | `{{ 1234 \| mots:'pt':'palavra':'palavras' }}` | `"1 234 palavras"` |
| Langue inconnue | `{{ 1234 \| mots:'xx' }}` | fallback `fr` |

Normalisation automatique : `null` → `0`, négatif → `0`, décimal → `Math.floor`.
Formatage des milliers via `Intl.NumberFormat` natif — zéro dépendance.

Exports ajoutés : `MotsPipe`, `WordsPipe`.

### Sécurité

- **`ZoneLectureComponent`** — `bypassSecurityTrustHtml()` retiré. Le contenu HTML est maintenant sanitisé automatiquement par Angular via `[innerHTML]`. Un manuscrit ne contient que du texte formaté — aucune raison de bypasser la sanitisation.
- **`ZoneLectureComponent`** — attribut `sandbox="allow-scripts allow-forms allow-popups"` ajouté sur l'`<iframe>` (Google Docs, OneDrive). Restreint ce que le contenu embarqué peut faire. `allow-same-origin` volontairement absent : le combiner avec `allow-scripts` permettrait au document embarqué de retirer son propre sandbox via script.
- **README** — section Sécurité ajoutée : usage sécuritaire du HTML, comportement des iframes, CSP recommandé côté serveur.

---

## [0.1.1] — 2026-05-30

### Amélioré

**`BarreControlesComponent` — refonte complète de l'interface de contrôle**

La barre horizontale avec labels texte est remplacée par une barre compacte avec deux boutons ouvrant chacun un panneau latéral :

- **Barre principale** : deux boutons uniquement — ⚙ (paramètres de lecture) et ℹ (informations)
- **Panneau ⚙** : contrôles organisés en grille 3 colonnes avec icônes SVG inline compactes (aria-labels conservés) :
  - Mode nuit, plein écran, pagination (boutons toggle)
  - Taille de police `a ——— A`, interligne (flèche verticale), largeur de colonne (flèche horizontale)
  - Luminosité (dégradé blanc→noir), contraste (◐), sépia (cercle brun), zoom (loupe)
  - Superposition RGBA (sélecteur couleur + slider opacité)
  - Navigation pagination (si mode pagination actif)
- **Panneau ℹ** : titre, auteur, nombre de mots, progression et temps de lecture — anciennement un panneau latéral séparé dans `LiseuseManuscritComponent`
- Le panneau s'ouvre depuis la gauche et **décale le contenu vers la droite** (transition 0,25 s) — le texte reste visible et lisible ; fermeture en cliquant à l'extérieur
- Valeur numérique des sliders affichée uniquement au focus (`:focus-within` CSS — sans JS)
- Nouveau output `panneauChange` émis à chaque ouverture/fermeture (`'controles' | 'infos' | null`)
- Clés i18n `page`, `page_sur` retirées (compteur simplifié en `X / Y` sans traduction)
- Clé `liseuse.controles.parametres` ajoutée pour le bouton ⚙

**`LiseuseManuscritComponent` — suppression du panneau latéral**

- Suppression du panneau latéral droit (`.panneau-lateral`) et du bouton flottant ℹ (`.btn-toggle-panneau`) — remplacés par le système de panneaux de `BarreControlesComponent`
- Suppression de la mise en page responsive à deux colonnes (768 px+) — la barre est désormais toujours horizontale en haut
- `panneauInfoVisible` dans `ConfigLecture` n'a plus d'effet (l'état du panneau est géré en interne par `BarreControlesComponent`)

### Sécurité

**`FormatContenuService` — correction d'une vulnérabilité de validation d'URL**

La détection des URLs Google Docs et OneDrive utilisait `String.includes()`, permettant un bypass de domaine :

```
malveillant.docs.google.com.evil.com  → accepté à tort comme URL Google Docs
docs.google.com.phishing.ru           → idem
```

La vérification est maintenant effectuée via `URL.hostname` (vérification exacte du domaine). Les URLs malveillantes sont rejetées — elles reviennent à `'texte-brut'` ou `'inconnu'`, sans rendu dans un `<iframe>`.

---

## [0.1.0] — 2026-05-28

Première publication.

#### `LiseuseManuscritComponent` (`ngx-liseuse-manuscrit`)

Composant Angular 21 standalone pour la lecture de manuscrits littéraires.

**Formats supportés**
- Texte brut et HTML (mode optimisé — mise en page configurable)
- PDF via `<embed>` natif
- URL Google Docs et OneDrive via `<iframe>` preview

**Inputs**

| Input | Type | Requis | Description |
|---|---|---|---|
| `contenu` | `string \| File \| null` | ✅ | Contenu à afficher |
| `titre` | `string \| undefined` | — | Titre du manuscrit (panneau info) |
| `auteur` | `string \| undefined` | — | Nom de l'auteur (panneau info) |
| `langue` | `string` | — | Langue de l'interface (`'fr'` \| `'en'` \| `'cr'`) |
| `config` | `Partial<ConfigLecture>` | — | Configuration initiale, fusionnée avec les défauts |
| `textSelectable` | `boolean` | — | Autoriser la sélection de texte (défaut `true`) |
| `estimatedReadingTime` | `string \| number \| undefined` | — | Temps de lecture estimé fourni par l'app hôte |

**Outputs**

| Output | Type | Description |
|---|---|---|
| `progressionLecture` | `number` | Progression 0–100 %, throttle 250 ms (mode optimisé) |
| `readingTime` | `number` | Secondes de lecture active (pause si onglet masqué) |

**Contrôles visuels intégrés**
Mode nuit, taille de police (16–24 px), interligne (1,4–1,8), largeur de colonne (45–90 ch),
zoom (0,5×–2,0×, mode texte uniquement), luminosité, contraste, sépia, superposition RGBA,
pagination, plein écran.

**Navigation**
Swipe horizontal (mobile), molette (mode pagination), flèches clavier.

**i18n** : français, anglais, cri (`cr`) intégrés — aucune configuration requise.
Intégration optionnelle avec `@ngx-translate/core` via `TRANSLATE_SERVICE_TOKEN`.

**Types, constantes et tokens exportés**
`FormatContenu`, `ModeAffichage`, `ConfigLecture`, `EtatLecture`, `ErreurLiseuse`,
`CodeErreurLiseuse`, `LangueSupported`, `CONFIG_LECTURE_DEFAUT`, `LANGUES_SUPPORTEES`,
`LANGUE_DEFAUT`, `TRANSLATE_SERVICE_TOKEN`, `TranslateServiceLike`.

---

## [Unreleased]

_Aucune modification en cours._

---
---

## 🇬🇧 English

> 🇫🇷 Version française ci-dessus

> 🇫🇷 Version française ci-dessus

All notable changes are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
Versioning: [Semantic Versioning](https://semver.org/)

---

## [0.4.2] — 2026-07-02

### Added

**`VERSION`** — exported constant of type `Version` (Angular) indicating the installed library version.

```typescript
import { VERSION } from 'ngx-parrecrivains';
console.log(VERSION.full); // '0.4.2'
```

---

## [0.4.1] — 2026-06-04

### Fixed

**`ZoneLectureComponent`** — CSS fix: host switches from `display: block` to `display: flex; flex-direction: column`; `.vue-native` now uses `flex: 1` instead of `height: 100%`. Fixes native view (PDF, iframe) rendering that could fail to fill the available height in certain layouts.

---

## [0.4.0] — 2026-06-03

### Added

#### `isbnValidator` / `validerIsbn`

Angular `ValidatorFn` factory and pure function for mathematically validating ISBN-10 and ISBN-13 numbers.

- **Checksum**: weighted mod 11 (ISBN-10), alternating 1/3 mod 10 (ISBN-13)
- **Prefix**: ISBN-13 must start with `978` or `979`
- **Optional year consistency**: ISBN-10 after 2006 or ISBN-13 before 2005 → `isbnCoherence`; grace period 2005–2006 accepted in both formats
- `validerIsbn()` is a **pure function with no Angular dependency** — testable without TestBed
- Exports: `isbnValidator`, `validerIsbn`, `ISBN_ERREURS`, `IsbnOptions`, `IsbnResultat`

```typescript
import { isbnValidator, validerIsbn, ISBN_ERREURS } from 'ngx-parrecrivains';

// FormControl
new FormControl('', isbnValidator())
new FormControl('', isbnValidator({ annee: 2015 }))

// Pure function
validerIsbn('9780306406157')        // { valide: true }
validerIsbn('9780306406156')        // { valide: false, erreur: 'isbnChecksum' }
validerIsbn('0306406152', 2010)     // { valide: false, erreur: 'isbnCoherence' }
```

---

## [0.3.0] — 2026-06-02

### Added

#### `TempsLectureService`

Stateless injectable Angular service for estimating reading time from word count.

**Methods**

| Method | Signature | Description |
|---|---|---|
| `estimer` | `(nombreMots: number \| null, vitesseMots?: number) → number` | Returns estimated time in **seconds**. Default speed: `VITESSE_LECTURE_DEFAUT` (200 wpm). |
| `formater` | `(secondes: number) → string` | Returns `"5 min"` or `"1 h 05 min"`. Values ≤ 0 → `"0 min"`. |

**Exported constant**: `VITESSE_LECTURE_DEFAUT = 200` — adult reading speed approximation (English-sourced), override via `vitesseMots` if needed.

**Auto-normalization**: `null`, `undefined`, `NaN`, `Infinity`, negative → `0`.

```typescript
const s = inject(TempsLectureService);
s.formater(s.estimer(45000));           // "3 h 45 min"
s.formater(s.estimer(45000, 120));      // "6 h 15 min" (slow reader)
```

### Security

- **`FormatContenuService`** — `url.protocol === 'https:'` check added to `_detecterChaine()`. An `http://` or `javascript://` URL on a trusted domain (Google Docs, OneDrive) now falls back to `'texte-brut'` instead of receiving a `bypassSecurityTrustResourceUrl`.

---

## [0.2.0] — 2026-06-02

### Added

#### `MotsPipe` (`| mots`) and `WordsPipe` (`| words`)

Angular pipes for displaying a word count with singular/plural agreement and typographic thousands formatting.

**Built-in languages**: French (`fr`, default), English (`en`), Cree (`cr`).

**Signature**: `{{ value | mots: language : singular : plural : zeroPlural }}`

| Behaviour | Example | Result |
|---|---|---|
| FR plural | `{{ 1234 \| mots }}` | `"1 234 mots"` |
| FR singular | `{{ 1 \| mots }}` | `"1 mot"` |
| FR zero (singular) | `{{ 0 \| mots }}` | `"0 mot"` |
| EN plural | `{{ 1234 \| mots:'en' }}` | `"1,234 words"` |
| EN zero (plural) | `{{ 0 \| mots:'en' }}` | `"0 words"` |
| CR plural | `{{ 1234 \| mots:'cr' }}` | `"1 234 nêhiyaw-pîkiskwêwina"` |
| English alias | `{{ 1234 \| words:'en' }}` | `"1,234 words"` |
| Custom form | `{{ 1234 \| mots:'pt':'palavra':'palavras' }}` | `"1 234 palavras"` |
| Unknown language | `{{ 1234 \| mots:'xx' }}` | fallback `fr` |

Auto-normalization: `null` → `0`, negative → `0`, decimal → `Math.floor`.
Thousands formatting via native `Intl.NumberFormat` — zero dependencies.

Added exports: `MotsPipe`, `WordsPipe`.

### Security

- **`ZoneLectureComponent`** — `bypassSecurityTrustHtml()` removed. HTML content is now automatically sanitized by Angular via `[innerHTML]`. A manuscript contains only formatted text — no reason to bypass sanitization.
- **`ZoneLectureComponent`** — `sandbox="allow-scripts allow-forms allow-popups"` attribute added to the `<iframe>` (Google Docs, OneDrive). Restricts what embedded content can do. `allow-same-origin` intentionally omitted: combining it with `allow-scripts` would allow the embedded document to remove its own sandbox via script.
- **README** — Security section added: safe HTML usage, iframe behaviour, recommended server-side CSP.

---

## [0.1.1] — 2026-05-30

### Improved

**`BarreControlesComponent` — complete controls UI overhaul**

The horizontal toolbar with text labels is replaced by a compact bar with two buttons, each opening a side panel:

- **Main bar**: two buttons only — ⚙ (reading settings) and ℹ (information)
- **⚙ panel**: controls in a 3-column grid with compact inline SVG icons (aria-labels preserved):
  - Night mode, full screen, pagination (toggle buttons)
  - Font size `a ——— A`, line spacing (vertical arrow), column width (horizontal arrow)
  - Brightness (white→black gradient), contrast (◐), sepia (brown circle), zoom (magnifying glass)
  - RGBA overlay (color selector + opacity slider)
  - Pagination navigation (when pagination mode is active)
- **ℹ panel**: title, author, word count, progress and reading time — formerly a separate side panel in `LiseuseManuscritComponent`
- The panel slides in from the left and **shifts the content to the right** (0.25 s transition) — text remains visible and readable; closes on outside click
- Slider numeric values displayed only on focus (`:focus-within` CSS — no JS)
- New `panneauChange` output emitted on each panel open/close (`'controles' | 'infos' | null`)
- i18n keys `page`, `page_sur` removed (counter simplified to `X / Y` without translation)
- `liseuse.controles.parametres` key added for the ⚙ button

**`LiseuseManuscritComponent` — side panel removed**

- Removed the right side panel (`.panneau-lateral`) and floating ℹ button (`.btn-toggle-panneau`) — replaced by `BarreControlesComponent`'s panel system
- Removed responsive two-column layout (768 px+) — the toolbar is now always horizontal at the top
- `panneauInfoVisible` in `ConfigLecture` no longer has any effect (panel state is managed internally by `BarreControlesComponent`)

### Security

**`FormatContenuService` — URL validation vulnerability fix**

Domain detection for Google Docs and OneDrive URLs used `String.includes()`, allowing a domain bypass attack:

```
malicious.docs.google.com.evil.com  → incorrectly accepted as Google Docs URL
docs.google.com.phishing.ru         → same
```

Validation now uses `URL.hostname` (exact domain match). Malicious URLs are rejected — they fall back to `'texte-brut'` or `'inconnu'` without being rendered in an `<iframe>`.

---

## [0.1.0] — 2026-05-28

First release.

#### `LiseuseManuscritComponent` (`ngx-liseuse-manuscrit`)

Angular 21 standalone component for displaying literary manuscripts.

**Supported formats**
- Plain text and HTML (optimized mode — configurable layout)
- PDF via native `<embed>`
- Google Docs and OneDrive URLs via `<iframe>` preview

**Inputs**

| Input | Type | Required | Description |
|---|---|---|---|
| `contenu` | `string \| File \| null` | ✅ | Content to display |
| `titre` | `string \| undefined` | — | Manuscript title (info panel) |
| `auteur` | `string \| undefined` | — | Author name (info panel) |
| `langue` | `string` | — | UI language (`'fr'` \| `'en'` \| `'cr'`) |
| `config` | `Partial<ConfigLecture>` | — | Initial config, merged with defaults |
| `textSelectable` | `boolean` | — | Allow text selection (default `true`) |
| `estimatedReadingTime` | `string \| number \| undefined` | — | Reading time estimate from host app |

**Outputs**

| Output | Type | Description |
|---|---|---|
| `progressionLecture` | `number` | Scroll progress 0–100%, throttled 250 ms (optimized mode) |
| `readingTime` | `number` | Active reading seconds (pauses when tab is hidden) |

**Built-in visual controls**
Night mode, font size (16–24 px), line height (1.4–1.8), column width (45–90 ch),
zoom (0.5×–2.0×, text mode only), brightness, contrast, sepia, RGBA overlay,
pagination, full screen.

**Navigation**
Horizontal swipe (mobile), scroll wheel (pagination mode), arrow keys.

**i18n**: French, English, Cree (`cr`) built-in — no configuration required.
Optional integration with `@ngx-translate/core` via `TRANSLATE_SERVICE_TOKEN`.

**Exported types, constants and tokens**
`FormatContenu`, `ModeAffichage`, `ConfigLecture`, `EtatLecture`, `ErreurLiseuse`,
`CodeErreurLiseuse`, `LangueSupported`, `CONFIG_LECTURE_DEFAUT`, `LANGUES_SUPPORTEES`,
`LANGUE_DEFAUT`, `TRANSLATE_SERVICE_TOKEN`, `TranslateServiceLike`.

---

## [Unreleased]

_No changes in progress._

