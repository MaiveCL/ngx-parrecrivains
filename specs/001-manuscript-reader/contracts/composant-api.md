# Contrat d'API — LiseuseManuscritComponent

**Sélecteur** : `ngx-liseuse-manuscrit`
**Exporté via** : `public-api.ts` de `ngx-parrecrivains`
**Fichier** : `src/frontend/projects/ngx-parrecrivains/src/lib/liseuse-manuscrit/liseuse-manuscrit.ts`

---

## Installation minimale (SC-007)

```bash
npm install ngx-parrecrivains
```

```typescript
// app.component.ts
import { LiseuseManuscritComponent } from 'ngx-parrecrivains';

@Component({
  imports: [LiseuseManuscritComponent],
  template: `<ngx-liseuse-manuscrit [contenu]="texteManuscrit" />`
})
```

Aucune configuration NgModule, aucun provider global requis. Fonctionne dans un projet Angular vierge.

---

## Inputs

| Input | Type | Défaut | Requis | Description |
|---|---|---|---|---|
| `contenu` | `string \| File \| null` | — | Oui | Contenu du manuscrit. String HTML, texte brut, URL Google Docs/OneDrive, ou objet File (.pdf, .docx, .odt, .rtf, .epub) |
| `titre` | `string \| undefined` | `undefined` | Non | Titre affiché dans le panneau d'informations |
| `auteur` | `string \| undefined` | `undefined` | Non | Auteur affiché dans le panneau d'informations |
| `langue` | `string` | `'fr'` | Non | Code ISO 639-1. Supporte `fr`, `en`, `cr`. Fallback `fr` pour toute autre valeur. |
| `textSelectable` | `boolean` | `true` | Non | Si `false` : `user-select: none` + clic droit désactivé. Protection côté client uniquement — non absolue. |
| `estimatedReadingTime` | `string \| number \| undefined` | `undefined` | Non | Temps de lecture estimé calculé en amont par `ReadingTimeService` v0.3.0. Affiché tel quel — aucun calcul interne. |
| `config` | `Partial<ConfigLecture>` | `{}` | Non | Surcharge partielle des valeurs par défaut de `ConfigLecture`. Les clés non fournies utilisent `CONFIG_LECTURE_DEFAUT`. |

### Signature TypeScript (Angular 21 signals)

```typescript
contenu = input.required<string | File | null>();
titre = input<string | undefined>(undefined);
auteur = input<string | undefined>(undefined);
langue = input<string>('fr');
textSelectable = input<boolean>(true);
estimatedReadingTime = input<string | number | undefined>(undefined);
config = input<Partial<ConfigLecture>>({});
```

### Fusion de config interne

```typescript
// Dans le composant — computed signal
readonly configEffective = computed<ConfigLecture>(() => ({
  ...CONFIG_LECTURE_DEFAUT,
  ...this.config(),
}));
```

Les valeurs saisies par l'utilisateur dans l'interface (taille de police, mode nuit, etc.) s'appliquent sur `configEffective` — elles ont priorité sur `config()` après initialisation.

---

## Outputs

| Output | Type | Conditions d'émission |
|---|---|---|
| `progressionLecture` | `OutputEmitterRef<number>` | À chaque changement de position (throttle 250ms). Valeur : 0–100. Mode optimisé uniquement. |
| `readingTime` | `OutputEmitterRef<number>` | Toutes les secondes en lecture active. Valeur : secondes cumulées. Pause si onglet caché ou composant hors viewport. |

### Signature TypeScript

```typescript
progressionLecture = output<number>();
readingTime = output<number>();
```

### Exemple complet

```typescript
@Component({
  imports: [LiseuseManuscritComponent],
  template: `
    <ngx-liseuse-manuscrit
      [contenu]="texte"
      [titre]="'Mon manuscrit'"
      [auteur]="'Marie Dupont'"
      [langue]="'fr'"
      [estimatedReadingTime]="'45 min'"
      [config]="{ largeurColonneCh: 65, modeNuit: true, panneauInfoVisible: true }"
      (progressionLecture)="sauvegarderProgression($event)"
      (readingTime)="enregistrerTemps($event)"
    />
  `
})
export class AppComponent {
  texte = signal<string>('...');

  sauvegarderProgression(pourcent: number) { /* persister via API */ }
  enregistrerTemps(secondes: number) { /* statistiques */ }
}
```

