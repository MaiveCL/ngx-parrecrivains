# Backlog — ngx-parrecrivains

Tâches futures pour la lib et l'app test/tutoriel.

---

## i18n — auditer les incohérences de traduction anglaise

Constaté le 2026-08-25 lors d'un survol rapide de la version anglaise du tutoriel : des incohérences
de traduction/terminologie ont été repérées, sans les noter sur le coup.

- [ ] Passe complète de vérification de la version anglaise — tutoriel (`src/public/i18n/en.json`) ET
      lib (`src/projects/ngx-parrecrivains/public/i18n/*/en.json`) — cohérence terminologique entre les
      deux (mêmes termes utilisés pour désigner les mêmes concepts), et à l'intérieur de chaque fichier
- [ ] Vérifier aussi la version `cr` de la lib pendant qu'on y est, même angle de cohérence

---

## Nav — un menu par type d'élément, sous-menu par élément

Constaté le 2026-08-25 : `shared/nav/nav.html` liste les 4 tutoriels à plat (isbn, mots, temps,
liseuse). Ça tient pour l'instant, mais saturera la barre à mesure que la lib grossit — le backlog
`parrecrivains` prévoit déjà d'autres composants futurs (`ngx-editeur-manuscrit`,
`ngx-fiche-manuscrit`, `ngx-carte-auteur`, etc.).

La catégorisation existe déjà dans les données, juste pas reflétée dans la nav — chaque page tuto a
déjà un `tuto.X.type` distinct (`fr.json`) :
- `tuto.isbn.type` → « Validateur de formulaire réactif »
- `tuto.mots.type` → « Pipe Angular »
- `tuto.temps.type` → « Service Angular »
- `tuto.liseuse.type` → « Composant Angular »

- [ ] Remplacer les liens plats par un menu déroulant par type (ex. Composants / Services / Pipes /
      Validateurs), chaque menu listant en sous-menu les éléments de ce type — un seul élément par
      catégorie aujourd'hui, mais la structure absorbe la croissance sans repenser la nav à chaque ajout
- [ ] Décider si le type se déduit automatiquement de `tuto.X.type` ou d'une liste explicite dans
      `nav.ts` — éviter de dupliquer la classification à deux endroits

⚠️ À faire **en même temps** que « Nav — retirer la page index `/tests` » ci-dessous plutôt que
séparément — les deux touchent `shared/nav/nav.html` et une même passe de refonte évite de reprendre le
composant deux fois pour des raisons différentes.

---

## Accueil du tuto — clarifier que le clonage (étape 1) est facultatif

Constaté le 2026-08-25 pendant la vérification visuelle de la 0.4.3 : la page d'accueil
(`accueil.description`) dit au visiteur que ce site guide l'intégration de la lib **dans son propre
projet**, mais la première étape de la liste « À faire pour démarrer »
(`accueil.afaire.etape1`, dans `accueil.ts:46` — `git clone -b tuto-depart https://github.com/...`)
clone le repo pédagogique `tuto-depart`. Rien n'indique que cette étape est optionnelle — un visiteur
qui a déjà son propre projet Angular peut croire à tort qu'il doit cloner ce repo avant de continuer.

- [ ] Mettre l'étape 1 en retrait visuellement (encadré jaunâtre/ambré, distinct des 3 autres étapes)
      avec un texte du genre : « Facultatif — à faire seulement pour pratiquer les étapes dans un
      projet pédagogique déjà préparé pour vous. Sinon, passez directement à l'étape suivante dans
      votre propre projet. »
- [ ] Vérifier si les étapes 2-4 (`npm install`, `npm install ngx-parrecrivains`, `ng serve`) restent
      cohérentes qu'on soit dans le clone `tuto-depart` ou dans un projet perso — sinon les distinguer
      aussi

---

## Pages `/tests` — rendre les cas limites interactifs et plus pédagogiques

