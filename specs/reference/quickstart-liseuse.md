# Quickstart — LiseuseManuscritComponent

**Bibliothèque** : `ngx-parrecrivains` | **Composant** : `ngx-liseuse-manuscrit`

---

## Prérequis

- Angular 21+
- `npm install ngx-parrecrivains`
- (Optionnel) `@ngx-translate/core ^17` si internationalisation de l'app hôte

---

## Cas 1 — Texte brut minimal

```typescript
import { LiseuseManuscritComponent } from 'ngx-parrecrivains';

@Component({
  selector: 'app-root',
  imports: [LiseuseManuscritComponent],
  template: `<ngx-liseuse-manuscrit [contenu]="texte" />`
})
export class AppComponent {
  texte = 'Il était une fois, dans une bibliothèque sans fin...';
}
```

La liseuse détecte automatiquement le texte brut, applique la mise en page par défaut (18px, 1.6 interligne, 70ch), et est prête.

---

## Cas 2 — Manuscrit HTML avec métadonnées

```typescript
template: `
  <ngx-liseuse-manuscrit
    [contenu]="html"
    [titre]="'L\'archipel des mots'"
    [auteur]="'Camille Tremblay'"
    [langue]="'fr'"
  />
`
```

Le panneau d'informations (accessible via l'icône ℹ dans la barre de contrôles) affiche le titre, l'auteur, le nombre de mots et la progression.

---

## Cas 3 — Configuration initiale personnalisée

```typescript
template: `
  <ngx-liseuse-manuscrit
    [contenu]="texte"
    [config]="{ modeNuit: true, largeurColonneCh: 65, panneauInfoVisible: true }"
  />
`
```

`config` accepte n'importe quelle combinaison de champs `ConfigLecture`. Les valeurs non fournies utilisent `CONFIG_LECTURE_DEFAUT`. Le lecteur peut toujours modifier les réglages dans l'interface.

---

## Cas 4 — Fichier PDF

```typescript
// Dans le composant
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

Le PDF s'affiche nativement via `<embed>`. Les contrôles visuels (mode nuit, filtres CSS) s'appliquent au conteneur.

---

## Cas 5 — URL Google Docs publique

```typescript
template: `
  <ngx-liseuse-manuscrit
    [contenu]="'https://docs.google.com/document/d/ABC123/preview'"
  />
`
```

Le document s'affiche dans un `<iframe>`. Le partage du document doit être configuré sur « Tout le monde peut consulter » dans Google Docs.

> **Note** : Les URLs de partage habituelles (contenant `/edit?usp=sharing`) sont automatiquement transformées en `/preview` par le composant — vous pouvez coller votre lien de partage directement sans modification.

---

## Cas 6 — Suivi de progression avec l'API parrecrivains

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

  mettreAJourProgression(pourcent: number) {
    // ex. : appel API pour persister la progression du lecteur
  }

  enregistrerTemps(secondes: number) {
    // ex. : statistiques de lecture active
  }
}
```

`progressionLecture` est émis à chaque changement de position (throttle 250ms, mode optimisé uniquement).
`readingTime` est émis chaque seconde — la mesure s'arrête automatiquement si l'onglet est caché ou si la liseuse sort du viewport.

---

## Gestion d'erreur

Aucune configuration requise — les erreurs s'affichent automatiquement dans la langue de l'input `langue` :

| Situation | Message affiché |
|---|---|
| `contenu` null ou vide | « Aucun manuscrit à afficher » |
| Format non reconnu (.xlsx, .zip…) | « Format non supporté » |
| URL privée inaccessible | « Document privé — accès non autorisé » |
| Langue non supportée | Fallback fr silencieux (pas d'erreur visible) |

---

## Protection de la sélection de texte

```typescript
template: `<ngx-liseuse-manuscrit [contenu]="texte" [textSelectable]="false" />`
```

> **Limite documentée** : `textSelectable: false` désactive `user-select` et le menu contextuel côté client. Un utilisateur motivé peut récupérer le texte via les DevTools. Cette option est une friction, pas une protection absolue. La vraie protection du texte est serveur (envoi partiel, watermarking).

---

## i18n avec ngx-translate (optionnel)

Si l'app hôte utilise `@ngx-translate/core`, la liseuse utilise automatiquement le `TranslateService` disponible. Les clés de la liseuse sont préfixées `liseuse.*`.

Les fichiers de traduction de la lib sont disponibles dans `dist/ngx-parrecrivains/assets/i18n/liseuse/` — à fusionner dans la configuration du loader de l'app hôte si souhaité.

Sans ngx-translate : les messages s'affichent dans la langue de l'input `langue` via le fallback interne.