# Feature Specification : IsbnValidator

**Feature Branch** : `004-validator-isbn`

**Created** : 2026-06-02

**Status** : Draft

---

## User Scenarios & Testing

### User Story 1 — Valider un ISBN dans un formulaire (Priorité : P1)

Un développeur ajoute un champ ISBN dans un formulaire réactif Angular (soumission de manuscrit, fiche d'auteur, etc.). Il veut s'assurer que l'ISBN saisi est mathématiquement correct — pas seulement bien formaté — avant de soumettre au serveur.

**Why this priority** : C'est le cas d'usage central. Un ISBN mal formé peut passer un simple regex mais avoir un chiffre de contrôle invalide, ce qui cause des rejets en aval (bases de données bibliographiques, éditeurs).

**Independent Test** : Ajouter `isbnValidator()` à un `FormControl`. Saisir `9782764633291` (valide) → formulaire valide. Saisir `9782764633290` (checksum incorrect) → erreur `isbnChecksum`. Le champ n'accepte que des chiffres purs — tirets et espaces sont rejetés.

**Acceptance Scenarios** :

1. **Given** un ISBN-13 valide `9782764633291`, **When** validé, **Then** résultat = `null` (valide).
2. **Given** un ISBN-13 avec checksum incorrect `9782764633290`, **When** validé, **Then** erreur `isbnChecksum`.
3. **Given** un ISBN-10 valide `2764633297`, **When** validé, **Then** résultat = `null` (valide).
4. **Given** un ISBN-10 avec X comme dernier chiffre `047191177X`, **When** validé, **Then** résultat = `null` (valide — X vaut 10 dans l'algorithme ISBN-10).
5. **Given** un ISBN-10 avec checksum incorrect `2764633290`, **When** validé, **Then** erreur `isbnChecksum`.
6. **Given** un champ vide ou `null`, **When** validé, **Then** résultat = `null` — la présence est gérée par `Validators.required`, pas par ce validator.
7. **Given** un ISBN-13 avec préfixe invalide `9992764633291`, **When** validé, **Then** erreur `isbnPrefixe`.
8. **Given** une chaîne de longueur incorrecte `12345`, **When** validé, **Then** erreur `isbnFormat`.
9. **Given** un ISBN avec tirets `978-2-7646-3329-1`, **When** validé, **Then** erreur `isbnFormat` — ce validator n'accepte que des chiffres purs.

---

### User Story 2 — Valider la cohérence ISBN / année de publication (Priorité : P2)

Un développeur dispose à la fois de l'ISBN et de l'année de publication dans son formulaire. Il veut alerter l'utilisateur si le format de l'ISBN est anachronique.

**Why this priority** : Amélioration de la qualité des données. La lib parrecrivains gère des manuscrits avec métadonnées — la cohérence ISBN/date évite des erreurs de saisie fréquentes. Reprend la logique du backend Rails.

**Limitation documentée** : `annee` dans `isbnValidator({ annee })` est une valeur **statique** connue au moment de la création du validateur. Pour valider dynamiquement selon un autre champ du formulaire (champ `datePublication`), utiliser un `AbstractControl` au niveau du groupe Angular — ce cas est hors scope de ce validator.

**Independent Test** : `isbnValidator({ annee: 2010 })` + ISBN-10 `2764633297` → erreur `isbnCoherence`. `isbnValidator({ annee: 2006 })` + ISBN-10 → `null` (zone grise, les deux formats sont valides).

**Acceptance Scenarios** :

1. **Given** ISBN-10 + année 2010 (> 2006), **When** validé, **Then** erreur `isbnCoherence` (ISBN-10 n'existe plus depuis 2007).
2. **Given** ISBN-13 + année 2003 (< 2005), **When** validé, **Then** erreur `isbnCoherence` (ISBN-13 n'existait pas avant 2005).
3. **Given** ISBN-10 + année 2006 (zone grise 2005–2006), **When** validé, **Then** `null` — les deux formats coexistaient légalement, aucune erreur.
4. **Given** ISBN-13 + année 2006 (zone grise), **When** validé, **Then** `null` — les deux formats coexistaient légalement.
5. **Given** ISBN-10 + année 2003, **When** validé, **Then** `null` (cohérent).
6. **Given** ISBN-13 + année 2010, **When** validé, **Then** `null` (cohérent).
7. **Given** ISBN valide + aucune année fournie, **When** validé avec `isbnValidator()`, **Then** `null` (aucune vérification de cohérence sans `annee`).

---

### User Story 3 — Utiliser la validation hors formulaire (Priorité : P2)

Un développeur valide un ISBN reçu d'une API ou d'un scan sans passer par un formulaire Angular. Il veut une fonction pure réutilisable indépendamment de ReactiveFormsModule.

**Why this priority** : Étend l'utilité du validator au-delà des formulaires. Utile dans les services, les guards, les traitements batch.

**Independent Test** : `validerIsbn('9782764633291')` → `{ valide: true }`. `validerIsbn('9782764633290')` → `{ valide: false, erreur: 'isbnChecksum' }`.

**Acceptance Scenarios** :

1. **Given** un ISBN valide, **When** `validerIsbn(isbn)`, **Then** `{ valide: true }`.
2. **Given** un ISBN invalide, **When** `validerIsbn(isbn)`, **Then** `{ valide: false, erreur: string }` avec la clé d'erreur précise.
3. **Given** un ISBN + année, **When** `validerIsbn(isbn, annee)`, **Then** inclut la vérification de cohérence dans le résultat.

---

### Edge Cases

- ISBN vide, `null` ou `undefined` → `null` (aucun validator ne rend le champ obligatoire).
- ISBN avec tirets ou espaces → `isbnFormat` (ce validator n'accepte que des chiffres purs).
- ISBN-10 dont le X n'est pas en dernière position → `isbnFormat`.
- ISBN-10 commençant par 978/979 → valide comme ISBN-10 (pas rejeté pour son préfixe).
- Zone grise 2005–2006 : les deux formats sont valides — aucune erreur ni avertissement.
- Année 2007 avec ISBN-10 → `isbnCoherence` (la transition était effective au 1er janvier 2007).

---

## API Publique

### Exports

```
isbnValidator        — ValidatorFn factory (avec options optionnelles)
validerIsbn          — fonction pure de validation hors formulaire
IsbnOptions          — interface des options
IsbnResultat         — interface du résultat de validerIsbn()
ISBN_ERREURS         — constantes des clés d'erreur
```

### `isbnValidator(options?)`

Retourne un `ValidatorFn` Angular compatible `ReactiveFormsModule`.

| Paramètre | Type | Défaut | Description |
|---|---|---|---|
| `options.annee` | `number` | — | Année de publication **statique** pour la vérification de cohérence |

**Clés d'erreur retournées** :

| Clé | Condition |
|---|---|
| `isbnFormat` | Longueur incorrecte, caractères non numériques (tirets/espaces inclus), ou X mal placé |
| `isbnPrefixe` | ISBN-13 ne commençant pas par 978 ou 979 |
| `isbnChecksum` | Chiffre de contrôle mathématiquement incorrect |
| `isbnCoherence` | Format anachronique par rapport à l'année fournie (hors zone grise) |

**Note sur les préfixes** : seuls `978` et `979` sont valides en ISBN-13 selon la norme actuelle. L'ajout d'un nouveau préfixe (hypothétique futur `977`, etc.) nécessiterait une mise à jour de la lib.

### `validerIsbn(isbn, annee?)`

Fonction pure, sans dépendance Angular. Retourne `IsbnResultat` :

```
{ valide: true }
{ valide: false, erreur: keyof typeof ISBN_ERREURS }
```

---

## Requirements

### Functional Requirements

- **FR-001** : Le validator DOIT accepter uniquement des chiffres purs (après suppression éventuelle du contrôle de type) — aucune normalisation de tirets/espaces.
- **FR-002** : Le validator DOIT reconnaître ISBN-10 (10 caractères) et ISBN-13 (13 caractères). Toute autre longueur → `isbnFormat`.
- **FR-003** : Le validator DOIT valider le chiffre de contrôle ISBN-10 (somme pondérée 10→1, modulo 11, dernier caractère peut être X=10).
- **FR-004** : Le validator DOIT valider le chiffre de contrôle ISBN-13 (poids alternés 1 et 3, modulo 10).
- **FR-005** : Le validator DOIT rejeter tout ISBN-13 dont le préfixe n'est pas `978` ou `979` → `isbnPrefixe`.
- **FR-006** : Un champ vide, `null` ou `undefined` DOIT retourner `null`.
- **FR-007** : Avec `annee` fournie, ISBN-10 + année > 2006 → `isbnCoherence`.
- **FR-008** : Avec `annee` fournie, ISBN-13 + année < 2005 → `isbnCoherence`.
- **FR-009** : Zone grise 2005–2006 : les deux formats sont valides → `null`, aucune erreur.
- **FR-010** : `validerIsbn()` DOIT appliquer la même logique que `isbnValidator()` sans dépendance Angular.
- **FR-011** : Les clés d'erreur DOIVENT être exportées comme constantes (`ISBN_ERREURS`).

### Key Entities

- **ISBN normalisé** : chaîne de 10 ou 13 chiffres (sauf dernier caractère ISBN-10 qui peut être X).
- **Chiffre de contrôle** : dernier caractère de l'ISBN, calculé depuis les précédents.
- **Zone grise** : période 2005–2006 où ISBN-10 et ISBN-13 coexistaient — les deux sont valides sans restriction.

---

## Success Criteria

### Measurable Outcomes

- **SC-001** : Tous les ISBN de référence (exemples isbn.org) passent ou échouent conformément à leur statut documenté.
- **SC-002** : Un ISBN avec un seul chiffre modifié est systématiquement détecté comme invalide par le checksum.
- **SC-003** : Le validator est utilisable dans un `FormGroup` Angular avec zéro configuration — un seul import suffit.
- **SC-004** : `validerIsbn()` fonctionne hors contexte Angular sans aucune configuration.
- **SC-005** : L'ensemble des clés d'erreur (FR-001 à FR-011) est couvert par des tests unitaires Vitest.

---

## Éléments hors scope — versions futures

### v0.5.0 — `normaliserIsbn()`

Fonction utilitaire qui nettoie un ISBN avant de le passer au validator :
retire tirets, espaces, préfixe textuel `"ISBN"` et variantes (`"isbn"`, `"Isbn"`).

### v0.5.0 — Pipe `| isbn`

Pipe Angular pour afficher un ISBN formaté typographiquement :
`9782764633291` → `ISBN 978-2-7646-3329-1`.

### Synchronisation back/front — jeux de tests ISBN

Vérifier que le backend Rails (`MetadonneeManuscrit`) et le validator Angular partagent les mêmes cas de référence.
Actions à prévoir :
- Ajouter le checksum dans la validation Rails (le backend ne le valide pas encore).
- Vérifier que le backend stocke uniquement les chiffres purs (sans tirets).
- Partager un fichier de cas de tests canoniques utilisable par les deux stacks.

---

## Assumptions

- La norme ISBN-13 est devenue obligatoire le 1er janvier 2007 — ISBN-10 + année ≥ 2007 est une erreur de saisie.
- La zone grise est 2005–2006 inclus — les deux formats y sont valides sans restriction.
- L'année 2007 est hors zone grise — ISBN-10 + 2007 → `isbnCoherence`.
- Seuls les préfixes `978` et `979` existent en ISBN-13 selon la norme actuelle (ISBN International Agency).
- Ce validator ne vérifie pas l'existence réelle de l'ISBN — c'est le rôle de `IsbnLookupService` (v0.5.0).
- La cohérence avec l'année est optionnelle — la majorité des cas d'usage n'ont pas accès à la date de publication au moment de la saisie.
- Le backend Rails sera mis à jour pour ajouter le checksum après validation de la logique Angular.