---

## Types exportés publiquement

```typescript
// Depuis 'ngx-parrecrivains'
export type {
  FormatContenu,
  ModeAffichage,
  ConfigLecture,
  EtatLecture,
  ErreurLiseuse,
  CodeErreurLiseuse,
  LangueSupported,
};
export { CONFIG_LECTURE_DEFAUT, LANGUES_SUPPORTEES, LANGUE_DEFAUT };
export { LiseuseManuscritComponent };
```

---

## Contrôles internes (interface utilisateur — non configurables via input séparé)

Accessibles via `config` pour les valeurs initiales, puis modifiables par le lecteur dans l'interface :

| Contrôle | Champ `ConfigLecture` | Mode | Bornes |
|---|---|---|---|
| Largeur de colonne | `largeurColonneCh` | Optimisé | 45–90 ch, défaut 70 |
| Taille de police | `taillePolicePx` | Optimisé | 16–24 px, défaut 18 |
| Interligne | `interligne` | Optimisé | 1.4–1.8, défaut 1.6 |
| Mode nuit | `modeNuit` | Les deux | boolean, défaut false |
| Luminosité | `brightness` | Les deux | 0–200, défaut 100 |
| Contraste | `contrast` | Les deux | 0–200, défaut 100 |
| Sépia | `sepia` | Les deux | 0–100, défaut 0 |
| Superposition opacité | `superpositionOpacite` | Les deux | 0–1, défaut 0 |
| Superposition couleur | `superpositionCouleur` | Les deux | `'noir'` \| `'blanc'` |
| Zoom | `niveauZoom` | Les deux | 0.5–2.0, défaut 1.0 |
| Mode pagination | `modePagination` | Optimisé | boolean, défaut false |
| Plein écran | `pleinEcran` | Les deux | boolean, défaut false |
| Panneau d'infos | `panneauInfoVisible` | Les deux | boolean, défaut false |

---

## Comportement par format d'entrée

| Format détecté | Mode | Rendu | Contrôles visuels |
|---|---|---|---|
| Texte brut (`string`) | Optimisé | Div avec CSS typographique | Tous actifs |
| HTML (`string` avec balises) | Optimisé | `innerHTML` sanitisé | Tous actifs |
| `.pdf` (`File`) | Natif | `<embed type="application/pdf">` | Limités (nuit, filtres, plein écran) |
| `.docx/.odt/.rtf/.epub` (`File`) | Natif | `<iframe>` blob URL | Limités |
| URL Google Docs publique | Natif | `<iframe>` | Limités |
| URL OneDrive publique | Natif | `<iframe>` | Limités |
| `null` ou vide | — | Message `CONTENU_VIDE` | Aucun |
| Format inconnu | — | Message `FORMAT_NON_SUPPORTE` | Aucun |

---

## Navigation

| Appareil | Geste | Comportement |
|---|---|---|
| Mobile (<768px) | Swipe horizontal | Changement de page (mode pagination) |
| Ordinateur | Roulette souris | Scroll (mode défilement) ou changement de page (mode pagination) |
| Ordinateur | Flèches de navigation (UI) | Changement de page en mode pagination |
| Tous | Clic-glisser | Non utilisé pour pagination (préserve la sélection de texte) |

---

## Contraintes connues

- `textSelectable: false` est une protection côté client — non absolue.
- En mode natif (iframe), les filtres CSS et la superposition s'appliquent au conteneur, pas au contenu embarqué.
- `progressionLecture` n'est pas émis en mode natif (accès cross-origin impossible).
- L'accès aux documents Google Docs/OneDrive privés est hors périmètre V1 — affiche `ACCES_PRIVE`.