Constaté le 2026-08-25 pendant la vérification visuelle de la 0.4.3. État actuel des 4 pages, très
inégal :

- **`pipe-mots`** et **`liseuse`** ont déjà des boutons cliquables (un par cas) qui chargent le cas dans
  la zone de résultat interactive — le pattern souhaité existe déjà là.
- **`temps-lecture`** (`test-zone--cas`, tableau `casLimites`) et **`isbn`** (`test-zone--cas`, tableau
  `casReference`) n'ont **pas** de bouton : le tableau affiche Attendu/Réel/OK déjà calculés pour toutes
  les lignes en même temps, mais rien ne permet de charger un cas précis dans le panneau interactif du
  haut pour l'explorer soi-même.

- [ ] Ajouter un bouton « charger » par ligne dans les tableaux de `TEST-temps-lecture` et `TEST-isbn` —
      au clic, pousse les valeurs du cas (`cas.mots`/`cas.vitesse` pour temps-lecture, `cas.isbn`/
      `cas.annee` pour isbn) dans les signaux du panneau interactif (`nombreMots`/`vitesse`,
      `isbnSaisie`/`anneeSaisie`), même pattern que les boutons déjà présents dans `pipe-mots`/`liseuse`

**Deuxième problème, distinct** : le texte « Attendu » est souvent une notation technique compacte
plutôt qu'une explication. Exemple donné le 2026-08-25 : pour le cas `null` dans `temps-lecture`
(`TEST-temps-lecture.ts`), `attendu` vaut littéralement `'0 s → "0 min"'` — ça dit CE qui est vérifié,
pas POURQUOI (ex. : « une valeur `null` est traitée comme 0 mot plutôt que de lever une erreur — utile
si le champ formulaire est vide »). Maintenant que ces pages sont intégrées au tutoriel (pas juste de la
QA interne), ce niveau d'explicite devient pédagogique, pas cosmétique.

- [ ] Revoir le texte de chaque cas (les 4 pages, pas seulement `temps-lecture`) pour expliquer le
      **pourquoi** du comportement attendu, pas seulement reformuler le résultat technique

---

## Nav — retirer la page index `/tests` (TEST-menu), la remplacer par un sous-menu

Constaté le 2026-08-25 pendant la vérification visuelle de la 0.4.3. Historique : avant l'ajout du mot
« Tests » dans la barre de nav principale (`shared/nav/nav.html`), il fallait taper `/tests` à la main
pour tomber sur `TEST-menu` (`src/src/app/tests/menu/`), une page intermédiaire qui liste les liens vers
les 4 pages de test (`tests/liseuse`, `tests/isbn`, `tests/pipe-mots`, `tests/temps-lecture`) en lisant
`router.config`. Maintenant que « Tests » est directement cliquable dans la nav, cette page
intermédiaire est redondante — **à condition que** le lien « Tests » de la nav principale devienne
lui-même un sous-menu déroulant contenant ces 4 liens (au lieu de mener à une page qui ne fait que les
lister).

⚠️ Ne touche **pas** à la page d'accueil du tutoriel (`accueil/`, route `/`) — uniquement la section
`/tests` et son index.

- [ ] Transformer le lien « Tests » de `shared/nav/nav.html` en sous-menu déroulant (liseuse, isbn,
      pipe-mots, temps-lecture) — même contenu que `TEST-menu`, directement dans la barre
- [ ] Retirer la route `tests` (index) et le composant `TESTMenuComponent`
      (`src/src/app/tests/menu/`) — les routes `tests/isbn`, `tests/liseuse`, `tests/pipe-mots`,
      `tests/temps-lecture` restent, seule la page-liste disparaît
- [ ] Vérifier qu'aucun autre lien dans l'app ne pointe vers `/tests` (sans sous-chemin) avant de
      retirer la route

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

## Refonte de `tuto-depart` — plus tard

