# Changelog du repo — ngx-parrecrivains

Décisions d'infrastructure du dépôt : configurations de build, déploiement, outillage, conventions
de travail. **Ce n'est pas le changelog de la lib** — celui-là est dans
`src/projects/ngx-parrecrivains/CHANGELOG.md` et suit les versions npm.

Une entrée = une décision qu'on risquerait de ne plus comprendre après quelques mois d'absence.
Pas de journal exhaustif des commits : `git log` fait déjà ça.

Les entrées antérieures au 2026-08-10 sont des rétro-rapports approximatifs reconstruits depuis
`git log` — les dates sont fiables, les détails le sont moins.

---

## 2026-08-25 — `dist/` d'un build `--watch` invalide pour `npm publish`

Découvert en publiant la 0.4.3 : `npm publish` a échoué avec `"version" was cleaned and set to
"0.0.0-watch"`. Le `dist/ngx-parrecrivains/` avait été écrit par un `ng build --watch` (préalable
documenté au test local dans `cmd.md`), qui timbre un `version` placeholder plutôt que la vraie
version. Arrêter le watch ne corrige pas `dist/` — son dernier résultat reste sur disque.

Un agent avait auparavant jugé `dist/` « à jour » via `find -newer` (aucune source plus récente que le
build) — vérification insuffisante : le fichier écrit par le watch a une date plus récente que les
sources, donc « paraît » frais, même s'il contient un placeholder invalide. Ajouté aux pièges vérifiés
de `CLAUDE.md` : toujours rebuilder en one-shot immédiatement avant `npm publish`, jamais se fier à une
comparaison de dates.

---

## 2026-08-25 — Vérification visuelle avant publication : rôle réservé à Maive

