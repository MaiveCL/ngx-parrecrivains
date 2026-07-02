# Backlog — ngx-parrecrivains

Tâches futures pour la lib et l'app test/tutoriel.

---

## Constitution SpecKit — fusion et restructuration

La constitution actuelle (`.specify/memory/constitution.md`) couvrait uniquement le site de démo.
Maintenant que le repo contient aussi la lib source, la constitution doit être restructurée en 3 sections :

- **Global** — principes communs aux deux projets (langue du code, gouvernance, SpecKit)
- **Lib** — conventions de la lib Angular (migrer depuis parrecrivains : conventions Angular 21, flux SpecKit, public-api.ts, etc.)
- **Tutoriel/démo** — principes du site de démo (démo vivante, frontend pur, copy-paste, simulation de données, i18n)

À faire en même temps que l'amendement majeur de la constitution (incrémenter version MAJOR).

---

## App tutoriel — mise aux normes des conventions Angular

Le code Angular du site tutoriel (`src/src/`) ne respectait pas les conventions de parrecrivains.
À corriger pour que le code exemple soit irréprochable (les visiteurs s'en inspirent).

Conventions à appliquer (cf. `src/.claude/CLAUDE.md` après mise à jour) :

- [ ] `inject()` partout — supprimer toute injection par constructeur
- [ ] `input()`, `output()` — supprimer tous les décorateurs `@Input()`, `@Output()`
- [ ] `@if`, `@for`, `@switch` — supprimer `*ngIf`, `*ngFor`, `*ngSwitch`
- [ ] Fichiers séparés `.ts` + `.html` + `.scss` — supprimer les templates inline
- [ ] `signal()`, `computed()` — supprimer la duplication d'état
- [ ] Pas de `ngClass`, `ngStyle` — utiliser les bindings `[class]`, `[style]`
- [ ] Nommage en français pour tout ce qui est créé dans ce repo
- [ ] Pas de `standalone: true` explicite (défaut v20+)
- [ ] `private readonly` sur tous les services injectés

---

## Pages de test — corrections post-transfert

Copiées depuis `parrecrivains` dans `src/src/app/tests/`. Fonctionnent avec `ng serve` (path alias).
À corriger avant que les pages de test soient considérées comme "propres" :

- [ ] Supprimer les commentaires "FICHIER TEMPORAIRE — SUPPRIMER AVANT PUBLICATION" — ces pages sont permanentes dans ce repo
- [ ] Supprimer les bannières rouges "⚠ PAGE DE TEST… À supprimer avant publication" dans les HTML — même raison
- [ ] `TEST-temps-lecture.ts` : `new TempsLectureService()` bypass Angular DI — remplacer par `inject(TempsLectureService)` (vérifier d'abord si le service a `providedIn: 'root'`)
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