La branche actuelle est une **preuve de concept**. Les normes à respecter pour sa refonte sont dans
`CLAUDE.md` § tuto-depart (jamais de merge, maintenance manuelle, pas de bandeau ni d'environnements,
pas de pages de test, pas de fichiers de lib locale).

État constaté le 2026-08-10 :

- 18 commits de retard sur `main`, dernier alignement le 2026-06-04 — donc **antérieur** à la
  migration du 2 juillet. Ni source de la lib, ni `tsconfig.demo.json`, ni
  `verification_securite_dependances.md`.
- Deux chemins suspects à vérifier le jour où on y retourne :
  `src/src/src/app/shared/mock/isbn-corpus.json` (trois `src` imbriqués) et un `src/src/tsconfig.json`
  égaré. Ressemblent à des dérapages de copie.

Piste non tranchée, à explorer avant de refondre : un bac à sable en ligne (aperçu + code côte à côte),
éventuellement **combiné** à la copie de dépôt plutôt qu'en remplacement — celle-ci laisse l'étudiant
fouiller un projet complet et fonctionnel, ce qui a sa valeur propre.

---

## Compatibilité Angular antérieure — clarifier et documenter — ✅ TERMINÉ (publié 2026-08-25)

Décision et détails techniques dans `CHANGELOG-repo.md` (2026-08-25) et
`src/projects/ngx-parrecrivains/CHANGELOG.md` [0.4.3] — pas répétés ici.

- [ ] Étendre la convention pour les futurs éléments : chaque nouvelle spec SpecKit doit documenter le
      plancher Angular réel des API utilisées, pour que ce tableau reste à jour sans reprendre un audit
      complet à chaque fois.
- [ ] Suite côté `parrecrivains` : Phase 8 de `parrecrivains/BACKLOG.md` (brancher l'app sur la lib
      publiée) — maintenant déblocable sans `--legacy-peer-deps`, `0.4.3` étant compatible Angular 22.
      Détail de la tâche gardé uniquement là-bas pour ne pas la faire diverger à deux endroits.
---

## i18n app tutoriel — adopter `ngx-translate` au lieu du `LangueService` maison

⚠️ **Prémisse d'origine invalidée le 2026-08-26**, puis tâche reformulée le même jour suite à une
remarque de Maive. Cette tâche visait au départ juste à convertir `fr.json`/`en.json` en JSON
imbriqué, en supposant que l'app utilisait déjà `@ngx-translate/core`. Faux : `LangueService`
(`src/src/app/shared/services/langue.service.ts`) est un service maison à lecture plate directe
(`traductions()[cle] ?? cle`) — convertir le JSON seul aurait cassé tous les appels `t()`.

**Constat de fond** : le service maison existe probablement parce que la règle "zéro dépendance
directe" de la **lib** (`tslib` uniquement — voir `constitution.md` § L-VI, `@ngx-translate/core`
en `peerDependency` optionnel via `TRANSLATE_SERVICE_TOKEN`) a été appliquée par erreur au **site
de démo** aussi — alors que cette contrainte n'a aucune raison d'exister ici : l'app tutoriel n'est
pas publiée comme paquet npm, rien ne l'empêche de dépendre directement de ce qu'elle veut.

**Solution retenue** : adopter `@ngx-translate/core` dans l'app tutoriel plutôt que de réinventer
un parcours de clés maison. Deux avantages d'un coup :
- Résout la conversion en JSON imbriqué "gratuitement" (format natif de ngx-translate)
- Système déjà éprouvé, déjà dans l'écosystème du projet (la lib le supporte déjà en option)

Note : le service d'i18n **officiel Angular** (`@angular/localize`) ne convient PAS ici — il
fonctionne par build séparé par langue (compilation), pas par changement de langue à la volée dans
le navigateur, alors que la nav a un bouton "English" qui bascule en direct.

- [ ] Installer `@ngx-translate/core` (+ `@ngx-translate/http-loader` si besoin de charger les JSON
      via HTTP) dans `src/package.json` de l'app
