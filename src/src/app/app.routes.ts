import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./accueil/accueil').then((m) => m.AccueilComponent),
  },
  {
    path: 'tutos/isbn',
    loadComponent: () =>
      import('./tutos/isbn/tuto-isbn').then((m) => m.TutoIsbnComponent),
  },
  {
    path: 'tutos/mots',
    loadComponent: () =>
      import('./tutos/mots/tuto-mots').then((m) => m.TutoMotsComponent),
  },
  {
    path: 'tutos/temps-lecture',
    loadComponent: () =>
      import('./tutos/temps-lecture/tuto-temps-lecture').then(
        (m) => m.TutoTempsLectureComponent,
      ),
  },
  {
    path: 'tutos/liseuse',
    loadComponent: () =>
      import('./tutos/liseuse/tuto-liseuse').then(
        (m) => m.TutoLiseuseComponent,
      ),
  },
  // ── Pages de test (lib locale — ng serve uniquement) ──────────────────────
  {
    path: 'tests',
    loadComponent: () =>
      import('./tests/menu/TEST-menu').then((m) => m.TESTMenuComponent),
  },
  {
    path: 'tests/isbn',
    title: 'isbnValidator / validerIsbn',
    loadComponent: () =>
      import('./tests/isbn/TEST-isbn').then((m) => m.TESTIsbnComponent),
  },
  {
    path: 'tests/liseuse',
    title: 'LiseuseManuscritComponent',
    loadComponent: () =>
      import('./tests/liseuse/TEST-liseuse').then((m) => m.TESTLiseuseComponent),
  },
  {
    path: 'tests/pipe-mots',
    title: 'MotsPipe / WordsPipe',
    loadComponent: () =>
      import('./tests/pipe-mots/TEST-pipe-mots').then((m) => m.TESTpipeMotsComponent),
  },
  {
    path: 'tests/temps-lecture',
    title: 'TempsLectureService',
    loadComponent: () =>
      import('./tests/temps-lecture/TEST-temps-lecture').then((m) => m.TESTTempsLectureComponent),
  },
  { path: '**', redirectTo: '' },
];
