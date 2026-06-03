# Data Model — Scaffold Pédagogique Interactif

**Feature**: `001-tuto-interactif` | **Date**: 2026-06-03

---

## Vue d'ensemble

Pas de backend, pas de base de données. Les données sont soit **statiques** (hardcodées dans
les composants), soit **réactives** (signals Angular locaux). Les interfaces ci-dessous décrivent
les structures conceptuelles utilisées dans chaque page de tuto.

---

## InstallationStep

Représente une étape de la checklist d'installation sur la page d'accueil.
Hardcodée dans `accueil.ts`.

```typescript
interface InstallationStep {
  labelKey: string;       // clé i18n — titre de l'étape
  commandeKey?: string;   // clé i18n — commande à exécuter (optionnel)
  commande?: string;      // commande littérale (si pas de traduction nécessaire)
  statut: 'fait' | 'afaire';
  ordre: number;
}
```

**Valeurs statiques dans `accueil.ts`** :

```typescript
readonly etapesFaites: InstallationStep[] = [
  { ordre: 1, statut: 'fait', labelKey: 'accueil.fait.etape1', commande: 'ng new mon-projet --standalone' },
  { ordre: 2, statut: 'fait', labelKey: 'accueil.fait.etape2' },
  { ordre: 3, statut: 'fait', labelKey: 'accueil.fait.etape3' },
];

readonly etapesAfaire: InstallationStep[] = [
  { ordre: 1, statut: 'afaire', labelKey: 'accueil.afaire.etape1', commande: 'git clone <url> -b tuto-depart' },
  { ordre: 2, statut: 'afaire', labelKey: 'accueil.afaire.etape2', commande: 'npm install' },
  { ordre: 3, statut: 'afaire', labelKey: 'accueil.afaire.etape3', commande: 'npm install ngx-parrecrivains' },
  { ordre: 4, statut: 'afaire', labelKey: 'accueil.afaire.etape4', commande: 'ng serve' },
];
```

---

## TestScenario

Représente un bouton de test pré-câblé dans une page de tuto.
Hardcodé dans chaque `tuto-*.ts`.

```typescript
interface TestScenario {
  id: string;
  labelKey: string;   // clé i18n — libellé du bouton
  codeDisplay: string; // code à afficher dans l'encadré (chaîne, pas du code réel)
}
```

**Par page** (valeurs, pas de clé i18n pour les codes — toujours en TypeScript) :

*isbnValidator* :
```typescript
readonly scenarios = [
  { id: 'valide13', labelKey: 'tuto.isbn.test.valide13', codeDisplay: "form.patchValue({ isbn: '9782764633291' })" },
  { id: 'invalide', labelKey: 'tuto.isbn.test.invalide',  codeDisplay: "form.patchValue({ isbn: '12345' })" },
  { id: 'checksum', labelKey: 'tuto.isbn.test.checksum',  codeDisplay: "form.patchValue({ isbn: '9782764633290' })" },
];
```

*MotsPipe* :
```typescript
readonly scenarios = [
  { id: 'court',  labelKey: 'tuto.mots.test.court',  codeDisplay: "nombreMots.set(1)" },
  { id: 'moyen',  labelKey: 'tuto.mots.test.moyen',  codeDisplay: "nombreMots.set(1234)" },
  { id: 'long',   labelKey: 'tuto.mots.test.long',   codeDisplay: "nombreMots.set(45231)" },
  { id: 'zero',   labelKey: 'tuto.mots.test.zero',   codeDisplay: "nombreMots.set(0)" },
];
```

*TempsLectureService* :
```typescript
readonly scenarios = [
  { id: 'court',  labelKey: 'tuto.temps.test.court',  codeDisplay: "nombreMots.set(600)" },
  { id: 'roman',  labelKey: 'tuto.temps.test.roman',  codeDisplay: "nombreMots.set(80000)" },
  { id: 'essai',  labelKey: 'tuto.temps.test.essai',  codeDisplay: "nombreMots.set(15000)" },
];
```

