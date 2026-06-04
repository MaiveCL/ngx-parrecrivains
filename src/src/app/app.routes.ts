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
  { path: '**', redirectTo: '' },
];
