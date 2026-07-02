# Modèle de données — Liseuse de manuscrit

**Feature** : `001-manuscript-reader` | **Date** : 2026-05-28

Fichier source : `src/frontend/projects/ngx-parrecrivains/src/lib/types/liseuse.types.ts`

---

## Entités

### `FormatContenu`

Enum discriminant le type d'entrée reçu par la liseuse.

```typescript
type FormatContenu =
  | 'texte-brut'       // string sans balises HTML
  | 'html'             // string contenant des balises HTML
  | 'pdf'              // File (MIME: application/pdf) ou URL .pdf
  | 'docx'             // File .docx
  | 'odt'              // File .odt
  | 'rtf'              // File .rtf
  | 'epub'             // File .epub
  | 'url-google-docs'  // string URL docs.google.com
  | 'url-onedrive'     // string URL onedrive.live.com ou 1drv.ms
  | 'inconnu';         // format non reconnu → afficher ErreurLiseuse
```

### `ModeAffichage`

Déduit automatiquement de `FormatContenu`. Pas exposé en input.

```typescript
type ModeAffichage = 'optimise' | 'natif';
```

- **optimisé** : `texte-brut`, `html` — mise en page configurable, pagination, tous les contrôles actifs
- **natif** : `pdf`, `docx`, `odt`, `rtf`, `epub`, `url-google-docs`, `url-onedrive` — rendu tel quel, contrôles visuels limités (mode nuit, filtres, plein écran)

### `ConfigLecture`

Préférences visuelles du lecteur. Gérées localement par `ConfigLectureService`. Ne sont pas persistées par la liseuse.

```typescript
interface ConfigLecture {
  taillePolicePx: number;        // min 16, max 24, défaut 18 — mode optimisé uniquement
  interligne: number;            // min 1.4, max 1.8, défaut 1.6 — mode optimisé uniquement
  largeurColonneCh: number;      // min 45, max 90, défaut 70 — mode optimisé uniquement
  modeNuit: boolean;             // défaut false — disponible dans les deux modes
  brightness: number;            // 0-200, défaut 100 — disponible dans les deux modes
  contrast: number;              // 0-200, défaut 100 — disponible dans les deux modes
  sepia: number;                 // 0-100, défaut 0 — disponible dans les deux modes
  superpositionOpacite: number;  // 0-1, défaut 0 — disponible dans les deux modes
  superpositionCouleur: 'noir' | 'blanc';  // défaut 'noir'
  niveauZoom: number;            // 0.5-2.0, défaut 1.0 — disponible dans les deux modes
  modePagination: boolean;       // false = défilement, true = pagination — mode optimisé uniquement
  pleinEcran: boolean;           // défaut false — disponible dans les deux modes
  panneauInfoVisible: boolean;   // défaut false — disponible dans les deux modes
}
```

**Valeurs par défaut** exportées comme constante :

```typescript
const CONFIG_LECTURE_DEFAUT: ConfigLecture = {
  taillePolicePx: 18,
  interligne: 1.6,
  largeurColonneCh: 70,
  modeNuit: false,
  brightness: 100,
  contrast: 100,
  sepia: 0,
  superpositionOpacite: 0,
  superpositionCouleur: 'noir',
  niveauZoom: 1.0,
  modePagination: false,
  pleinEcran: false,
  panneauInfoVisible: false,
};
```

### `EtatLecture`

État interne de progression. Calculé par le composant, émis vers l'app hôte via outputs.

```typescript
interface EtatLecture {
  progressionPourcent: number;   // 0-100, calculé en mode optimisé
  pageActuelle: number;          // 1-based, en mode pagination
  totalPages: number;            // calculé sur scrollHeight / clientHeight
  totalMots: number;             // calculé sur le contenu texte brut
  tempsLectureActif: number;     // secondes, mesuré par ChronometereLectureService
}
```

### `ErreurLiseuse`

Représente une erreur d'affichage. Affichée à la place du contenu.

```typescript
interface ErreurLiseuse {
  code: CodeErreurLiseuse;
  messageI18nKey: string;        // clé i18n pour le message affiché
}

type CodeErreurLiseuse =
  | 'FORMAT_NON_SUPPORTE'        // FR-001, FR-005 — format non reconnu ou non rendu
  | 'CONTENU_VIDE'               // FR-002 — null, chaîne vide, fichier 0 octet
  | 'ACCES_PRIVE'                // FR-003 — URL privée sans accès (V1 : détection par erreur de chargement iframe)
  | 'LANGUE_NON_SUPPORTEE';      // FR-004 — langue non connue → fallback fr, pas d'erreur visible
```

> Note : `LANGUE_NON_SUPPORTEE` ne produit pas d'`ErreurLiseuse` visible — la liseuse bascule silencieusement en français.

### `LangueSupported`

```typescript
type LangueSupported = 'fr' | 'en' | 'cr';

const LANGUES_SUPPORTEES: LangueSupported[] = ['fr', 'en', 'cr'];
const LANGUE_DEFAUT: LangueSupported = 'fr';
```

---

## Transitions d'état

```
contenu fourni
  → FormatContenuService.detecter(contenu)
      → FormatContenu
          → ModeAffichage
              → ['optimise'] → ZoneLectureOptimiseeComponent
                  → comptage mots
                  → calcul pages
                  → scroll/swipe → EtatLecture.progressionPourcent
                  → ChronomètreLectureService → EtatLecture.tempsLectureActif
              → ['natif'] → ZoneLectureNativeComponent
                  → <embed> (pdf) ou <iframe> (autres/URLs)
          → ['inconnu'] → ErreurLiseuse(FORMAT_NON_SUPPORTE)
  → si null/vide → ErreurLiseuse(CONTENU_VIDE)
```

---

## Règles de validation

| Champ | Règle | Comportement si violation |
|---|---|---|
| `taillePolicePx` | 16 ≤ n ≤ 24 | Clampé aux bornes, pas d'erreur |
| `interligne` | 1.4 ≤ n ≤ 1.8 | Clampé aux bornes |
| `largeurColonneCh` | 45 ≤ n ≤ 90 | Clampé aux bornes |
| `niveauZoom` | 0.5 ≤ n ≤ 2.0 | Clampé aux bornes |
| `brightness`/`contrast` | 0 ≤ n ≤ 200 | Clampé aux bornes |
| `sepia` | 0 ≤ n ≤ 100 | Clampé aux bornes |
| `superpositionOpacite` | 0 ≤ n ≤ 1 | Clampé aux bornes |
| `langue` (input) | ISO 639-1 | Fallback `fr` si non dans `LANGUES_SUPPORTEES` |
| `estimatedReadingTime` | string ou number | Affiché tel quel si présent; ignoré si absent |