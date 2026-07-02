# Tasks : Liseuse de manuscrit (ngx-manuscript-reader)

**Feature Branch** : `001-manuscript-reader`
**Input** : `specs/001-manuscript-reader/`
**Bibliothèque** : `src/frontend/projects/ngx-parrecrivains/` (v0.1.0 → v0.2.0)

> **Modifications manuelles intégrées** : `ConfigLecture` inclut `largeurColonneCh` (min 45, max 90, défaut 70) — data-model.md mis à jour. Input `config` de type `Partial<ConfigLecture>` — confirmé dans contracts/composant-api.md.

## Format : `[ID] [P?] [Story] Description — chemin/fichier`

- **[P]** : Exécutable en parallèle (fichiers différents, aucune dépendance entre ces tâches)
- **[USn]** : User story concernée
- Chemin de base lib : `src/frontend/projects/ngx-parrecrivains/src/lib/liseuse-manuscrit/`

---

## Phase 1 : Setup (Infrastructure partagée)

**Objectif** : Structure de répertoires, types TypeScript et fichiers i18n

- [X] T001 Créer la structure de répertoires lib/liseuse-manuscrit/{composants/{panneau-info/,barre-controles/,zone-lecture/},services/} et public/i18n/liseuse/ dans src/frontend/projects/ngx-parrecrivains/
- [X] T002 [P] Créer src/frontend/projects/ngx-parrecrivains/src/lib/types/liseuse.types.ts — FormatContenu (union : 'texte-brut' | 'html' | 'pdf' | 'docx' | 'odt' | 'rtf' | 'epub' | 'url-google-docs' | 'url-onedrive' | 'inconnu'), ModeAffichage ('optimise' | 'natif'), ConfigLecture (taillePolicePx 16–24 défaut 18, interligne 1.4–1.8 défaut 1.6, largeurColonneCh 45–90 défaut 70, modeNuit, brightness/contrast/sepia, superpositionOpacite/Couleur, niveauZoom 0.5–2.0, modePagination, pleinEcran, panneauInfoVisible), EtatLecture, ErreurLiseuse, CodeErreurLiseuse, LangueSupported, CONFIG_LECTURE_DEFAUT, LANGUES_SUPPORTEES, LANGUE_DEFAUT
- [X] T003 [P] Créer src/frontend/projects/ngx-parrecrivains/public/i18n/liseuse/fr.json — clés : liseuse.panneau.{titre,fermer}, liseuse.controles.{mode_nuit,taille_police,interligne,largeur_colonne,luminosite,contraste,sepia,superposition,zoom,plein_ecran,quitter_plein_ecran,pagination,page,page_sur,precedent,suivant}, liseuse.info.{mots,temps_estime,temps_actif,progression}, liseuse.erreur.{format_non_supporte,contenu_vide,acces_prive}
- [X] T004 [P] Créer src/frontend/projects/ngx-parrecrivains/public/i18n/liseuse/en.json — mêmes clés que fr.json en anglais
- [X] T005 [P] Créer src/frontend/projects/ngx-parrecrivains/public/i18n/liseuse/cr.json — mêmes clés en cri (translittération syllabique ou approximation phonétique si texte non disponible)

---

## Phase 2 : Fondation (Prérequis bloquants)

**Objectif** : Services internes partagés par tous les sous-composants

⚠️ **CRITIQUE** : Aucune user story ne peut démarrer avant la complétion de cette phase

