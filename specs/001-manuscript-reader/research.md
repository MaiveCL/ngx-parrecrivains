# Recherche — Liseuse de manuscrit

**Feature** : `001-manuscript-reader` | **Date** : 2026-05-28

---

## 1. Rendu PDF sans dépendance npm

**Décision** : Utiliser `<embed>` (fichier local → blob URL) et `<iframe>` (URL publique).

**Rationale** :
- Tous les navigateurs modernes (Chrome 120+, Firefox 121+, Safari 17+) rendent les PDF nativement via `<embed src="..." type="application/pdf">` ou `<object>`.
- `File` objet → `URL.createObjectURL(file)` → blob URL passée à `<embed src>`. Révoquée via `URL.revokeObjectURL()` dans `ngOnDestroy`.
- URLs Google Docs/OneDrive publiques → `<iframe src>` directement (les deux services autorisent l'embed via CSP propre).
- `pdfjs-dist` ajouterait ~400 Ko au bundle. Incompatible avec la contrainte "tslib uniquement comme dépendance directe".

**Alternatives considérées** :
- `pdfjs-dist` — rejeté (dépendance directe interdite par constitution)
- `<object>` — équivalent à `<embed>`, compatibilité identique, préféré `<embed>` pour la simplicité

---

## 2. Rendu DOCX / ODT / RTF / EPUB

**Décision** : `<iframe>` avec blob URL — rendu best-effort par le navigateur. Message d'erreur localisé si format non rendu.

**Rationale** :
- Aucun navigateur ne rende nativement le DOCX, l'ODT, le RTF ou l'EPUB sans plugin.
- `<iframe src="blob:...">` tente le rendu : le navigateur affiche ce qu'il peut ou propose le téléchargement.
- V1 : ce comportement est acceptable (spec dit « rendu natif ou iframe »). L'application hôte est responsable de fournir un contenu adapté.
- Si `file.type` ou l'extension indique un format non supporté nativement, le composant affiche le message d'erreur `FORMAT_NON_SUPPORTE` (FR-001, FR-005).

**Alternatives considérées** :
- `mammoth.js` (DOCX → HTML) — rejeté (dépendance directe interdite)
- `epub.js` — rejeté (même raison)
- Conversion serveur — hors périmètre composant client

---

## 3. i18n dans une bibliothèque Angular

**Décision** : `@ngx-translate/core` en `peerDependency` optionnelle. `TraductionService` interne avec fallback statique.

**Rationale** :
- Le package.json de la lib liste `@ngx-translate/core ^17` comme `peerDependency` (pas `dependency`). Ne casse pas le tree-shaking ni la contrainte deps.
- `TraductionService` interne fait `inject(TranslateService, { optional: true })` :
  - Si disponible → utilise les clés `liseuse.*` du fichier de l'app hôte
  - Si absent → charge une table statique JSON embarquée (fr/en/cr) directement dans le service
- La lib fournit ses fichiers JSON dans `public/i18n/liseuse/` → copiés en dist via `ng-package.json`. L'app hôte peut les fusionner dans sa config ngx-translate si souhaité.
- Le composant fonctionne sans aucune configuration ngx-translate (SC-007 : install + import suffit).

**Alternatives considérées** :
- `@angular/localize` — non supporté en bibliothèque npm sans étape de compilation complexe
- Hardcoder les strings fr — viole la Constitution II
- Forcer ngx-translate comme dépendance directe — surcharge le bundle des tiers sans ngx-translate

---

## 4. Navigation tactile mobile (swipe)

**Décision** : `touchstart` / `touchend` natifs avec seuil 50px sur l'axe X.

**Rationale** :
- Aucune librairie nécessaire. Les événements touch sont standard et disponibles dans tous les navigateurs mobiles supportés.
- Algorithme : capturer `touchstart.clientX`, calculer `delta = touchend.clientX - startX`. Si `|delta| > 50px` ET `|deltaX| > |deltaY|` → changement de page.
- La condition `|deltaX| > |deltaY|` empêche les faux positifs lors d'un scroll vertical.
- Écouteurs enregistrés sur `ElementRef.nativeElement` via `effect()` ou `afterViewInit`, désenregistrés dans `ngOnDestroy`.

**Alternatives considérées** :
- `HammerJS` — rejeté (dépendance directe interdite)
- `CDK drag` — prévu pour drag-and-drop, non adapté au swipe de pagination
- Pointer Events API — compatible mais moins idiomatique pour mobile V1

---

## 5. Mode plein écran

**Décision** : Superposition CSS (`position: fixed; inset: 0; z-index: 9999`) contrôlée par un signal `pleinEcran`.

**Rationale** :
- L'API Fullscreen native (`requestFullscreen()`) pose des problèmes : requiert un geste utilisateur, sort du flux DOM de l'app, et interfère avec la navigation Angular.
- La superposition CSS couvre tout le viewport de l'app hôte, simule le plein écran sans en avoir les contraintes.
- La spec dit « la liseuse recouvre tout le viewport par-dessus l'interface du site hôte » (US2-5) — compatible avec `position: fixed`.
- Résout aussi le z-index : la liseuse doit être au-dessus des navbars et modales de l'app hôte.

**Alternatives considérées** :
- `requestFullscreen()` — rejeté (comportement navigateur non contrôlable, sort du DOM Angular)
- `CDK Overlay` — surcharge pour un cas simple de fixed positioning

---

## 6. Pagination en mode optimisé

**Décision** : Pagination par hauteur de viewport — scroll par incréments de `clientHeight`.

**Rationale** :
- La zone de lecture a `overflow: hidden; height: 100%`. La "page" = `Math.floor(scrollTop / clientHeight) + 1`.
- Navigation : `scrollTo({ top: (page - 1) * clientHeight, behavior: 'smooth' })`.
- Pas de découpage du DOM HTML — évite la complexité de la segmentation de texte HTML arbitraire.
- Le total de pages = `Math.ceil(scrollHeight / clientHeight)`.
- Ce calcul est recalculé sur `ResizeObserver` (changement de fenêtre) et sur changement de `taillePolicePx` (reflow).

**Alternatives considérées** :
- Découpage du contenu HTML en nœuds DOM par page — rejeté (fragile sur HTML arbitraire, complexité O(n²))
- CSS Columns — rejeté (impossible de paginer proprement sans manipulation DOM complexe)
- Virtualization (`@angular/cdk/scrolling`) — surdimensionné pour ce cas

---

## 7. Chronomètre de lecture active (readingTime)

**Décision** : `setInterval(1000)` + `Page Visibility API` + `IntersectionObserver`.

**Rationale** :
- `document.addEventListener('visibilitychange')` → pause si `document.hidden === true` (onglet caché, fenêtre minimisée).
- `IntersectionObserver` sur `ElementRef.nativeElement` (threshold 0.5) → pause si la liseuse est hors viewport.
- `setInterval` incrémente un `signal<number>` chaque seconde quand les deux conditions sont actives.
- À chaque incrément, le signal est émis via `outputFromObservable` ou `toObservable + effect`.
- Dégradation gracieuse : si `IntersectionObserver` non disponible (très vieux navigateurs), seule la `Visibility API` est utilisée.

**Alternatives considérées** :
- `requestAnimationFrame` — trop précis, consomme des ressources inutilement pour un chronomètre à 1s
- `Date.now()` delta sur chaque focus/blur — plus complexe, moins fiable en mobile

---

## 8. Largeur de colonne typographique

**Décision** : `max-width: 70ch` (desktop/tablette) avec padding mobile pour ~35ch effective.

**Rationale** :
- `ch` CSS unit = largeur du caractère "0" dans la police courante. Pour une police proportionnelle, approxime bien la largeur moyenne d'un caractère (facteur ~0.9).
- `70ch` → environ 65-70 caractères réels par ligne à 18px.
- Mobile (<768px) : `padding-inline: 1rem` sur 320px viewport + `18px` font → ~30-35ch effective. Pas de `max-width` restrictif sur mobile (réduit la lisibilité).
- Le `max-width` est centré via `margin-inline: auto`.

**Alternatives considérées** :
- Valeur en `px` fixe — rejeté (ne s'adapte pas au changement de taille de police)
- `ch` calculé dynamiquement en JS — surcharge inutile, CSS `ch` unit est fait pour ça

---

## 9. Détection du format de contenu

**Décision** : `FormatContenuService` — analyse `string | File | null` → retourne `FormatContenu`.

**Rationale** :
- `null` / chaîne vide → `CONTENU_VIDE`
- `string` débutant par `http` et contenant `docs.google.com` → `url-google-docs`
- `string` débutant par `http` et contenant `onedrive.live.com` ou `1drv.ms` → `url-onedrive`
- `string` contenant des balises HTML → `html`
- `string` sans balises → `texte-brut`
- `File` → analyse de `file.type` (MIME type) + extension du nom
- MIME `application/pdf` ou `.pdf` → `pdf`
- MIME `application/vnd.openxmlformats-officedocument.wordprocessingml.document` ou `.docx` → `docx`
- Idem `.odt`, `.rtf`, `.epub`
- Cas inconnu → `inconnu` → affichage `FORMAT_NON_SUPPORTE`

**Alternatives considérées** :
- Lecture des magic bytes (`FileReader`) — plus précis mais asynchrone, complexifie le flux de chargement
- Délégation à l'app hôte (input `format`) — rejeté pour simplifier l'API consommateur

---

## 10. Comptage de mots et progression

**Décision** : Extraction du texte brut via `DOMParser`, split sur whitespace.

**Rationale** :
- `new DOMParser().parseFromString(html, 'text/html').body.textContent` → texte brut sans balises.
- `texte.trim().split(/\s+/).filter(Boolean).length` → nombre de mots.
- Calculé une fois lors de l'initialisation du contenu (computed signal basé sur `contenu()`).
- La progression = `Math.round((scrollTop / scrollHeight) * 100)` sur l'événement `scroll` du conteneur, throttled à 250ms.

**Alternatives considérées** :
- Comptage de caractères — moins parlant pour les lecteurs
- Comptage côté serveur — hors périmètre composant client