*LiseuseManuscrit* :
```typescript
readonly scenarios = [
  { id: 'texte',  labelKey: 'tuto.liseuse.test.texte',  codeDisplay: "contenu.set('Il était une fois...')" },
  { id: 'html',   labelKey: 'tuto.liseuse.test.html',   codeDisplay: "contenu.set('<h2>Chapitre 1</h2><p>...')" },
  { id: 'gdocs',  labelKey: 'tuto.liseuse.test.gdocs',  codeDisplay: "contenu.set('https://docs.google.com/...')" },
];
```

---

## ProblemeFrequent

Représente une entrée dans la section « Problèmes fréquents » de chaque page de tuto.
Hardcodé dans chaque `tuto-*.html` via clés i18n.

```typescript
interface ProblemeFrequent {
  symptomeKey: string;
  causeKey: string;
  solutionKey: string;
  snippet?: string;  // code littéral (pas de clé i18n — toujours le même)
}
```

**Problèmes communs à toutes les pages** :
1. Import manquant → `imports: []` non mis à jour
2. Mauvaise version Angular → `ngx-parrecrivains` requiert Angular 21+
3. Lib non installée → `npm install ngx-parrecrivains` non exécuté

**Problèmes spécifiques par composant** :

*isbnValidator* :
- Tirets dans l'ISBN → `isbnFormat` (les tirets ne sont pas acceptés)
- X en position incorrecte → `isbnFormat` (X valide seulement en dernière position d'un ISBN-10)
- `isbnCoherence` inattendu → vérifier l'année passée à `isbnValidator({ annee: ... })`

*MotsPipe* :
- Espacement inattendu → espace fine insécable (normal, c'est intentionnel en français)
- `null` dans le template → pipe retourne "0 mot" (comportement normal)

*TempsLectureService* :
- Pas de `inject()` disponible → utiliser dans le constructeur de classe ou via `inject()` en dehors
- `estimer()` retourne des secondes, pas des minutes → utiliser `formater()` pour l'affichage

*LiseuseManuscrit* :
- URL Google Docs → doit être une URL de partage publique (pas un fichier privé)
- Hauteur à 0 → le composant nécessite une hauteur CSS définie sur son conteneur parent

---

## SnippetIntegration

Structure des snippets d'intégration affichés dans chaque page. Hardcodé dans les templates.

```typescript
interface SnippetIntegration {
  import: string;       // ligne(s) d'import TypeScript à ajouter
  importsArray: string; // nom du composant/pipe à ajouter dans imports: []
  usage: string;        // balise HTML ou expression template à ajouter
  elementManquant: string; // description de l'élément spécifique à ajouter
}
```

| Composant | import | importsArray | usage | elementManquant |
|---|---|---|---|---|
| isbnValidator | `import { isbnValidator } from 'ngx-parrecrivains';` | N/A (validator, pas dans imports[]) | `isbnValidator()` dans `new FormControl('', [isbnValidator()])` | `isbnValidator()` dans les validateurs |
| MotsPipe | `import { MotsPipe } from 'ngx-parrecrivains';` | `MotsPipe` | `{{ nombreMots() \| mots }}` | `\| mots` dans l'expression |
| TempsLectureService | `import { inject } from '@angular/core'; import { TempsLectureService } from 'ngx-parrecrivains';` | N/A (service auto-injecté) | `private readonly tl = inject(TempsLectureService);` | `inject(TempsLectureService)` + computed |
| LiseuseManuscrit | `import { LiseuseManuscritComponent } from 'ngx-parrecrivains';` | `LiseuseManuscritComponent` | `<ngx-liseuse-manuscrit [contenu]="contenu()" />` | balise `<ngx-liseuse-manuscrit>` |

---

## État réactif par page de tuto

Signals locaux présents dans chaque composant de tuto dès la branche `tuto-depart` :

| Composant | Signal(s) pré-câblés | Computed pré-câblé |
|---|---|---|
| `TutoIsbnComponent` | `FormControl isbn = new FormControl('', [Validators.required])` | — |
| `TutoMotsComponent` | `nombreMots = signal(1234)` | — |
| `TutoTempsLectureComponent` | `nombreMots = signal(1000)` | `tempsAffiche = signal('??')` → remplacé par computed |
| `TutoLiseuseComponent` | `contenu = signal('Il était une fois...')` | — |
