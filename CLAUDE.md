# ngx-parrecrivains — Constitution du projet

## Identité de ce Claude — lire en début de conversation

**Je suis le Claude du repo `ngx-parrecrivains`** (`/home/maiveBOX/ngx-parrecrivains`).

Ce repo contient **la source de la lib** ET **l'app de test/tutoriel**. L'application principale Angular + Rails est dans le repo séparé `parrecrivains` (`/home/maiveBOX/parrecrivains`), qui utilise la lib via npm.

En début de conversation, me présenter ainsi :
> "Je suis le Claude de **ngx-parrecrivains** (lib source + app test/tutoriel)."

---

## Ce que ce repo contient

- **La lib source** (`src/projects/ngx-parrecrivains/`) — publiée sur npm
- **Une app Angular** (`src/src/`) — sert à la fois de test local et de tutoriel/démo, selon le mode de build

---

## Trois états de build — même app, trois apparences

Il est **impossible** dans un seul build Angular d'avoir certaines pages qui utilisent la lib locale et d'autres qui utilisent la lib npm. Toutes les pages utilisent la même résolution au moment de la compilation.

La solution : deux tsconfig, trois configurations, et un bandeau qui dit toujours laquelle est active.

| Configuration | Commande | Lib résolue | Bandeau |
|---|---|---|---|
| `development` | `npx ng serve` (défaut) | locale (`dist/`) | gris — TEST LOCAL |
| `test-public` | `npx ng serve --configuration=test-public` ou `npx ng build --configuration=test-public` | locale (`dist/`) | orange — TEST PUBLIC |
| `production` | `npx ng build` (défaut) | npm (`node_modules`) | vert — SITE OFFICIEL |

- Le texte du bandeau vient de `src/environments/environment*.ts`, échangés par `fileReplacements` dans `angular.json`.
- **`test-public` ne redéfinit pas `tsConfig`** : il hérite de `tsconfig.app.json` et garde donc le path alias vers la lib locale. Lui donner `tsconfig.demo.json` détruirait sa raison d'être.
- `production` est épinglée sur `tsconfig.demo.json` (`paths: {}`) et reste le **défaut** de `ng build` : un build de déploiement ne peut pas embarquer la lib locale par accident. `test-public` exige le flag explicite.
- Le composant `shared/bandeau/` est monté dans le shell (`app.ts`), frère de `<router-outlet />` : présent sur toutes les routes, y compris `/tests/`.
- **Le port n'est jamais un indicateur.** Les deux variantes locales tournent sur 4200. Seul le bandeau fait foi.
- **Ngrok n'est plus utilisé dans ce repo** — `test-public` le remplace. Ngrok ne sert plus qu'au repo `parrecrivains`.

### ⚠️ Trois pièges vérifiés
- **`ng build` écrit toujours dans `docs/`.** Pour un build de contrôle, ajouter `--output-path=/tmp/verif`, sinon le site publié est écrasé. Le build n'émet pas `404.html` : le regénérer avec `cp ../docs/index.html ../docs/404.html`.
- **Le repli du path alias est silencieux.** Si `dist/ngx-parrecrivains/` n'existe pas, TypeScript retombe sur `node_modules` sans avertissement et `ng serve` sert la version npm publiée — les modifications locales de la lib deviennent invisibles. Toujours builder la lib avant de servir.
- **`ng serve` lancé par un agent n'est pas visible depuis VS Code.** Angular écoute par défaut sur `localhost`, qui résout en `[::1]` (IPv6) sur cette machine. Le forwarding **manuel** de VS Code compose `127.0.0.1` (IPv4) et tourne en boucle sans jamais répondre. Quand Maive lance le serveur elle-même, VS Code lit `/proc/net/tcp6` et forwarde correctement — le piège ne touche donc que les serveurs lancés par un agent. Toujours ajouter `--host 127.0.0.1` dans ce cas.

### 🚫 Vérification visuelle avant publication — jamais par l'agent

La validation visuelle documentée en `T-I` (« Test local | `ng serve` | ... | Valider avant publication ») est **toujours effectuée par Maive elle-même**, dans son propre navigateur. Ceci **remplace**, pour ce repo, l'instruction générique « démarre le serveur et utilise la fonctionnalité dans un navigateur avant de rapporter que c'est terminé » — elle ne s'applique pas ici.

