# Research — Scaffold Pédagogique Interactif

**Feature**: `001-tuto-interactif` | **Date**: 2026-06-03

---

## Décision 1 — Stratégie i18n

**Decision**: Service léger maison (`LangueService`) avec signals Angular + HttpClient.

**Rationale**:
- Projet de taille limitée (5 pages, 2 langues) — une lib externe (ngx-translate) est surdimensionnée
- Angular 21 fournit `HttpClient` nativement via `provideHttpClient()` → aucune dépendance ajoutée
- Un signal `langue` dans le service + `HttpClient.get<Record<string,string>>('assets/i18n/fr.json')`
  suffit pour un changement de langue immédiat sans rechargement (FR-017)
- La lib `ngx-parrecrivains` utilise `TRANSLATE_SERVICE_TOKEN` — le site de tuto n'a pas besoin
  de s'y brancher (la lib n'est pas installée dans `tuto-depart`)

**Alternatives considérées**:
- `@ngx-translate/core` : mature mais ajoute une dépendance npm, surcharge pour ce scope
- Angular i18n natif : requiert un build par langue → incompatible avec FR-017 (switch sans rechargement)

**Implémentation** :
```typescript
// langue.service.ts
@Injectable({ providedIn: 'root' })
export class LangueService {
  private readonly http = inject(HttpClient);
  readonly langue = signal<'fr' | 'en'>('fr');
  private readonly traductions = signal<Record<string, string>>({});

  charger(langue: 'fr' | 'en') {
    this.http.get<Record<string, string>>(`assets/i18n/${langue}.json`)
      .subscribe(t => { this.traductions.set(t); this.langue.set(langue); });
  }

  t(cle: string): string {
    return this.traductions()[cle] ?? cle;
  }
}
```

---

## Décision 2 — Code des pages de tuto sans ngx-parrecrivains

**Decision**: Les pages de tuto contiennent ZÉRO import de `ngx-parrecrivains` dans leur
code TypeScript. Les snippets d'intégration affichés à l'utilisateur sont des chaînes de
caractères rendues par `<app-snippet>`.

**Rationale**:
- `ngx-parrecrivains` n'est pas dans `package.json` de `tuto-depart` → TypeScript refuserait
  de compiler si un import pointait vers ce module
- L'approche "snippets en chaînes" permet au site de fonctionner complètement avant l'install
  de la lib, tout en montrant exactement le code à copier-coller
- Cohérent avec le Edge Case de la spec : "L'emplacement reste vide mais aucune erreur cassante"

**Conséquence pour le slot** :
- Le slot visuel (`<app-slot>`) est un `<div>` avec style pointillé + texte placeholder
- Pour `LiseuseManuscrit` : le slot contient `<ng-content>` vide → l'utilisateur ajoute
  la balise dans le template de la page ; le slot sert juste de conteneur visuel
- Pour `MotsPipe` : l'expression `{{ nombreMots() }}` est déjà dans le template ; l'utilisateur
  ajoute `| mots` → le résultat change de "1234" à "1 234 mots"

---

## Décision 3 — Boutons de test sans la lib

**Decision**: Les boutons de test manipulent uniquement des signals Angular locaux. Aucun appel
à `ngx-parrecrivains`. Ils fonctionnent avant et après l'installation de la lib.

**Comportement par page** :

| Page | Ce que fait le bouton | Résultat sans lib | Résultat avec lib |
|---|---|---|---|
| isbnValidator | `form.patchValue({ isbn: '9782764633291' })` | Formulaire sans validation ISBN | Erreurs ISBN affichées |
| MotsPipe | `nombreMots.set(45231)` | "45231" brut dans le template | "45 231 mots" formaté |
| TempsLecture | `nombreMots.set(45000)` | Signal `tempsAffiche` reste à "??" | "3 h 45 min" calculé |
| Liseuse | `contenu.set('Nouveau texte...')` | Slot vide (signal mis à jour) | Liseuse rafraîchit son contenu |

---

## Décision 4 — Lazy loading des routes

**Decision**: Toutes les routes de tuto sont lazy-loaded via `loadComponent`.

**Rationale**:
- Bonne pratique Angular (conventions `.claude/CLAUDE.md`)
- Réduit le bundle initial (accueil seule au démarrage)
- Chaque page de tuto est indépendante (SC-002)

```typescript
export const routes: Routes = [
  { path: '', loadComponent: () => import('./accueil/accueil').then(m => m.AccueilComponent) },
  { path: 'tutos/isbn', loadComponent: () => import('./tutos/isbn/tuto-isbn').then(m => m.TutoIsbnComponent) },
  // ...
];
```

---

## Décision 5 — Composants partagés

**Decision**: Trois composants partagés (`<app-snippet>`, `<app-slot>`, nav) extraits en
`shared/`. Pas d'extraction prématurée au-delà.

- `<app-snippet code="...">` : affiche un bloc de code avec bouton "Copier"
- `<app-slot>` : zone visuelle pointillée avec message placeholder et `<ng-content>`
- `<app-nav>` : barre de navigation + sélecteur de langue

**Alternatives rejetées**:
- Composant `<app-bouton-test>` générique : trop variable entre pages → chaque page gère
  ses propres boutons directement (logique différente pour chaque composant de la lib)
- Composant `<app-probleme-frequent>` : liste simple → markup direct dans chaque page
