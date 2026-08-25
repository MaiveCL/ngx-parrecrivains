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

## Compatibilité Angular antérieure — clarifier et documenter

Constaté le 2026-08-25 en creusant pourquoi `parrecrivains` (passé à Angular 22) ne peut pas installer
la lib publiée (`peerDependencies: ^21.2.0`) : la promesse actuelle de compatibilité (« 21+ ») était une
valeur unique choisie par convenance (version du workspace au moment du développement), pas le vrai
plancher technique.

- [x] Audit des imports `@angular/core` dans les 15 fichiers de la lib — plancher réel identifié :
      **Angular 20**, fixé par la dépendance implicite au `standalone: true` par défaut, pas par
      `signal()`/`input()`/`output()` (stables depuis 17/19) ni `inject()` (stable depuis 14).
- [x] `standalone: true` ajouté explicitement aux 5 composants de la lib (`liseuse-manuscrit.ts`,
      `panneau-info.ts`, `barre-controles.ts`, `zone-lecture.ts`, `boite-texte.ts`) — retire la
      dépendance au défaut implicite v20+, plancher théorique redescend à ce que les autres API exigent.
- [x] Convention corrigée aux deux endroits qui la documentaient (`constitution.md` § L-VII et
      `src/.claude/CLAUDE.md`) — sinon la génération de code future aurait dérivé vers l'ancienne règle.
- [x] Test réel effectué le 2026-08-25 : lib rebuild, `npm pack`, installée avec `--legacy-peer-deps`
      dans une app Angular 20 fraîche (`ng new` v20.3.34), `LiseuseManuscritComponent` (composant le plus
      exigeant : signaux, `input.required()`, `output()`, `afterNextRender()`) intégré et `ng build`
      **réussi sans erreur ni avertissement**. Confirme l'audit — pas juste une lecture de code.
- [x] Test réel en Angular 19 (en plus du 20) : `LiseuseManuscritComponent` intégré, `ng build` réussi
      sans erreur — le vrai plancher confirmé est **19**, pas 20. `MotsPipe`/`WordsPipe` avaient le même
      problème de `standalone` implicite que les composants — corrigé aussi.
- [x] Version bumpée à `0.4.3` (patch, pas une rupture d'API — cohérent avec la pratique officielle
      d'Angular pour ses propres peerDependencies) + `peerDependencies` élargi à
      `"^20.0.0 || ^21.0.0 || ^22.0.0"` (les 3 majeures actuellement actives/LTS chez Angular — la 19,
      confirmée fonctionnelle, est délibérément laissée hors de la promesse officielle car déjà EOL
      chez Angular lui-même). Règle le blocage de la Phase 8 dans `parrecrivains/BACKLOG.md`.
- [x] Tableau de compatibilité par élément ajouté au README (FR + EN) : plancher réel, justification,
      méthode de vérification (build réel vs. audit de code) pour chacun des 4 éléments publics. Guide
      `--legacy-peer-deps` ajouté pour utiliser un seul élément « léger » sur une version plus ancienne.
- [x] Même contenu ajouté aux 4 pages tutoriel de l'app (`tuto-liseuse`, `tuto-isbn`, `tuto-mots`,
      `tuto-temps-lecture`), avec lien vers `angular.dev/reference/releases`. Nouvelles clés i18n
      FR/EN seulement — les tutoriels n'ont pas de `cr.json` au niveau app (contrairement à la lib
      elle-même, qui expose fr/en/cr pour l'UI interne de la liseuse).
- [ ] Étendre la convention pour les futurs éléments : chaque nouvelle spec SpecKit doit documenter le
      plancher Angular réel des API utilisées, pour que ce tableau reste à jour sans reprendre un audit
      complet à chaque fois.
- [ ] `parrecrivains` : une fois `0.4.3` publiée sur npm, refaire `npm install ngx-parrecrivains` sans
      `--legacy-peer-deps` (Phase 8 de `parrecrivains/BACKLOG.md`) — devrait passer directement vu
      qu'Angular 22 est maintenant dans la plage `peerDependencies`.

---

## i18n app tutoriel — restructurer en JSON imbriqué

Constaté le 2026-08-25 : `src/public/i18n/fr.json` et `en.json` (192 lignes chacun) utilisent des clés
plates où le point fait partie du nom littéral (`"tuto.liseuse.titre": "..."`), plutôt qu'une hiérarchie
JSON imbriquée (`{ "tuto": { "liseuse": { "titre": "..." } } }`). Vérifié sur `ngx-translate.org` :
l'imbriqué est la convention **officielle et recommandée** par ngx-translate — leur doc déconseille
explicitement de mélanger les deux styles. Les clés ajoutées aujourd'hui (`commun.compat.*`,
`tuto.*.compat.*`) ont été faites en plat pour rester cohérentes avec l'existant — à reprendre en même
temps que le reste.

Volontairement traité comme une phase séparée de la compatibilité Angular ci-dessus, pas mélangé
dedans — pour pouvoir clore cette dernière avant d'en commencer une nouvelle.

- [ ] Convertir `src/public/i18n/fr.json` et `en.json` en structure imbriquée
- [ ] Aucun changement attendu côté appelant (`langue.t('tuto.liseuse.titre')`) — ngx-translate résout
      les chemins pointés contre une hiérarchie imbriquée de la même façon qu'une clé plate ; à confirmer
      quand même avec un test après la conversion
- [ ] Vérifier si `LangueService` (ou l'équivalent) a une logique propre à lui qui suppose des clés
      plates — sinon la conversion est purement mécanique côté JSON

---

## Bug préexistant — tests `MotsPipe`/`WordsPipe` (espace insécable)

Constaté le 2026-08-25 en lançant `ng test ngx-parrecrivains` (jamais fait depuis la migration,
apparemment) : 21 tests échouent sur 161 (140 passent), tous dans `mots.pipe.spec.ts`. Confirmé non lié
aux changements du jour (`standalone: true`) via `git stash` + retest sur le `HEAD` d'avant — même
résultat, donc préexistant.

Cause probable : `mots.pipe.ts` insère un espace insécable **U+00A0** entre le nombre et le mot
(`.replace(' ', '\u00A0')`, empêche le retour à la ligne) — mais les assertions de `mots.pipe.spec.ts`
comparent avec un espace normal **U+0020**. Visuellement identiques dans un terminal/diff, différents en
égalité stricte. À distinguer du séparateur de milliers **U+202F** documenté dans
`specs/002-pipe-mots/spec.md` (celui-là vient de `Intl.NumberFormat` et n'est probablement pas en
cause) — deux caractères différents, ne pas confondre en corrigeant.

- [ ] Corriger les assertions de `mots.pipe.spec.ts` pour utiliser `\u00A0` là où le résultat attendu
      contient la jointure nombre+mot
- [ ] Une fois corrigé, faire tourner `ng test ngx-parrecrivains` avant chaque publication npm future —
      ce n'était documenté nulle part comme étape obligatoire, seul `ng serve` (validation visuelle)
      l'était dans la constitution (`T-I`)

---

## Broutilles

- [ ] `NG8113` à chaque build : `SlotComponent` est importé dans
      `src/src/app/tutos/liseuse/tuto-liseuse.ts:65` mais absent de son template. Retirer l'import
      — ou l'utiliser, si le slot manque à cette page.
- [ ] Le flux `test-public` → `docs/` → GitHub Pages n'a **jamais été exercé en vrai** : le build et
      le bandeau sont vérifiés localement, mais rien n'a encore été publié dans cet état. La première
      utilisation réelle sera aussi le test du flux.

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