- [ ] Convertir `src/public/i18n/fr.json` et `en.json` en structure imbriquée (format natif ngx-translate)
- [ ] Remplacer `LangueService` par `TranslateService` (ngx-translate) dans tous les points d'appel
      (`langue.t('...')` → `translate.instant('...')` ou pipe `| translate`)
- [ ] Supprimer `LangueService` une fois la migration terminée
- [ ] Tester en vrai dans un navigateur (aucun moyen de vérifier par build/test automatisé que les
      traductions s'affichent encore correctement à chaque page)

---

## Bug préexistant — tests `MotsPipe`/`WordsPipe` (espace insécable)

Corrigé le 2026-08-26 : les assertions de `mots.pipe.spec.ts` comparaient avec un espace normal
U+0020 là où `mots.pipe.ts` insère un espace insécable U+00A0 entre le nombre et le mot — distinct
du séparateur de milliers U+202F (`Intl.NumberFormat`), qui lui était déjà correct.
`ng test ngx-parrecrivains` : 161/161 passent.

- [ ] Faire tourner `ng test ngx-parrecrivains` avant chaque publication npm future —
      ce n'était documenté nulle part comme étape obligatoire, seul `ng serve` (validation visuelle)
      l'était dans la constitution (`T-I`)

---

## Outillage dev — détecter le repli silencieux sur la lib npm

Constaté et documenté dans `cmd.md` (§ piège) : en configuration `development` (le `ng serve` par
défaut), si `dist/ngx-parrecrivains/` n'existe pas ou plus, TypeScript retombe silencieusement sur
`node_modules` (la version npm publiée) au lieu de la source locale. Question posée par Maive le
2026-08-26 : le bandeau (`environment.ts`) peut-il détecter ça et avertir correctement ?

**Correction du 2026-08-26** : première réponse trop catégorique ("le bandeau ne peut pas
vérifier"). En fait si, à condition de comparer contre une source externe (le vrai registre npm),
pas en essayant de ré-inspecter après coup le module déjà résolu dans le navigateur (ça, c'est
effectivement figé au moment du build et invérifiable a posteriori côté client).

**Ce qui existe déjà, inutilisé** : la lib exporte `VERSION` (`public-api.ts` →
`lib/version.ts`, un `Version` Angular contenant `'0.4.3'`) — mais l'app tutoriel ne l'importe
nulle part aujourd'hui (`grep` vide dans `src/src/app`).

**Solution en deux couches** :
1. **Garde-fou avant le build** (déterministe) : script Node (même esprit que
   `scripts/enforce-npm-ci.js` côté `parrecrivains`) qui vérifie l'existence de
   `dist/ngx-parrecrivains/package.json` et refuse de démarrer (message clair, sortie non nulle)
   si absent, branché en `prestart`/`prebuild` sur `ng serve`/`ng build` par défaut
   (`development` uniquement — pas `production`, qui doit justement utiliser npm).
2. **Horodatage de build comparé au registre npm réel** (fiable à 100%, décidé par Maive le
   2026-08-26). Comparer juste `VERSION` (semver, "0.4.3") ne suffit pas — deux builds peuvent
   partager le même numéro de version si rien n'a été rebumpé, donnant une fausse impression de
   correspondance sûre. Il faut un identifiant qui change **à chaque build**, peu importe le
   semver — l'équivalent d'un numéro de build CI. Décision : horodatage plutôt qu'un compteur
   incrémental (même garantie, pas de fichier d'état à maintenir, aucun risque de conflit git —
   le temps avance tout seul). Provenance npm/Sigstore écartée : exigerait de publier via GitHub
   Actions, contraire au choix déjà fait d'éviter GitHub Actions sur ce repo.

   Tamponner `new Date().toISOString()` dans `dist/ngx-parrecrivains/package.json` à chaque build
   (`postbuild` ou hook `ng-packagr`) — un build local sera toujours postérieur au build qui a
   servi à la dernière publication npm, sauf si rien n'a été rebuildé depuis (dans ce cas les deux
   horodatages sont strictement égaux — une correspondance ici est une **preuve positive** que
   c'est exactement le même build, pas une coïncidence possible comme avec le semver seul).

   Le bandeau (ou le script de garde-fou avant serve) compare l'horodatage du build résolu
   localement à celui publié sur le registre npm (`https://registry.npmjs.org/ngx-parrecrivains/latest`,
   CORS ouvert pour les paquets publics — ou `npm view ngx-parrecrivains buildTimestamp` si stocké
   comme champ custom du `package.json`) : identique → c'est vraiment la même version testée,
   différent (plus récent en local) → changements locaux non publiés confirmés, sans ambiguïté.

- [ ] Écrire `scripts/check-dist-local.js` — vérifie `dist/ngx-parrecrivains/package.json`,
      message d'erreur explicite si absent (`npx ng build ngx-parrecrivains` à lancer d'abord)
- [ ] Brancher ce script sur `ng serve`/`ng build` par défaut (`development`) sans l'appliquer à
      `production`/`test-public`
- [ ] Ajouter un horodatage de build (`buildTimestamp`) au `package.json` de la lib à chaque
      build — via un script `postbuild` ou un hook `ng-packagr`
- [ ] Faire importer cet horodatage par le composant bandeau, comparer contre le registre npm réel
      (fetch ou script), afficher le résultat de façon non ambiguë en mode `development`

---

## Broutilles

- [ ] Le flux `test-public` → `docs/` → GitHub Pages n'a **jamais été exercé en vrai** : le build et
      le bandeau sont vérifiés localement, mais rien n'a encore été publié dans cet état. La première
      utilisation réelle sera aussi le test du flux.

---

## App tutoriel — mise aux normes des conventions Angular

Le code Angular du site tutoriel (`src/src/`) ne respectait pas les conventions de parrecrivains
au moment du transfert. Confirmé réglé (grep sur `src/src/app`, reconfirmé le 2026-08-26) :
`inject()` partout, `input()`/`output()`, `@if`/`@for`/`@switch`, pas de template inline hors
petits composants partagés, pas de `ngClass`/`ngStyle`, pas de `standalone: true` explicite,
`private readonly` sur les services injectés (sauf signaux exposés au template, volontairement).

- [ ] `signal()`, `computed()` — pas d'audit systématique de la duplication d'état, à revérifier
- [ ] Nommage en français — pas d'audit systématique, à revérifier. Contre-exemple trouvé le
      2026-08-26 : `accueil.ts:104` a une méthode `toggleEtape()` (nom anglais)

---

## Pages de test — corrections post-transfert

Copiées depuis `parrecrivains` dans `src/src/app/tests/`. Fonctionnent avec `ng serve` (path alias).
Nettoyage post-transfert confirmé fait (reconfirmé le 2026-08-26) : bannières "à supprimer avant
publication" retirées (ces pages sont permanentes ici), DI par `inject()` plutôt que `new`, lien
nav ajouté (clé i18n `nav.tests`).

- [ ] Ajouter les pages de test incomplètes manquantes (cas d'utilisation supplémentaires — voir BACKLOG parrecrivains)

---

## révision flux SpecKit complet (v0.1.0–v0.4.0)

Les 4 premiers éléments de la lib ont été produits avec un flux SpecKit réduit (sans `clarify`,
`checklist`, `analyze`) dans le cadre d'un MVP de 7 jours. Maintenant que le flux complet est
obligatoire, faire une passe de révision sur chaque élément.

Pour chaque spec existante (`specs/001` à `specs/004`) :
- [ ] `/speckit-clarify` — identifier les ambiguïtés résiduelles dans la spec
- [ ] `/speckit-checklist` — valider la qualité de la spec
- [ ] `/speckit-analyze` — vérifier la cohérence entre spec, plan et tasks

Ordre suggéré : commencer par `001-manuscript-reader` (le plus complexe) puis
`004-validator-isbn` (le plus récent).

Transféré depuis `parrecrivains/BACKLOG.md` le 2026-08-26 — les specs 001-004 vivent maintenant
ici (migration Phase 4 de `parrecrivains` complétée), la copie côté `parrecrivains` sera
supprimée à la Phase 9 du transfert de lib.

---

## prochaines versions

### V2 — `FormatContenuService` — supprimer le fallback extension
Actuellement `_detecterFichier()` vérifie le MIME d'abord, puis l'extension en fallback.
Le fallback extension peut être trompé par un fichier renommé (virus.exe → virus.pdf).
En V2 : se fier uniquement au MIME et retourner `'inconnu'` si vide.

Cas où le MIME est vide aujourd'hui (raisons du fallback) :
- Glisser-déposer sur Linux — le bureau ne fournit pas toujours le MIME
- Formats rares (ODT, RTF, EPUB) moins bien reconnus selon l'OS et navigateur
- `new File([contenu], 'fichier.pdf')` créé sans type explicite → `type: ""`
- Certains navigateurs mobiles

En V2 : documenter clairement que seuls les fichiers avec MIME reconnu sont acceptés.

### v0.5.0 — `normaliserIsbn()` + Pipe `| isbn` + `IsbnLookupService`
**`normaliserIsbn()`** — retire tirets, espaces, préfixe textuel "ISBN" avant de passer au validator.
**Pipe `| isbn`** — formate pour l'affichage : `9782764633291` → `ISBN 978-2-7646-3329-1`.
**Synchronisation back/front** — ajouter checksum dans Rails (côté `parrecrivains`), vérifier
stockage chiffres purs, partager jeux de tests canoniques.

### v0.5.0 — IsbnLookupService
Complément du validator ISBN (v0.4.0).
Appel à l'API Open Library (gratuite, sans clé, zéro CORS) pour vérifier
qu'un ISBN correspond bien au titre et à l'auteur déclarés.
Utile aussi pour pré-remplir un formulaire à partir d'un ISBN scanné.

- API : `GET https://openlibrary.org/isbn/{isbn}.json`
- Type : `AsyncValidatorFn` ou service séparé avec `HttpClient`
- Séparation claire : validator local (checksum, synchrone) vs lookup (réseau, asynchrone)

- Le backend (`parrecrivains`) devrait toujours utiliser la vérification API pour valider un ISBN.

### V2 — `formater()` multilingue dans `TempsLectureService`
Ajouter un paramètre `langue?: string` pour supporter des abréviations localisées
(cri et autres langues des Premières Nations).
Actuellement "h" et "min" sont universels — suffisant pour fr/en/cr en V1.
Voir `temps-lecture.service.ts` TODO-REVIEW.

Transféré depuis `parrecrivains/BACKLOG.md` le 2026-08-26. Un item obsolète a été retiré au
passage : l'ancienne exigence "prochaine publication doit être 0.5.0 à cause du bump Angular 22"
a été invalidée par l'audit du 2026-08-25 (voir `ngx-parrecrivains — Compatibilité Angular
antérieure` ci-dessus) — la 0.4.3 a finalement couvert Angular 22 en patch, pas en bump mineur.

---

## dette technique — composants lib

### `public/i18n/liseuse/*.json` — fichiers orphelins et désynchronisés
Trouvé le 2026-08-26 en vérifiant le mécanisme de surcharge des traductions (`TraductionService`,
`TRANSLATE_SERVICE_TOKEN` — celui-là fonctionne bien, confirmé). Les vraies traductions de la lib
vivent dans une table codée en dur dans `traduction.ts`, **pas** dans
`public/i18n/liseuse/{fr,en,cr}.json` :
- Ces JSON ne sont référencés nulle part dans le code (`grep` vide)
- Ils ne sont **pas publiés** dans le paquet npm (`ng-package.json` → `assets` ne liste que
  `LICENSE` et `CHANGELOG.md`)
- Ils ont dérivé de la vraie table : `parametres` manquant dans le JSON, `couleur_superposition`
  dit "Couleur de superposition" dans le JSON contre "Couleur" dans `traduction.ts`

À trancher : soit les supprimer (fichiers morts), soit clarifier leur rôle voulu (ex. modèle de
départ à copier pour un hôte qui active la surcharge via `TRANSLATE_SERVICE_TOKEN`) et les
resynchroniser avec `traduction.ts` dans ce cas, avec un README expliquant leur usage.

### `ZoneLectureComponent` — `totalMotsExterne`
Ajouter `totalMotsExterne = input<number | undefined>(undefined)` et
`totalMotsEffectif = computed(() => this.totalMotsExterne() ?? this.totalMots())`.
Permet à l'app hôte de fournir le wordcount depuis une BD ou une API externe
(ex. Google Docs API) au lieu de le calculer localement.
Même pattern que `estimatedReadingTime`.
Voir `zone-lecture.ts` ligne ~72.

### `ZoneLectureComponent` — `addEventListener` natif
`touchend` et `wheel` utilisent `addEventListener` natif avec `{ passive: false }`
car Angular host bindings ne supportent pas cette option.
Solution future : CSS `touch-action` (voir CLAUDE.md conventions).
Voir `zone-lecture.ts` ligne ~181.

### `ChronomètreLectureService` — `tempsActif` readonly
`tempsActif` est exposé en `WritableSignal` public pour que les tests puissent
le manipuler directement (`svc.tempsActif.set(5)`).
Idéalement : `readonly tempsActifLecture = tempsActif.asReadonly()` exposé publiquement,
signal WritableSignal privé.
Voir `chronometre-lecture.ts` ligne ~7.

### `ZoneLectureComponent` — chaîne flex incomplète
Le fix 0.4.1 (`:host` en `flex`, `.vue-native` en `flex: 1`) est partiel. `.zone-contenu`
(`liseuse-manuscrit.scss`) utilise `flex: 1` mais n'établit pas de contexte flex pour ses
enfants — `height: 100%` en chaîne (utilisé par `ngx-zone-lecture`) reste fragile dans certains
contextes hôtes (si un ancêtre côté app hôte n'a pas de hauteur définie, toute la chaîne casse).

**Tenté et annulé le 2026-08-26** : rendre `.zone-contenu` flex (`display: flex; flex-direction:
column`) + `ngx-zone-lecture { flex: 1; min-height: 0; }` sur l'enfant, en théorie correct
(confirmé sur MDN : `flex: 1` ignore la hauteur explicite de l'enfant et distribue tout l'espace
disponible via `flex-grow`, sur l'axe main = hauteur ici puisque le parent est en colonne). En
pratique : régression observée en mode plein écran (marge vide en bas de la liseuse sur fenêtre
haute, disparaît en réduisant la hauteur). Annulé faute de pouvoir déboguer visuellement à
l'aveugle (l'agent n'a pas accès à un navigateur pour ce repo — validation visuelle réservée à
Maive). Pas un bug actif aujourd'hui — la chaîne `height: 100%` fonctionne dans les contextes
hôtes testés (tuto, tests) ; c'est une fragilité pour des hôtes externes non testés. À reprendre
uniquement avec Maive en direct (elle change le CSS, regarde le résultat, itère), pas en
correctif isolé par l'agent.

---

## responsive

### `BarreControlesComponent` — grille mobile
`.panneau` (le panneau ⚙) a une largeur fixe `min(300px, 88%)` — au-dessus de ~341px de largeur
disponible, elle reste toujours à 300px pile, quelle que soit la fenêtre/l'orientation. La grille
`.controles__grille` divise cette largeur en 3 colonnes (`repeat(3, 1fr)`), donc chaque bouton
occupe ~1/3 de 300px, peu importe la taille de fenêtre — sauf sous ce seuil de 341px.

Objectif (précisé par Maive le 2026-08-26) : les boutons ne doivent **jamais changer de taille**
(taille fixe) — c'est le **nombre de colonnes** qui doit s'ajuster à l'espace réellement
disponible, pas l'inverse.

**Deux tentatives annulées le 2026-08-26** faute de pouvoir vérifier visuellement (validation
réservée à Maive) :
1. Media queries par orientation (1 colonne portrait / 2 paysage) — mauvaise interprétation de
   l'objectif : divise la même largeur fixe en moins de colonnes → chaque bouton grossit, l'inverse
   du but recherché.
2. `grid-template-columns: repeat(auto-fit, minmax(85px, 1fr))` — en théorie aligné sur l'objectif
   (colonnes de taille mini fixe, le nombre s'ajuste tout seul), mais Maive rapporte qu'à l'usage
   rien ne change — cohérent avec le fait que `.panneau` reste presque toujours à 300px pile (voir
   plus haut), donc le nombre de colonnes qui "tient" dans cette largeur ne varie jamais dans la
   plage de test habituelle. Pour que `auto-fit` ait un effet visible, il faudrait que la largeur du
   panneau lui-même varie — ce que `min(300px, 88%)` ne fait qu'en dessous de ~341px.

À reprendre avec Maive en direct plutôt qu'en correctif isolé — la vraie question à trancher
d'abord : est-ce que c'est `.panneau` (sa largeur fixe) ou `.controles__grille` (sa règle de
colonnes) qui doit changer pour que l'ajustement soit visible dans les tailles de fenêtre
courantes, pas seulement sous 341px ?

## composants futurs

### `ngx-editeur-manuscrit`
Édition de manuscrit avec Google Docs en mode natif.
Séparé intentionnellement de `ngx-liseuse-manuscrit` pour isoler les restrictions de sécurité côté lecture.
Idée seule, rien à vérifier dans le code. Note : la source d'origine "notes futur.md" citée dans
ce repo n'existe pas ici (fichier resté côté `parrecrivains`) — référence retirée.

### Composants visuels à thématique littéraire
Idées de composants futurs pour enrichir la lib :
- **`ngx-fiche-manuscrit`** — carte d'identité d'un manuscrit (titre, auteur, genre, statut, résumé)
- **`ngx-carte-auteur`** — profil visuel d'un auteur (bio courte, genres, liens)
- **Lettrines à collectionner** — lettrines décoratives illustrées, collectionnable par auteur/livre (exploite le background design graphique)
- **Certifications de compétences** — badge/composant visuel pour les certifications dans le milieu littéraire

Source : `travaux/Proposition_formelle.md` (repo `parrecrivains`) — piste explorée.
Transféré depuis `parrecrivains/BACKLOG.md` le 2026-08-26.

---

## UX — Pied de page contact anti-spam

⚠️ Depuis le 2026-08-10, le bandeau d'environnement occupe le bas de l'écran en `position: fixed`.
Un pied de page contact viendrait s'empiler dessus. À trancher au moment de le construire : soit le
contact entre dans le bandeau, soit le bandeau remonte en haut de page, soit le pied de page défile
normalement sous le bandeau. Ne pas ajouter un deuxième élément fixe en bas sans y penser.


Ajouter un pied de page invitant les visiteurs à contacter Maive pour des commentaires ou problèmes.
Le courriel doit être protégé contre les bots (pas d'adresse en clair dans le HTML).

Options techniques :
- Encodage CSS (`content:` via `::before` / `::after`)
- Formulaire de contact (sans exposer le courriel)
- Adresse obfusquée en JS (dernier recours)
