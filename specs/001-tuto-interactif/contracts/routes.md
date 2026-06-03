# Contrat de Routing — Scaffold Pédagogique Interactif

**Feature**: `001-tuto-interactif` | **Date**: 2026-06-03

---

## Routes

| URL | Composant | Fichier | Description |
|---|---|---|---|
| `/` | `AccueilComponent` | `app/accueil/accueil.ts` | Page d'installation guidée |
| `/tutos/isbn` | `TutoIsbnComponent` | `app/tutos/isbn/tuto-isbn.ts` | Tutoriel isbnValidator |
| `/tutos/mots` | `TutoMotsComponent` | `app/tutos/mots/tuto-mots.ts` | Tutoriel MotsPipe / WordsPipe |
| `/tutos/temps-lecture` | `TutoTempsLectureComponent` | `app/tutos/temps-lecture/tuto-temps-lecture.ts` | Tutoriel TempsLectureService |
| `/tutos/liseuse` | `TutoLiseuseComponent` | `app/tutos/liseuse/tuto-liseuse.ts` | Tutoriel LiseuseManuscritComponent |
| `**` | redirect → `/` | — | Toute URL inconnue → accueil |

---

## Configuration `app.routes.ts`

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./accueil/accueil').then(m => m.AccueilComponent)
  },
  {
    path: 'tutos/isbn',
    loadComponent: () => import('./tutos/isbn/tuto-isbn').then(m => m.TutoIsbnComponent)
  },
  {
    path: 'tutos/mots',
    loadComponent: () => import('./tutos/mots/tuto-mots').then(m => m.TutoMotsComponent)
  },
  {
    path: 'tutos/temps-lecture',
    loadComponent: () =>
      import('./tutos/temps-lecture/tuto-temps-lecture').then(m => m.TutoTempsLectureComponent)
  },
  {
    path: 'tutos/liseuse',
    loadComponent: () => import('./tutos/liseuse/tuto-liseuse').then(m => m.TutoLiseuseComponent)
  },
  { path: '**', redirectTo: '' }
];
```

---

## Navigation (liens dans `<app-nav>`)

```html
<a routerLink="/">Accueil / Home</a>
<a routerLink="/tutos/isbn">isbnValidator</a>
<a routerLink="/tutos/mots">MotsPipe</a>
<a routerLink="/tutos/temps-lecture">TempsLectureService</a>
<a routerLink="/tutos/liseuse">LiseuseManuscrit</a>
```

---

## Notes

- Toutes les routes sont lazy-loaded (`loadComponent`) pour réduire le bundle initial
- La route `**` redirige vers l'accueil (GitHub Pages ne gère pas le routing côté serveur
  — le 404 doit être géré côté build via `404.html` si nécessaire)
- `RouterLink` et `RouterLinkActive` sont importés dans `NavComponent`
