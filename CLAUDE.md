# ngx-parrecrivains — Constitution du projet

## Identité de ce Claude — lire en début de conversation

**Je suis le Claude du repo `ngx-parrecrivains`** (`/home/maiveBOX/ngx-parrecrivains`).

Ce repo est le **site de démonstration et documentation** de la lib — pas la lib elle-même.

Il existe un **deuxième repo séparé** : `/home/maiveBOX/parrecrivains` — c'est là que la librairie est développée et publiée sur npm, et que l'application principale Angular + Rails vit. Il a son propre Claude distinct.

En début de conversation, me présenter ainsi :
> "Je suis le Claude de **ngx-parrecrivains** (site de démo/doc). Le développement de la lib est dans le repo `parrecrivains`."

---


## Ce que ce repo EST

Ce repository est le **site de démonstration officiel** et la **documentation interactive** de la librairie Angular npm `ngx-parrecrivains`.

Il sert exclusivement à :
- Démontrer chaque composant et validator de la librairie en live
- Fournir des exemples reproductibles (copy-paste ready)
- Guider les développeurs via des pages "quickstart"
- Présenter les cas d'erreurs et de validation typiques

## Ce que ce repo N'EST PAS

Ce repo **ne contient pas** la librairie `ngx-parrecrivains` elle-même. La librairie est développée et publiée séparément sur npm. Ce repo ne contient que des **exemples d'utilisation**.

---

## Structure du repository

```
ngx-parrecrivains/          ← racine du repo Git
├── CLAUDE.md               ← ce fichier (constitution)
├── README.md
├── docs/                   ← build GitHub Pages (généré)
└── src/                    ← workspace Angular CLI
    ├── angular.json
    ├── package.json
    ├── .claude/
    │   └── CLAUDE.md       ← conventions de code Angular
    └── src/                ← sources de l'application
        ├── main.ts
        ├── styles.scss
        ├── index.html
        ├── app/
        │   ├── app.ts
        │   ├── app.config.ts
        │   ├── app.routes.ts
        │   ├── demos/          ← pages de démonstration par feature
        │   │   ├── isbn/
        │   │   ├── validators/
        │   │   └── forms/
        │   ├── guides/         ← pages textuelles (quickstart, installation)
        │   │   ├── installation/
        │   │   └── quickstart/
        │   └── shared/         ← composants, services, interceptors partagés
        │       ├── mock-api/
        │       └── services/
        └── assets/
            └── mock/           ← fichiers JSON simulant des données de test
```

> **Note :** Le projet Angular CLI réside dans `src/`. Pour toute commande Angular (`ng`, `npm`), se placer dans `/home/maiveBOX/ngx-parrecrivains/src/`.

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
# Build production avec base-href pour GitHub Pages
ng build --base-href /ngx-parrecrivains/
```

Le résultat du build est placé dans `docs/` (configuré dans `angular.json` → `outputPath`).

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

