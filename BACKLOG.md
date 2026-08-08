# Backlog — ngx-parrecrivains

Tâches futures pour la lib et l'app test/tutoriel.

---

## App tutoriel — mise aux normes des conventions Angular

Le code Angular du site tutoriel (`src/src/`) ne respectait pas les conventions de parrecrivains
au moment du transfert. Vérifié par grep sur `src/src/app` — la plupart des points sont réglés :

- [x] `inject()` partout — aucune injection par constructeur restante (seuls des `constructor()` sans paramètre subsistent, ex. lifecycle hook dans `LangueService`)
- [x] `input()`, `output()` — aucun `@Input()` / `@Output()` restant
- [x] `@if`, `@for`, `@switch` — aucun `*ngIf` / `*ngFor` / `*ngSwitch` restant
- [x] Templates inline — aucun dans `tests/` ni `demos/`. Les 3 restants (`app.ts`, `shared/snippet`, `shared/slot`) sont des petits composants partagés, conformes à la convention `src/.claude/CLAUDE.md` ("Prefer inline templates for small components")
- [x] Pas de `ngClass` / `ngStyle` — aucune occurrence restante
- [x] Pas de `standalone: true` explicite — aucune occurrence restante
- [x] `private readonly` sur les services injectés — respecté, à l'exception assumée des signaux de service exposés directement aux templates (ex. `readonly langue = inject(LangueService)`), volontairement non `private` car lus depuis le HTML
- [ ] `signal()`, `computed()` — pas d'audit systématique de la duplication d'état, à revérifier
- [ ] Nommage en français — pas d'audit systématique, à revérifier

---

## Pages de test — corrections post-transfert

Copiées depuis `parrecrivains` dans `src/src/app/tests/`. Fonctionnent avec `ng serve` (path alias).
À corriger avant que les pages de test soient considérées comme "propres" :

- [ ] Supprimer les commentaires "FICHIER TEMPORAIRE — SUPPRIMER AVANT PUBLICATION" (présents dans `tests/liseuse`, `tests/pipe-mots`, `tests/isbn`, `tests/temps-lecture` — `.ts`, `.html`, `.scss`) — ces pages sont permanentes dans ce repo
- [ ] Supprimer les bannières rouges "⚠ PAGE DE TEST… À supprimer avant publication" dans les HTML (mêmes 4 dossiers) — même raison
- [ ] `TEST-temps-lecture.ts:15` : `new TempsLectureService()` bypass Angular DI — remplacer par `inject(TempsLectureService)` (le service est déjà `providedIn: 'root'`)
- [ ] Ajouter les pages de test incomplètes manquantes (cas d'utilisation supplémentaires — voir BACKLOG parrecrivains)
- [ ] Ajouter un lien vers les pages de test depuis la nav de l'app (visible seulement en mode dev ? ou toujours visible ?)

---

## UX — Pied de page contact anti-spam

Ajouter un pied de page invitant les visiteurs à contacter Maive pour des commentaires ou problèmes.
Le courriel doit être protégé contre les bots (pas d'adresse en clair dans le HTML).

Options techniques :
- Encodage CSS (`content:` via `::before` / `::after`)
- Formulaire de contact (sans exposer le courriel)
- Adresse obfusquée en JS (dernier recours)