- [X] T006 [P] Créer src/frontend/projects/ngx-parrecrivains/src/lib/liseuse-manuscrit/services/format-contenu.ts — FormatContenuService injectable ; méthode detecter(contenu: string | File | null): FormatContenu ; logique chaîne : URL contenant 'docs.google.com' → 'url-google-docs' (+ transformer /edit en /preview — FR-005b), URL contenant 'onedrive.live.com' ou '1drv.ms' → 'url-onedrive', string avec balises HTML → 'html', string sans balises → 'texte-brut', File par MIME/extension → 'pdf'|'docx'|'odt'|'rtf'|'epub', cas inconnu → 'inconnu'
- [X] T007 [P] Créer src/frontend/projects/ngx-parrecrivains/src/lib/liseuse-manuscrit/services/traduction.ts — TraductionService injectable ; inject(TranslateService, { optional: true }) ; si présent → déléguer à ngx-translate ; si absent → charger table statique depuis public/i18n/liseuse/{fr,en,cr}.json embarquée dans le bundle ; méthode traduire(cle: string, langue: LangueSupported): string avec fallback sur 'fr' si clé absente
- [X] T008 [P] Créer src/frontend/projects/ngx-parrecrivains/src/lib/liseuse-manuscrit/services/config-lecture.ts — ConfigLectureService injectable ; signal writable configCourante: WritableSignal<ConfigLecture> initialisé à CONFIG_LECTURE_DEFAUT ; méthode initialiser(config: Partial<ConfigLecture>): void — fusionner avec CONFIG_LECTURE_DEFAUT ; méthode mettre(partiel: Partial<ConfigLecture>): void avec clamp automatique (taillePolicePx 16–24, interligne 1.4–1.8, largeurColonneCh 45–90, niveauZoom 0.5–2.0, brightness/contrast 0–200, sepia 0–100, superpositionOpacite 0–1)

**Point de contrôle** : Services fondamentaux compilent — implémentation des user stories peut commencer en parallèle

---

## Phase 3 : User Story 1 — Lire un manuscrit dans une interface confortable (Priorité P1) 🎯 MVP

**Objectif** : Afficher un manuscrit (texte brut, HTML, PDF, Google Docs) avec mise en page optimisée pour la lecture longue durée

**Test indépendant** : Passer un string texte brut → texte affiché avec max-width ~70ch sur desktop, ~35ch sur mobile 320px, police 18px, interligne 1.6, aucun élément UI superflu visible

### Tests Vitest — User Story 1

> **NOTE : Écrire ces tests EN PREMIER — ils doivent ÉCHOUER avant l'implémentation**

- [X] T009 [P] [US1] Écrire spec Vitest pour FormatContenuService dans src/frontend/projects/ngx-parrecrivains/src/lib/liseuse-manuscrit/services/format-contenu.spec.ts — cas : 'Bonjour' → 'texte-brut', '<p>Bonjour</p>' → 'html', URL docs.google.com/document/d/X/edit → 'url-google-docs' (vérifier transformation /edit→/preview), URL onedrive.live.com → 'url-onedrive', File(name:'doc.pdf', type:'application/pdf') → 'pdf', File(name:'doc.docx') → 'docx', File(name:'livre.epub') → 'epub', File(name:'data.xlsx') → 'inconnu'
- [X] T010 [P] [US1] Écrire spec Vitest pour ZoneLectureComponent dans src/frontend/projects/ngx-parrecrivains/src/lib/liseuse-manuscrit/composants/zone-lecture/zone-lecture.spec.ts — cas : texte brut affiché dans div avec CSS var --largeur-colonne, HTML affiché via innerHTML, File PDF → présence élément <embed type="application/pdf">, File DOCX → présence <iframe> avec blob URL
- [X] T011 [P] [US1] Écrire spec Vitest pour PanneauInfoComponent dans src/frontend/projects/ngx-parrecrivains/src/lib/liseuse-manuscrit/composants/panneau-info/panneau-info.spec.ts — cas : titre affiché si fourni, auteur affiché si fourni, totalMots affiché, estimatedReadingTime affiché seulement si défini (undefined → absent du DOM)
- [X] T012 [P] [US1] Écrire spec Vitest pour LiseuseManuscritComponent dans src/frontend/projects/ngx-parrecrivains/src/lib/liseuse-manuscrit/liseuse-manuscrit.spec.ts — scénarios US1 : (1) texte brut → élément avec var largeur ~70ch, (2) config par défaut → taillePolicePx=18, interligne=1.6, (3) inputs titre+auteur → présents dans panneau info, (4) File PDF → <embed> dans le DOM, (5) URL Google Docs → <iframe> dans le DOM

### Implémentation — User Story 1

