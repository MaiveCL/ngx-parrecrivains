# ngx-parrecrivains

[Français](#français) · [English](#english)

---

## Français

**Librairie Angular pour le milieu littéraire** — lecteur de manuscrit, pipes de comptage de mots,
estimation du temps de lecture, validateur ISBN (fr/en/cr), i18n et support PDF/Google Docs —
**et son site de démonstration / tutoriel interactif**.

📦 **Sur npm** : [`ngx-parrecrivains`](https://www.npmjs.com/package/ngx-parrecrivains)
🌐 **Site en ligne** : [https://maivecl.github.io/ngx-parrecrivains/](https://maivecl.github.io/ngx-parrecrivains/)

### Ce que contient ce repo

Ce repo contient **à la fois la source de la librairie et son site de démo/tutoriel** — ce n'est
plus seulement un site de démo pointant vers une librairie hébergée ailleurs. La librairie a été
migrée ici depuis le monorepo `parrecrivains` (branche `transfertLib`, fusionnée dans `main`).

```
ngx-parrecrivains/
├── docs/                          ← build statique servi par GitHub Pages
├── specs/                         ← specs SpecKit (lib + app)
└── src/                           ← workspace Angular CLI
    ├── angular.json               ← 2 projets : lib + app
    ├── tsconfig.json              ← path alias vers la lib locale (dev/test)
    ├── tsconfig.demo.json         ← sans path alias, résout depuis npm (déploiement)
    ├── projects/ngx-parrecrivains/← source de la lib, publiée sur npm
    └── src/app/                   ← app de démo/tutoriel
        ├── tests/                 ← pages de test (validées avec la lib locale)
        └── demos/                 ← pages tutoriel (fonctionnent avec la lib locale ou npm)
```

L'app de démo sert deux rôles selon comment elle est buildée :

| Mode | Commande | Résolution de `ngx-parrecrivains` |
|---|---|---|
| Test local | `npx ng serve` (utilise `tsconfig.json`) | Lib locale buildée (`dist/ngx-parrecrivains/`) |
| Démo déployée | `npx ng build --ts-config=tsconfig.demo.json` | Lib publiée sur npm |

Il est impossible d'avoir, dans un seul build, certaines pages sur la lib locale et d'autres sur
la lib npm — la résolution se fait au complet à la compilation. D'où les deux `tsconfig`.

⚠️ Ne jamais builder pour GitHub Pages avec `tsconfig.json` (path alias) — `dist/` n'existe pas
sur un environnement propre et le déploiement échouerait silencieusement en résolvant du vide.

### Travailler sur la lib en local

```bash
git clone https://github.com/MaiveCL/ngx-parrecrivains.git
cd ngx-parrecrivains/src
npm install

# Terminal 1 — rebuild la lib à chaque changement
npx ng build ngx-parrecrivains --watch

# Terminal 2 — sert l'app avec la lib locale (path alias)
npx ng serve
```

→ App : [http://localhost:4200/ngx-parrecrivains/](http://localhost:4200/ngx-parrecrivains/)
→ Pages de test : [http://localhost:4200/ngx-parrecrivains/tests/](http://localhost:4200/ngx-parrecrivains/tests/)

`ng` n'est pas installé globalement — toujours utiliser `npx ng`. Commandes détaillées
(publication npm, déploiement GitHub Pages, ngrok) dans [`cmd.md`](cmd.md).

### Déploiement

Le site est buildé avec `tsconfig.demo.json` (résolution npm) et le résultat est commité dans
`docs/`, servi directement par GitHub Pages depuis `main` — pas de GitHub Actions, pour rester
sans limite de déploiements et sans configuration sur ce projet solo.

### Branches

| Branche | Contenu |
|---|---|
| `main` | Lib source + démo complète — tous les composants fonctionnels |
| `tuto-depart` | Scaffold pédagogique — lib non installée, éléments à compléter |

`tuto-depart` sert de point de départ à un exercice guidé : l'utilisateur installe la librairie
et complète les intégrations manquantes en suivant les instructions du site.

### Contenu de la librairie

| Élément | Type | Version |
|---|---|---|
| `ngx-liseuse-manuscrit` | Composant | v0.1.x |
| `mots` · `words` | Pipe | v0.2.x |
| `TempsLectureService` | Service | v0.3.x |
| `isbnValidator` · `validerIsbn` | Validator | v0.4.x |

---

## English

**Angular library for the literary industry** — manuscript reader, word-count pipes, reading
time estimation, ISBN validator (fr/en/cr), i18n and PDF/Google Docs support — **and its
interactive demo/tutorial site**.

📦 **On npm**: [`ngx-parrecrivains`](https://www.npmjs.com/package/ngx-parrecrivains)
🌐 **Live site**: [https://maivecl.github.io/ngx-parrecrivains/](https://maivecl.github.io/ngx-parrecrivains/)

### What this repo contains

This repo contains **both the library source and its demo/tutorial site** — it's no longer just
a demo site pointing at a library hosted elsewhere. The library was migrated here from the
`parrecrivains` monorepo (`transfertLib` branch, merged into `main`).

```
ngx-parrecrivains/
├── docs/                          ← static build served by GitHub Pages
├── specs/                         ← SpecKit specs (lib + app)
└── src/                           ← Angular CLI workspace
    ├── angular.json               ← 2 projects: lib + app
    ├── tsconfig.json              ← path alias to the local lib (dev/test)
    ├── tsconfig.demo.json         ← no path alias, resolves from npm (deployment)
    ├── projects/ngx-parrecrivains/← library source, published to npm
    └── src/app/                   ← demo/tutorial app
        ├── tests/                 ← test pages (validated against the local lib)
        └── demos/                 ← tutorial pages (work with the local lib or npm)
```

The demo app plays two roles depending on how it's built:

| Mode | Command | `ngx-parrecrivains` resolves to |
|---|---|---|
| Local testing | `npx ng serve` (uses `tsconfig.json`) | Local lib build (`dist/ngx-parrecrivains/`) |
| Deployed demo | `npx ng build --ts-config=tsconfig.demo.json` | Library published on npm |

A single build can't mix pages resolving to the local lib with pages resolving to the npm lib —
resolution happens repo-wide at compile time. Hence the two `tsconfig` files.

⚠️ Never build for GitHub Pages with `tsconfig.json` (path alias) — `dist/` doesn't exist in a
clean environment, and the deploy would silently resolve to nothing.

### Working on the library locally

```bash
git clone https://github.com/MaiveCL/ngx-parrecrivains.git
cd ngx-parrecrivains/src
npm install

# Terminal 1 — rebuild the lib on every change
npx ng build ngx-parrecrivains --watch

# Terminal 2 — serve the app against the local lib (path alias)
npx ng serve
```

→ App: [http://localhost:4200/ngx-parrecrivains/](http://localhost:4200/ngx-parrecrivains/)
→ Test pages: [http://localhost:4200/ngx-parrecrivains/tests/](http://localhost:4200/ngx-parrecrivains/tests/)

`ng` isn't installed globally — always use `npx ng`. Detailed commands (npm publishing, GitHub
Pages deployment, ngrok) live in [`cmd.md`](cmd.md).

### Deployment

The site is built with `tsconfig.demo.json` (npm resolution) and the result is committed to
`docs/`, served directly by GitHub Pages from `main` — no GitHub Actions, to stay free of
deployment limits and config overhead on this solo project.

### Branches

| Branch | Content |
|---|---|
| `main` | Library source + complete demo — all components functional |
| `tuto-depart` | Pedagogical scaffold — library not installed, elements to complete |

`tuto-depart` serves as a starting point for a guided exercise: the user installs the library
and completes the missing integrations by following the site's instructions.

### Library contents

| Element | Type | Version |
|---|---|---|
| `ngx-liseuse-manuscrit` | Component | v0.1.x |
| `mots` · `words` | Pipe | v0.2.x |
| `TempsLectureService` | Service | v0.3.x |
| `isbnValidator` · `validerIsbn` | Validator | v0.4.x |

---

MIT © 2026 [- Maive - Marie-Ève Bouchard](https://parrecrivains.com)