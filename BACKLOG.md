# Backlog — ngx-parrecrivains

Tâches futures pour la lib et l'app test/tutoriel.

---

## 🔒 Protéger `tuto-depart` contre l'écrasement — À FAIRE

**Objectif exact** : empêcher qu'on **écrase** la branche avec une autre branche.
**Pas** empêcher de travailler dessus, **pas** empêcher un étudiant de commiter sur son propre clone.

Un clone d'étudiant ne peut rien atteindre ici : ses commits restent chez lui, seule une pull request
mergée par Maive touche ce dépôt. Rien à protéger de ce côté.

### Étape 1 — GitHub, côté serveur (bloque l'écrasement, laisse le travail passer)

1. github.com/MaiveCL/ngx-parrecrivains → **Settings** → **Branches**
2. **Add branch ruleset**
3. Nom : `protection tuto-depart` · Target branches → **Include by pattern** → `tuto-depart`
4. Cocher **uniquement** :
   - [x] **Block force pushes** — empêche d'écraser l'historique avec une autre branche
   - [x] **Restrict deletions** — empêche la suppression de la branche
5. Ne **pas** cocher : *Lock branch* (rendrait la branche lecture seule), *Restrict updates*
   (bloquerait les commits normaux), *Require a pull request* (bloquerait les pushes directs)
6. Enforcement status → **Active** → Create

Tient depuis n'importe quelle machine et n'importe quel clone, contrairement à un hook.

### Étape 2 — Hook git local (bloque le merge accidentel)

C'est le scénario réaliste : un `git merge main` lancé par distraction alors qu'on est sur
`tuto-depart`. GitHub ne peut pas le distinguer d'un commit normal — seul un hook le voit.

Écrire `.git/hooks/pre-merge-commit`, exécutable, qui refuse tout merge quand la branche courante
est `tuto-depart`, avec un message rappelant pourquoi (voir `CLAUDE.md` § tuto-depart).

⚠️ Un hook **ne survit pas à un `git clone`** — à reposer sur chaque machine de travail. C'est
acceptable : le risque est sur la machine de Maive, pas chez les étudiants. Noter la procédure de
repose dans `cmd.md` si elle devient récurrente.

### Étape 3 — Vérifier que ça marche

Sur une copie jetable du repo : se placer sur `tuto-depart`, tenter `git merge main` → doit être
refusé. Tenter un commit normal + push → doit passer.

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

- [x] Supprimer les commentaires "FICHIER TEMPORAIRE — SUPPRIMER AVANT PUBLICATION" — ces pages sont permanentes dans ce repo
- [x] Supprimer les bannières rouges "⚠ PAGE DE TEST… À supprimer avant publication" dans les HTML
- [x] `TEST-temps-lecture.ts` : `new TempsLectureService()` remplacé par `inject(TempsLectureService)`
- [x] Lien vers les pages de test dans la nav — toujours visible, en fin de nav, séparé des tutoriels (clé i18n `nav.tests`)
- [ ] Ajouter les pages de test incomplètes manquantes (cas d'utilisation supplémentaires — voir BACKLOG parrecrivains)

---

## UX — Pied de page contact anti-spam

Ajouter un pied de page invitant les visiteurs à contacter Maive pour des commentaires ou problèmes.
Le courriel doit être protégé contre les bots (pas d'adresse en clair dans le HTML).

Options techniques :
- Encodage CSS (`content:` via `::before` / `::after`)
- Formulaire de contact (sans exposer le courriel)
- Adresse obfusquée en JS (dernier recours)