- [X] T013 [P] [US1] Créer src/frontend/projects/ngx-parrecrivains/src/lib/liseuse-manuscrit/composants/zone-lecture/zone-lecture.ts et zone-lecture.html — Standalone ChangeDetectionStrategy.OnPush ; inject(ConfigLectureService) ; inputs : contenu = input.required<string | File | null>(), modeAffichage = input<'optimise' | 'natif'>('optimise') ; en mode optimisé : div avec [innerHTML] sanitisé (DomSanitizer) pour HTML, texte pour string brut ; CSS custom properties appliquées via [style] depuis ConfigLectureService.configCourante()
- [X] T014 [US1] Ajouter mode natif dans zone-lecture.ts et zone-lecture.html — @if modeAffichage()==='natif' : <embed [src]="urlPdf()" type="application/pdf"> pour PDF (File → URL.createObjectURL, revokeObjectURL dans ngOnDestroy), <iframe [src]="urlSafe()"> pour DOCX/ODT/RTF/EPUB (blob URL) et URLs Google Docs/OneDrive ; sanitiser via DomSanitizer.bypassSecurityTrustResourceUrl ; (error) sur iframe → émettre output erreurIframe
- [X] T015 [P] [US1] Créer src/frontend/projects/ngx-parrecrivains/src/lib/liseuse-manuscrit/composants/zone-lecture/zone-lecture.scss — mode optimisé : max-width: var(--largeur-colonne, 70ch), margin-inline: auto, font-size: var(--taille-police, 18px), line-height: var(--interligne, 1.6), padding-inline: 1rem ; mode natif : embed et iframe à width:100%, height:100%, border:none ; responsive : sur écran < 768px supprimer max-width, garder padding 1rem
- [X] T016 [P] [US1] Créer src/frontend/projects/ngx-parrecrivains/src/lib/liseuse-manuscrit/composants/panneau-info/panneau-info.ts et panneau-info.html — Standalone OnPush ; inputs : titre=input<string|undefined>(undefined), auteur=input<string|undefined>(undefined), totalMots=input<number>(0), progressionPourcent=input<number>(0), estimatedReadingTime=input<string|number|undefined>(undefined), tempsLectureActif=input<number>(0), langue=input<LangueSupported>('fr') ; @if estimatedReadingTime() pour affichage conditionnel
- [X] T017 [P] [US1] Créer src/frontend/projects/ngx-parrecrivains/src/lib/liseuse-manuscrit/composants/panneau-info/panneau-info.scss
- [X] T018 [US1] Créer src/frontend/projects/ngx-parrecrivains/src/lib/liseuse-manuscrit/liseuse-manuscrit.ts — Standalone OnPush, sélecteur ngx-liseuse-manuscrit, inject(FormatContenuService), inject(ConfigLectureService) ; inputs : contenu=input.required<string|File|null>(), titre=input<string|undefined>(undefined), auteur=input<string|undefined>(undefined), langue=input<string>('fr'), textSelectable=input<boolean>(true), estimatedReadingTime=input<string|number|undefined>(undefined), config=input<Partial<ConfigLecture>>({}) ; computed configEffective = computed(() => ({...CONFIG_LECTURE_DEFAUT, ...this.config()})) ; computed formatDetecte, computed modeAffichage ; effect(() => ConfigLectureService.initialiser(this.config()))
- [X] T019 [US1] Créer src/frontend/projects/ngx-parrecrivains/src/lib/liseuse-manuscrit/liseuse-manuscrit.html — @if erreurActive() afficher div.erreur-liseuse ; @else : ZoneLectureComponent + @if configEffective().panneauInfoVisible afficher PanneauInfoComponent ; bouton toggle panneau ; host binding [class.no-select]="!textSelectable()", (contextmenu).prevent quand textSelectable()===false
- [X] T020 [US1] Créer src/frontend/projects/ngx-parrecrivains/src/lib/liseuse-manuscrit/liseuse-manuscrit.scss — :host { display: block; position: relative; min-height: 200px }, :host.no-select { user-select: none }, layout flex colonne, .zone-contenu { flex: 1; overflow: hidden }, responsive sans overflow horizontal à 320px

**Point de contrôle** : US1 entièrement testable — texte brut s'affiche, PDF visible, Google Docs en iframe, titre/auteur dans panneau

---

## Phase 4 : User Story 2 — Adapter l'affichage à ses préférences visuelles (Priorité P2)

**Objectif** : Mode nuit, taille de police, filtres CSS, superposition RGBA et plein écran via la barre de contrôles

**Test indépendant** : Activer mode nuit → thème inversé dans les deux modes. Modifier taille police 16–24px → mise à jour immédiate sans rechargement.

### Tests Vitest — User Story 2

> **NOTE : Écrire ces tests EN PREMIER — ils doivent ÉCHOUER avant l'implémentation**

