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

## Deux modes de build — même app, comportement différent

Il est **impossible** dans un seul build Angular d'avoir certaines pages qui utilisent la lib locale et d'autres qui utilisent la lib npm. Toutes les pages utilisent la même résolution au moment de la compilation.

La solution : deux tsconfig, deux usages.

### Mode test local (`ng serve`)
- `tsconfig.json` contient le path alias : `"ngx-parrecrivains": ["./dist/ngx-parrecrivains"]`
- TOUTES les pages (test + tutoriel) utilisent la lib locale buildée
- Workflow : `npx ng build ngx-parrecrivains --watch` dans un terminal, `npx ng serve` dans un autre
- Ngrok peut exposer ce serveur au public pour valider avant de publier

### Mode démo déployée (`npx ng build --ts-config=tsconfig.demo.json`)
- `tsconfig.demo.json` n'a pas de path alias → résolution depuis `node_modules` (npm publié)
- TOUTES les pages utilisent la lib publiée
- Résultat déployé sur GitHub Pages

### ⚠️ Règle critique
Ne jamais builder pour GitHub Pages avec `tsconfig.json` (qui a le path alias) — le dist local n'existe pas sur le serveur de build et le déploiement échouerait.

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
# Build pour GitHub Pages (lib publiée via tsconfig.demo.json, pas de path alias)
npx ng build --ts-config=tsconfig.demo.json
# Puis commiter docs/ et pousser sur main
```

Le résultat du build est placé dans `docs/` (configuré dans `angular.json` → `outputPath`).
GitHub Pages sert ce dossier directement depuis la branche `main`.

### Pourquoi `docs/` commitée plutôt que GitHub Actions

Ce repo utilise le mode **fichiers statiques** (branch `main`, dossier `docs/`) plutôt que GitHub Actions. Raisons :

- **Aucune limite** — GitHub Actions consomme des minutes CI (quota mensuel sur les comptes gratuits). Avec `docs/` commitée, un `git push` suffit, sans aucune limite de déploiements par jour.
- **Zéro configuration** — pas de workflow `.github/workflows/`, pas de permissions à configurer, pas de `GITHUB_TOKEN` à gérer.
- **Adapté au projet solo** — la complexité de GitHub Actions n'apporte rien ici.

⚠️ Conséquence : `docs/` contient des fichiers générés dans git. C'est voulu et assumé.

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