L'agent (Claude) ne doit **jamais** lancer de navigateur headless, de `chromium-cli`, ou capturer des captures d'écran pour juger visuellement du rendu avant une publication npm. Se limiter à ce qui est automatisable et objectif : `ng build` (compilation), `ng test` (suite de tests unitaires). Le jugement visuel/UX final revient à Maive, pas à l'agent — donner la commande (`npx ng serve`) et la checklist de ce qu'il faut regarder, puis attendre son retour.

---

## ⛔ Branche `tuto-depart` — NE JAMAIS MERGER

Deux branches coexistent et **ne doivent jamais être mergées, ni dans un sens ni dans l'autre** (constitution § T-VI) :

| Branche | Rôle |
|---|---|
| `main` | Démo complète — lib installée, tous les composants fonctionnels. C'est la **solution** de l'exercice. |
| `tuto-depart` | Scaffold pédagogique — lib PAS installée, intégrations retirées. C'est l'**énoncé**. |

**Pourquoi un merge la détruit :** le code que l'étudiant doit écrire lui-même est précisément ce qui a été retiré de `tuto-depart`. Merger `main` dedans le réinjecte automatiquement — l'exercice cesse d'exister à l'instant même. Il n'y a aucune façon de « synchroniser » les deux branches sans annuler le travail pédagogique.

**Norme de maintenance :** `tuto-depart` a été créée avant le `main` actuel et se maintient **à la main, séparément**. Aucune procédure automatique n'existe et il ne faut pas en inventer une. Toute mise à jour est une reprise manuelle, fichier par fichier, décidée par Maive.

**Ce que `tuto-depart` contient :** uniquement les sections de chaque composant avec leur procédure d'intégration, l'intégration elle-même retirée. L'étudiant voit une boîte vide (`SlotComponent`, déjà codé : ⬚ pointillés → ✅ vert une fois `integre` à `true`) et la remplit en suivant les étapes de la page.

**Ce que `tuto-depart` ne contient pas** — et ne doit pas recevoir :
- pages de test (`src/src/app/tests/`)
- fichiers de la lib locale (`src/projects/`, `dist/`)
- bandeau d'environnement et `src/environments/` — **aucune** notion de lib locale / npm / test public ici ; un seul objectif, une version minimaliste propre du repo pour qu'un étudiant teste le code

**Règle critique déjà documentée** (`specs/001-tuto-interactif/plan.md`) : le TypeScript des pages de tuto n'importe **rien** de `ngx-parrecrivains`. Les snippets montrant les imports sont des chaînes affichées par `<app-snippet>`, pas du code exécuté.

**État au 2026-08-10 :** `tuto-depart` a 18 commits de retard sur `main`, dernier alignement le 2026-06-04, donc antérieur à la migration du 2 juillet. Elle est considérée comme une preuve de concept ; les normes ci-dessus valent pour sa future refonte. Deux chemins suspects y traînent, à vérifier le jour où on y retournera : `src/src/src/app/...` (trois `src` imbriqués) et un `src/src/tsconfig.json` égaré.

**Aucune protection technique n'est en place** — l'interdiction n'est aujourd'hui que documentaire.
Procédure complète à appliquer dans `BACKLOG.md` § « Protéger `tuto-depart` contre l'écrasement ».
Le but y est précisé : bloquer l'**écrasement** de la branche, pas le travail dessus, et surtout pas
les commits d'un étudiant sur son propre clone.

---

## Structure du repository

```
ngx-parrecrivains/                ← racine du repo Git
├── CLAUDE.md                     ← ce fichier
├── docs/                         ← documentation MkDocs (à migrer depuis parrecrivains)
├── specs/                        ← specs SpecKit (à migrer depuis parrecrivains)
└── src/                          ← workspace Angular CLI
    ├── angular.json              ← 2 projets : lib + app
    ├── tsconfig.json             ← path alias → lib locale (dev/test)
    ├── tsconfig.demo.json        ← sans path alias → npm publié (déploiement)
    ├── projects/
    │   └── ngx-parrecrivains/    ← source de la lib
    └── src/                      ← app test/tutoriel
        └── app/
            ├── tests/            ← pages de test (validées avec lib locale)
            └── demos/            ← pages tutoriel (fonctionnent dans les 2 modes)
```