- [X] T021 [P] [US2] Écrire spec Vitest pour ConfigLectureService dans src/frontend/projects/ngx-parrecrivains/src/lib/liseuse-manuscrit/services/config-lecture.spec.ts — cas : mettre({taillePolicePx:10}) → clampé à 16, mettre({taillePolicePx:30}) → clampé à 24, clamp interligne 1.4–1.8, clamp largeurColonneCh 45–90, clamp niveauZoom 0.5–2.0, clamp brightness/contrast 0–200, clamp superpositionOpacite 0–1, initialiser({modeNuit:true}) → fusionne avec CONFIG_LECTURE_DEFAUT
- [X] T022 [P] [US2] Écrire spec Vitest pour BarreControlesComponent dans src/frontend/projects/ngx-parrecrivains/src/lib/liseuse-manuscrit/composants/barre-controles/barre-controles.spec.ts — cas : clic toggle modeNuit → output changerConfig émet {modeNuit:true}, slider taillePolicePx=20 → output changerConfig émet {taillePolicePx:20}, slider brightness=150 → output changerConfig émet {brightness:150}, clic pleinEcran → output changerConfig émet {pleinEcran:true}
- [X] T023 [P] [US2] Ajouter scénarios US2 dans liseuse-manuscrit.spec.ts — (1) mode nuit actif → classe CSS modeNuit sur :host dans les deux modes, (2) taillePolicePx=20 → CSS var --taille-police mis à jour, (3) brightness=150 → [style.filter] contient 'brightness(150%)', (4) superpositionOpacite=0.3 → div.superposition-rgba opacity=0.3, (5) pleinEcran=true → :host a position:fixed

### Implémentation — User Story 2

- [X] T024 [P] [US2] Créer src/frontend/projects/ngx-parrecrivains/src/lib/liseuse-manuscrit/composants/barre-controles/barre-controles.ts et barre-controles.html — Standalone OnPush ; input config=input<ConfigLecture>(CONFIG_LECTURE_DEFAUT), input modeOptimise=input<boolean>(true) ; output changerConfig=output<Partial<ConfigLecture>>() ; contrôles : toggle modeNuit, sliders taillePolicePx/interligne/largeurColonneCh (@if modeOptimise), sliders brightness/contrast/sepia/superpositionOpacite/niveauZoom, select superpositionCouleur, toggle modePagination (@if modeOptimise), toggle pleinEcran, toggle panneauInfoVisible
- [X] T025 [P] [US2] Créer src/frontend/projects/ngx-parrecrivains/src/lib/liseuse-manuscrit/composants/barre-controles/barre-controles.scss
- [X] T026 [US2] Intégrer BarreControlesComponent dans liseuse-manuscrit.ts et liseuse-manuscrit.html — ajouter import BarreControlesComponent dans les imports du composant ; (changerConfig) → ConfigLectureService.mettre($event) ; passer [config]="configCourante()" et [modeOptimise]="modeAffichage()==='optimise'"
- [X] T027 [US2] Appliquer filtres CSS et superposition dans liseuse-manuscrit.html et liseuse-manuscrit.scss — sur .zone-contenu : [style.filter]="cssFiltre()" avec computed cssFiltre = 'brightness(x%) contrast(x%) sepia(x%)' ; div.superposition-rgba avec [style.backgroundColor] et [style.opacity] issus de configCourante() ; [class.mode-nuit] sur :host
- [X] T028 [US2] Implémenter plein écran CSS dans liseuse-manuscrit.ts et liseuse-manuscrit.scss — [class.plein-ecran] binding sur configCourante().pleinEcran ; :host.plein-ecran { position: fixed; inset: 0; z-index: 9999; overflow: auto }

**Point de contrôle** : US1 + US2 testables — contrôles visuels actifs, mode nuit dans les deux modes d'affichage

---

## Phase 5 : User Story 5 — Gérer les cas d'erreur avec clarté (Priorité P2)

**Objectif** : Messages d'erreur localisés pour format non supporté, contenu vide, document privé et langue non supportée