Ajouté à `CLAUDE.md` après qu'un agent a tenté de lancer un navigateur headless (`chromium-cli`) pour
juger lui-même du rendu visuel avant la publication de la 0.4.3 — un réflexe issu d'une instruction
générique (« teste dans un navigateur avant de dire que c'est fini »), pas d'une lecture attentive du
flux `T-I` de la constitution, qui réserve déjà cette étape à Maive elle-même.

Règle ajoutée : l'agent ne lance jamais de navigateur headless ni ne capture d'écran pour juger d'un
rendu avant publication. Il se limite à ce qui est automatisable et objectif (`ng build`, `ng test`) et
donne la commande + une checklist ; le jugement visuel final reste humain. Cette règle prime sur le
comportement par défaut de l'agent pour ce repo précisément.

---

## 2026-08-10 — Trois états de build distingués par un bandeau visuel

Ajout d'une troisième configuration de build, `test-public`, pour exposer publiquement la lib
**locale non publiée** sur GitHub Pages, en vue d'une validation communautaire avant publication npm.

Les trois états et leur signal visuel :

| Configuration | Lib résolue | Bandeau |
|---|---|---|
| `development` (défaut de `ng serve`) | locale (`dist/`) | gris — TEST LOCAL |
| `test-public` (flag explicite) | locale (`dist/`) | orange — TEST PUBLIC |
| `production` (défaut de `ng build`) | npm (`node_modules`) | vert — SITE OFFICIEL |

- Le texte du bandeau vient de `src/environments/environment*.ts`, échangés par `fileReplacements`.
  `test-public` ne redéfinit **pas** `tsConfig` : il hérite de `tsconfig.app.json` et garde donc le
  path alias vers la lib locale. C'est tout l'intérêt de la configuration — la modifier casse le but.
- Le bandeau est monté dans le shell (`app.ts`), frère de `<router-outlet />` : il est structurellement
  présent sur toutes les routes, y compris `/tests/`.
- **Le port n'est jamais un indicateur.** Local et test-public tournent tous deux sur 4200. Seule la
  couleur du bandeau distingue la source de la lib.
- **ngrok est abandonné** pour ce repo. Il servait à exposer un test local au public avant publication ;
  `test-public` publie directement sur `docs/`, et le bandeau avertit les visiteurs. ngrok reste utilisé
  dans le repo `parrecrivains` uniquement.
- `cmd.md` reformaté au complet sur le modèle de `parrecrivains/cmd_PC.md` : titres et commandes
  seulement, notes de référence réduites à la fin. C'est un presse-papier de commandes, pas de la doc.

## 2026-08-10 — Normes de la branche pédagogique `tuto-depart`

Aucun code touché — établissement des normes seulement. La branche actuelle est considérée comme une
preuve de concept ; ces règles valent pour sa refonte future.

- **Aucune synchronisation n'est possible, et il ne faut pas en chercher une.** Le code que l'étudiant
  doit écrire est exactement ce qui a été retiré de `tuto-depart`. Un merge depuis `main` le réinjecte
  et l'exercice cesse d'exister. `main` est la solution, `tuto-depart` est l'énoncé.
- **Maintenance manuelle et séparée.** La branche a été créée avant le `main` actuel. Toute mise à jour
  est une reprise à la main, fichier par fichier, décidée par Maive. Aucune procédure automatique.
- **Contenu** : les sections de chaque composant avec leur procédure d'intégration, l'intégration
  retirée. L'étudiant voit une boîte vide et la remplit en suivant la page.
- **Exclusions** : pas de pages de test, pas de fichiers de la lib locale, **pas de bandeau ni de
  `src/environments/`**. Aucune notion de lib locale / npm / test public sur cette branche — un seul
  objectif, une version minimaliste propre du repo pour qu'un étudiant teste le code.
- L'avertissement « intégration pas encore réussie » **existe déjà** : c'est le `SlotComponent`
  (⬚ pointillés → ✅ vert plein quand `integre` passe à `true`). Rien à construire.
- L'interdiction de merger, jusqu'ici absente des `CLAUDE.md`, y a été ajoutée. Elle reste
  **uniquement documentaire** : aucun hook git, aucune protection de branche côté GitHub.
- Piste gardée pour plus tard, non tranchée : un bac à sable en ligne (aperçu + code côté à côte),
  éventuellement combiné à la copie de repo — celle-ci laisse l'étudiant fouiller un projet complet
  et fonctionnel, ce qui a sa valeur propre.

## 2026-08-08 — Installation sur nouvelle machine

Procédure de sécurité des dépendances npm consignée dans `verification_securite_dependances.md`.
`strict-allow-scripts=true` doit être posé dans `src/.npmrc` par root — fichier non versionné, donc
absent après un clone : à recréer à chaque nouvelle machine.

## 2026-07-02 — Publication 0.4.2 depuis ce repo

Première version de la lib publiée sur npm **depuis `ngx-parrecrivains`** plutôt que depuis
`parrecrivains`. Le repo devient la source de la lib, pas seulement sa vitrine.

## 2026-07-02 — Le `404.html` sur GitHub Pages

**Le menu n'a jamais été en cause.** Cliquer un lien de la nav ne déclenche aucune requête vers
GitHub : Angular intercepte le clic et remplace le contenu à l'écran. Ça marche, ça a toujours marché.

Le problème n'apparaît que quand le **navigateur** demande une URL au serveur, c'est-à-dire dans trois
cas : URL tapée à la main, F5, ou lien direct reçu de quelqu'un.

Pourquoi ça échoue : une app Angular est **un seul fichier HTML** (`index.html`) plus du JavaScript.
Il n'existe aucun fichier `tutos/isbn` sur le disque — vérifiable dans `docs/`, il n'y a ni dossier
`tutos/` ni `tests/`. Les pages sont fabriquées par le JavaScript dans le navigateur. GitHub cherche
donc un fichier qui n'existe pas.

Sur un hébergeur normal (Apache, nginx, Netlify), une ligne de configuration règle ça : « toute URL
inconnue → sers `index.html` ». **GitHub Pages n'a aucun fichier de configuration.** Sa seule
convention : un fichier nommé `404.html` est servi pour toute URL introuvable. On y met une copie de
l'app. GitHub croit servir une page d'erreur, il sert l'application, qui lit l'URL et affiche la bonne
page.

C'est la solution standard de tous les projets Angular/React/Vue sur GitHub Pages, pas une astuce
maison. `ng build` n'émettant pas ce fichier, la copie est manuelle après chaque build.

**Ça ne concerne pas que `/tests`.** Vérifié en ligne le 2026-08-10 : `/tutos/isbn` et `/tutos/liseuse`
sont dans le même cas. Sans `404.html`, un favori, un F5 en cours de lecture, ou le raccourci
`…/ngx-parrecrivains/tests` tapé à la main ne fonctionneraient pas. Seul `/` survivrait.

Seul résidu : ces routes renvoient un code **HTTP 404** en coulisses alors que la bonne page s'affiche.
Un `curl` qui retourne 404 ne veut donc pas dire que le site est cassé.

## 2026-07-02 — Séparation lib locale / lib npm par tsconfig

Un seul build Angular ne peut pas mélanger les deux résolutions. D'où deux tsconfig :
`tsconfig.app.json` (path alias → `dist/`) et `tsconfig.demo.json` (`paths: {}` → `node_modules`).
La configuration `production` est épinglée sur `tsconfig.demo.json` et reste le défaut de `ng build`,
pour qu'un build de déploiement ne puisse pas embarquer la lib locale par accident.

Piège permanent : le repli du path alias est **silencieux**. Si `dist/ngx-parrecrivains/` n'existe pas,
TypeScript retombe sur `node_modules` sans avertir. Il faut donc s'assurer en temps constant que le build de la lib local en mode watch n'affiche pas d'erreur.

## 2026-07-02 — Migration de la lib et des tests depuis parrecrivains

Source de la lib, pages de test, specs SpecKit et constitution transférées depuis `parrecrivains`.
Les pages de test deviennent **permanentes** ici (elles étaient temporaires là-bas) : les bannières
« à supprimer avant publication » ont été retirées.

## 2026-06-04 — GitHub Pages en mode branche, dossier `docs/`

Déploiement par fichiers statiques commités (branche `main`, dossier `docs/`) plutôt que GitHub Actions :
pas de quota de minutes CI, aucune configuration, adapté à un projet solo. Conséquence assumée :
`docs/` contient des fichiers générés dans git.

## 2026-06-03 — Création du repo

Workspace Angular CLI à deux projets (lib + app de démo/tutoriel), contraintes non négociables :
SPA seulement, aucun backend réel, données simulées côté frontend.