> **Note :** Pour toute commande Angular, se placer dans `/home/maiveBOX/ngx-parrecrivains/src/`. `ng` n'est **pas** installé globalement — utiliser `npx ng` à la place de `ng`.

---

## Contraintes techniques non négociables

| Contrainte | Valeur |
|---|---|
| Framework | Angular SPA uniquement — **pas de SSR, pas de SSG** |
| Déploiement | GitHub Pages (build statique) |
| Backend | **Aucun backend réel autorisé** |
| Simulation données | JSON dans `assets/mock`, HttpInterceptor, services in-memory |
| Routing GitHub Pages | `base-href` requis au build |

---

## Convention de démonstration

Chaque module de la librairie doit avoir une page de démo structurée ainsi :

1. **Live demo** — composant interactif dans la page
2. **Exemple minimal** — code snippet fonctionnel, copy-paste ready
3. **Exemple avec erreur volontaire** — montre les messages de validation
4. **Exemple avec données mockées** — utilise les fichiers `assets/mock/`
5. **Explication textuelle** — intégrée dans la page, pas dans une doc séparée

---

## Stratégie de simulation backend

Toutes les données sont simulées côté frontend. Approches autorisées :

- Fichiers JSON dans `src/src/assets/mock/`
- Services Angular (`providedIn: 'root'`)
- `HttpInterceptor` Angular simulant des réponses HTTP

**Interdit :** backend réel, API serveur, base de données persistante.

---

## Déploiement — GitHub Pages

```bash
# Site officiel — lib npm publiée. La configuration production est le défaut, aucun flag requis.
npx ng build && cp ../docs/index.html ../docs/404.html
# Puis commiter docs/ et pousser sur main
```

Le `--ts-config=tsconfig.demo.json` d'autrefois est obsolète : la configuration `production`
l'épingle déjà dans `angular.json`. Toutes les commandes courantes sont dans `cmd.md`.

Le résultat du build est placé dans `docs/` (configuré dans `angular.json` → `outputPath`).
GitHub Pages sert ce dossier directement depuis la branche `main`.

### Pourquoi `docs/` commitée plutôt que GitHub Actions

Ce repo utilise le mode **fichiers statiques** (branch `main`, dossier `docs/`) plutôt que GitHub Actions. Raisons :

- **Aucune limite** — GitHub Actions consomme des minutes CI (quota mensuel sur les comptes gratuits). Avec `docs/` commitée, un `git push` suffit, sans aucune limite de déploiements par jour.
- **Zéro configuration** — pas de workflow `.github/workflows/`, pas de permissions à configurer, pas de `GITHUB_TOKEN` à gérer.
- **Adapté au projet solo** — la complexité de GitHub Actions n'apporte rien ici.

⚠️ Conséquence : `docs/` contient des fichiers générés dans git. C'est voulu et assumé.

---

## Sécurité des dépendances npm

Quand `npm install`/`npm update` signale des scripts d'installation non couverts par `allowScripts`
(`npm warn allow-scripts N packages have install scripts not yet covered`), suivre
[`verification_securite_dependances.md`](verification_securite_dependances.md) — obligatoire avant
tout `npm approve-scripts`.

**Règle non-négociable : jamais `npm approve-scripts --all` ni `--dangerously-allow-all-scripts`.**
Un paquet à la fois, après vérification.

À savoir : `allowScripts` seul ne bloque rien — npm exécute le script puis avertit. Le garde-fou
n'est effectif qu'avec `strict-allow-scripts=true` dans `src/.npmrc`, fichier **non versionné**
posé par root à la création du compte de travail.

---

## Objectif utilisateur final

**Pour un développeur externe :**
1. Voir un exemple dans ce site
2. `npm install ngx-parrecrivains`
3. Copier l'exemple
4. Le faire fonctionner immédiatement dans son propre projet Angular

**Pour un visiteur :**
- Tester les composants en live
- Comprendre les erreurs possibles
- Apprendre l'usage correct de la librairie

---

## Angular version

Angular **21.2.x** — standalone components par défaut (pas de NgModules). Voir `src/.claude/CLAUDE.md` pour les conventions de code.

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at `specs/001-tuto-interactif/plan.md`.
<!-- SPECKIT END -->