**Test indépendant** : Passer un File .xlsx → message localisé 'Format non supporté' visible (pas d'écran blanc)

### Tests Vitest — User Story 5

> **NOTE : Écrire ces tests EN PREMIER — ils doivent ÉCHOUER avant l'implémentation**

- [X] T029 [P] [US5] Ajouter cas d'erreur dans format-contenu.spec.ts — cas : null géré au niveau composant (signal erreurActive), '' géré au niveau composant, File(size:0) → composant doit détecter CONTENU_VIDE, File('data.xlsx') → FormatContenuService retourne 'inconnu', File('archive.zip') → 'inconnu'
- [X] T030 [P] [US5] Ajouter scénarios US5 dans liseuse-manuscrit.spec.ts — (1) contenu=null → div.erreur-liseuse visible avec texte 'Aucun manuscrit', (2) File(.xlsx) → div.erreur-liseuse avec texte 'Format non supporté', (3) erreurIframe émise → div.erreur-liseuse avec texte 'Document privé', (4) langue='es' → composant affiche texte en français sans erreur console

### Implémentation — User Story 5

- [X] T031 [P] [US5] Ajouter template d'erreur dans liseuse-manuscrit.html — @if erreurActive() : div.erreur-liseuse[role="alert"] affichant TraductionService.traduire(erreurActive()!.messageI18nKey, langueActive()) ; icône d'avertissement et message centré
- [X] T032 [US5] Implémenter computed erreurActive dans liseuse-manuscrit.ts — Signal<ErreurLiseuse | null> : si contenu()===null || (typeof contenu()==='string' && contenu()==='' ) || (contenu() instanceof File && contenu().size===0) → {code:'CONTENU_VIDE', messageI18nKey:'liseuse.erreur.contenu_vide'} ; si formatDetecte()==='inconnu' → {code:'FORMAT_NON_SUPPORTE', messageI18nKey:'liseuse.erreur.format_non_supporte'} ; signal erreurIframe writable pour ACCES_PRIVE depuis l'event handler (error) de l'iframe
- [X] T033 [P] [US5] Implémenter computed langueActive dans liseuse-manuscrit.ts — computed langueActive: LangueSupported = LANGUES_SUPPORTEES.includes(langue() as LangueSupported) ? langue() as LangueSupported : LANGUE_DEFAUT ; utiliser langueActive() dans tous les appels TraductionService.traduire()
- [X] T034 [US5] Styliser l'affichage d'erreur dans liseuse-manuscrit.scss — .erreur-liseuse { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:120px; padding:2rem; text-align:center } ; responsive 320px

**Point de contrôle** : US1 + US2 + US5 testables — aucun écran blanc, messages localisés fr/en/cr

---

## Phase 6 : User Story 3 — Naviguer naturellement selon son appareil (Priorité P3)

**Objectif** : Swipe horizontal mobile, roulette souris, flèches de navigation et toggle panneau d'informations

**Test indépendant** : Simuler touchend avec delta > 50px axe X → vérifier changement de page. Wheel event en mode pagination → vérifier changement de page.

### Tests Vitest — User Story 3

> **NOTE : Écrire ces tests EN PREMIER — ils doivent ÉCHOUER avant l'implémentation**

- [X] T035 [P] [US3] Ajouter cas navigation dans zone-lecture.spec.ts — touchend delta +60px → output pageChangee émis +1, touchend delta -60px → output pageChangee émis -1, touchend delta 20px → aucune émission, touchend |deltaY|>|deltaX| → aucune émission (scroll vertical), wheel(deltaY>0) en modePagination=true → pageChangee +1, wheel en modePagination=false → pas d'émission pageChangee
- [X] T036 [P] [US3] Ajouter scénarios US3 dans liseuse-manuscrit.spec.ts — (1) swipe gauche sur mobile → page suivante, (2) wheel en mode pagination → page change, (3) clic flèche suivant → pageActuelle+1 et affichage mis à jour, (4) clic toggle panneau → panneauInfoVisible bascule sans affecter la zone de lecture

### Implémentation — User Story 3

- [X] T037 [P] [US3] Implémenter mode pagination dans zone-lecture.ts — signal pageActuelle=signal<number>(1), computed totalPages=computed(()=>Math.ceil(el.scrollHeight/el.clientHeight)||1) ; méthode allerPage(n:number) : pageActuelle.set(clamp(n,1,totalPages())), scrollTo({top:(n-1)*clientHeight,behavior:'smooth'}) ; ResizeObserver sur nativeElement → recalculer totalPages, clamp pageActuelle ; output pageChangee=output<{page:number,total:number}>() émis après chaque changement
- [X] T038 [US3] Implémenter swipe mobile dans zone-lecture.ts — addEventListener 'touchstart' (passive:true) → capturer touchStartX et touchStartY ; addEventListener 'touchend' → delta=endX-startX, si |delta|>50 ET |deltaX|>|deltaY| → allerPage(delta<0 ? pageActuelle+1 : pageActuelle-1) ; désenregistrer dans ngOnDestroy
- [X] T039 [P] [US3] Implémenter navigation roulette dans zone-lecture.ts — addEventListener 'wheel' ; si modePagination() : event.preventDefault(), deltaY>0→allerPage(+1), deltaY<0→allerPage(-1) ; si non : laisser scroll natif
- [X] T040 [P] [US3] Ajouter boutons navigation dans barre-controles.ts et barre-controles.html — inputs pageActuelle=input<number>(1), totalPages=input<number>(1) ; output changerPage=output<number>() ; bouton précédent [disabled]="pageActuelle()===1", bouton suivant [disabled]="pageActuelle()===totalPages()", affichage "{{ pageActuelle() }} / {{ totalPages() }}"
- [X] T041 [US3] Connecter navigation dans liseuse-manuscrit.ts et liseuse-manuscrit.html — signals pageActuelle/totalPages dans le composant principal ; (pageChangee) de ZoneLecture → mettre à jour ces signals ; [pageActuelle]/[totalPages] vers BarreControles ; (changerPage) de BarreControles → ZoneLecture.allerPage() via ViewChild ou signal

**Point de contrôle** : US1 + US2 + US5 + US3 testables — navigation swipe, roulette et flèches fonctionnelles

---

## Phase 7 : User Story 4 — Suivre sa progression de lecture (Priorité P3)

**Objectif** : Progression (%), totalMots, tempsEstimé si fourni, temps réel actif mesuré. Outputs progressionLecture et readingTime vers l'app hôte.

**Test indépendant** : Simuler scroll → progressionPourcent s'incrémente, output progressionLecture émis vers le parent.

### Tests Vitest — User Story 4

> **NOTE : Écrire ces tests EN PREMIER — ils doivent ÉCHOUER avant l'implémentation**

- [X] T042 [P] [US4] Écrire spec Vitest pour ChronomètreLectureService dans src/frontend/projects/ngx-parrecrivains/src/lib/liseuse-manuscrit/services/chronometre-lecture.spec.ts — cas : demarrer() → tempsActif s'incrémente avec fake timers, pause si document.hidden=true (visibilitychange), reprise si document.hidden=false, pause si IntersectionObserver ratio<0.5, dégradation gracieuse si 'IntersectionObserver' absent de window (seule Visibility API active)
- [X] T043 [P] [US4] Ajouter scénarios US4 dans liseuse-manuscrit.spec.ts — (1) scroll → progressionPourcent > 0, output progressionLecture émis, (2) estimatedReadingTime='45 min' → affiché dans panneau info, (3) estimatedReadingTime=undefined → champ absent du DOM, (4) document.hidden=true → readingTime ne s'incrémente plus, (5) scroll jusqu'en bas → progressionLecture émet valeur proche de 100

### Implémentation — User Story 4

- [X] T044 [P] [US4] Créer src/frontend/projects/ngx-parrecrivains/src/lib/liseuse-manuscrit/services/chronometre-lecture.ts — ChronomètreLectureService injectable ; inject(ElementRef) ; signal<number> tempsActif=signal(0) ; boolean actif piloté par Page Visibility API (document.addEventListener 'visibilitychange') ET IntersectionObserver sur nativeElement (threshold:0.5) ; setInterval(1000) incrémente tempsActif si actif ; if(!('IntersectionObserver' in window)) → seule Visibility API ; ngOnDestroy : clearInterval, observer.disconnect()
- [X] T045 [P] [US4] Implémenter tracking progression dans zone-lecture.ts — addEventListener 'scroll' avec throttle 250ms maison (lastEmit timestamp) ; calcul : Math.round((el.scrollTop/(el.scrollHeight-el.clientHeight||1))*100) ; signal progressionPourcent=signal<number>(0) ; output progressionChange=output<number>()
- [X] T046 [P] [US4] Implémenter comptage mots dans zone-lecture.ts — computed totalMots=computed(()=>new DOMParser().parseFromString(typeof contenu()==='string'?contenu() as string:'','text/html').body.textContent?.trim().split(/\s+/).filter(Boolean).length??0) ; output totalMotsChange=output<number>()
- [X] T047 [US4] Câbler outputs progressionLecture et readingTime dans liseuse-manuscrit.ts — progressionLecture=output<number>(), readingTime=output<number>() ; inject(ChronomètreLectureService) ; effect(()=>{ const p=zoneRef.progressionPourcent(); progressionLecture.emit(p) }) ; effect(()=>{ readingTime.emit(chronometreService.tempsActif()) })
- [X] T048 [US4] Mettre à jour panneau-info.ts et panneau-info.html dans src/frontend/projects/ngx-parrecrivains/src/lib/liseuse-manuscrit/composants/panneau-info/ — afficher totalMots, progressionPourcent (barre + %), tempsLectureActif formaté en mm:ss, @if estimatedReadingTime() section temps estimé

**Point de contrôle** : Toutes les user stories testables — progression, temps réel, outputs émis vers l'app hôte

---

## Phase 8 : Polish et préoccupations transversales

**Objectif** : Exports publics, versionnage, CHANGELOG, README et validation quickstart

- [X] T049 [P] Mettre à jour src/frontend/projects/ngx-parrecrivains/src/public-api.ts — export { LiseuseManuscritComponent } ; export type { FormatContenu, ModeAffichage, ConfigLecture, EtatLecture, ErreurLiseuse, CodeErreurLiseuse, LangueSupported } ; export { CONFIG_LECTURE_DEFAUT, LANGUES_SUPPORTEES, LANGUE_DEFAUT }
- [X] T050 [P] — IGNORÉ : 0.1.0 est la première publication, aucun bump requis
- [X] T051 [P] Créer src/frontend/projects/ngx-parrecrivains/CHANGELOG.md — entrée v0.2.0 (2026-05-28) : ajout LiseuseManuscritComponent (sélecteur ngx-liseuse-manuscrit) avec US1–US5, types exportés, 3 langues i18n
- [X] T052 Valider les 6 scénarios de quickstart.md — Cas 1 texte minimal, Cas 2 HTML+métadonnées, Cas 3 config initiale Partial<ConfigLecture>, Cas 4 PDF, Cas 5 URL Google Docs, Cas 6 progression avec outputs progressionLecture et readingTime
- [X] T053 [P] Vérifier package.json de la lib dans src/frontend/projects/ngx-parrecrivains/package.json — aucune dépendance directe ajoutée au-delà de tslib (peerDependencies Angular + ngx-translate autorisées)
- [X] T054 [P] Vérifier responsive 320px — inspecter liseuse-manuscrit.scss et zone-lecture.scss pour absence d'overflow horizontal, padding minimal 1rem, max-width sans restriction sur mobile
- [ ] T055 Mettre à jour src/frontend/projects/ngx-parrecrivains/README.md — la section `LiseuseManuscritComponent` est déjà présente (fr + en) ; vérifier qu'elle est complète et à jour avec tous les inputs/outputs actuels

---

## Dépendances et ordre d'exécution

### Dépendances entre phases

- **Setup (Phase 1)** : Aucune dépendance — démarre immédiatement
- **Fondation (Phase 2)** : Dépend de T001+T002 — **BLOQUE toutes les user stories**
- **US1 (Phase 3)** : Dépend de la Phase 2 — point d'entrée MVP
- **US2 (Phase 4)** : Dépend de la Phase 2 — intègre composants US1
- **US5 (Phase 5)** : Dépend de la Phase 2 — complète US1 (même composant)
- **US3 (Phase 6)** : Dépend de la Phase 2 — étend ZoneLectureComponent (US1)
- **US4 (Phase 7)** : Dépend de la Phase 2 — ajoute ChronomètreLectureService, étend les outputs
- **Polish (Phase 8)** : Dépend de toutes les stories désirées

### Dépendances au sein des user stories

1. Tests Vitest (écrits en TDD — doivent **ÉCHOUER** avant implémentation)
2. Composants/services indépendants en parallèle
3. Composant principal (dépend des sous-composants)
4. Template HTML (dépend du TypeScript)
5. Styles SCSS

### Opportunités de parallélisme

| Phase | Tâches parallélisables |
|---|---|
| Phase 1 | T002, T003, T004, T005 (après T001) |
| Phase 2 | T006, T007, T008 (tous simultanément) |
| Phase 3 | Tests T009–T012 ; Impl T013+T015+T016+T017 |
| Phase 4 | Tests T021–T023 ; Impl T024+T025 |
| Phase 5 | Tests T029–T030 ; Impl T031+T033 |
| Phase 6 | Tests T035–T036 ; Impl T037+T039+T040 |
| Phase 7 | Tests T042–T043 ; Impl T044+T045+T046 |
| Phase 8 | T049, T050, T051, T053, T054 |

---

## Exemples de parallélisme par user story

### User Story 1 (Phase 3) — MVP

```bash
# Étape 1 — Tests en parallèle (TDD, doivent échouer)
T009: spec FormatContenuService        → format-contenu.spec.ts
T010: spec ZoneLectureComponent        → zone-lecture.spec.ts
T011: spec PanneauInfoComponent        → panneau-info.spec.ts
T012: spec LiseuseManuscritComponent   → liseuse-manuscrit.spec.ts

# Étape 2 — Composants indépendants en parallèle
T013: ZoneLectureComponent mode optimisé  → zone-lecture.ts + .html
T015: ZoneLectureComponent styles         → zone-lecture.scss
T016: PanneauInfoComponent                → panneau-info.ts + .html
T017: PanneauInfoComponent styles         → panneau-info.scss

# Étape 3 — Mode natif (dépend de T013)
T014: ZoneLectureComponent mode natif  → zone-lecture.ts + .html (extension)

# Étape 4 — Composant principal (dépend de T013, T014, T016)
T018: LiseuseManuscritComponent TS     → liseuse-manuscrit.ts
T019: LiseuseManuscritComponent HTML   → liseuse-manuscrit.html
T020: LiseuseManuscritComponent SCSS   → liseuse-manuscrit.scss
```

### User Story 4 (Phase 7)

```bash
# Étape 1 — Tests en parallèle
T042: spec ChronomètreLectureService   → chronometre-lecture.spec.ts
T043: spec LiseuseManuscritComponent   → liseuse-manuscrit.spec.ts (US4 ajouts)

# Étape 2 — Implémentation parallèle
T044: ChronomètreLectureService        → chronometre-lecture.ts
T045: Progression tracking             → zone-lecture.ts (extension)
T046: Comptage mots                    → zone-lecture.ts (extension, après T045)

# Étape 3 — Assemblage (dépend de T044, T045)
T047: Outputs dans LiseuseManuscrit    → liseuse-manuscrit.ts (extension)
T048: Mise à jour PanneauInfo          → panneau-info.ts + .html (extension)
```

---

## Stratégie d'implémentation

### MVP minimal (User Story 1 uniquement) — 20 tâches

1. Compléter Phase 1 : Setup (T001–T005)
2. Compléter Phase 2 : Fondation (T006–T008) — CRITIQUE
3. Compléter Phase 3 : User Story 1 (T009–T020)
4. **ARRÊTER ET VALIDER** : tester US1 indépendamment
5. Livrer / démontrer si prêt

### Livraison incrémentale

| Étape | Phases | Stories livrées | Valeur |
|---|---|---|---|
| 1 | 1–3 | US1 | MVP — lecture texte, PDF, Google Docs |
| 2 | +4 | US1+US2 | Confort visuel — mode nuit, filtres |
| 3 | +5 | +US5 | Robustesse — gestion erreurs |
| 4 | +6 | +US3 | Navigation — swipe, roulette |
| 5 | +7+8 | +US4 | Suivi — progression, temps réel |

---

## Notes

- `[P]` = fichiers différents, aucune dépendance — parallélisable
- `[USn]` = traceabilité vers la user story dans spec.md
- Tests Vitest doivent **ÉCHOUER** avant l'implémentation (TDD)
- Valider quickstart.md à chaque point de contrôle intermédiaire
- **Contrainte bibliothèque** : zéro dépendance directe au-delà de tslib — vérifier T053 avant release
- **Contrainte responsive** : min 320px sans overflow — vérifier T054 avant release
- **Contrainte TypeScript** : strict, zéro `any`, `inject()` exclusivement (pas de constructeur DI)
