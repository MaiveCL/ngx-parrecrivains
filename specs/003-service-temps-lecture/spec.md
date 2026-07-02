# Feature Specification : TempsLectureService

**Feature Branch** : `003-service-temps-lecture`

**Created** : 2026-06-02

**Status** : Draft

---

## User Scenarios & Testing

### User Story 1 — Estimer le temps de lecture en secondes (Priorité : P1)

Un développeur dispose du nombre de mots d'un manuscrit et veut savoir combien de minutes il faudra pour le lire. Il interroge le service avec un nombre de mots et reçoit une valeur numérique en secondes, qu'il peut afficher, stocker ou passer à un autre composant.

**Why this priority** : C'est la fonction centrale du service. Sans elle, il n'a pas de raison d'exister. Toutes les autres stories en dépendent.

**Independent Test** : Appeler `estimer(1000)` → obtenir `300` secondes (200 mots/min × 60 s).

**Acceptance Scenarios** :

1. **Given** `1000` mots, **When** `estimer(1000)`, **Then** résultat = `300` secondes.
2. **Given** `0` mots, **When** `estimer(0)`, **Then** résultat = `0` secondes.
3. **Given** une valeur négative ou `null`, **When** `estimer(-5)` ou `estimer(null)`, **Then** résultat = `0` secondes — pas d'exception.
4. **Given** un décimal, **When** `estimer(1000.7)`, **Then** résultat identique à `estimer(1000)` (arrondi vers le bas avant calcul).

---

### User Story 2 — Obtenir une durée formatée prête à afficher (Priorité : P1)

Un développeur affiche le temps de lecture dans l'interface : fiche de manuscrit, page de présentation, panneau d'informations. Il veut une chaîne prête à afficher, sans coder lui-même la logique de formatage.

**Why this priority** : La valeur brute en secondes n'est pas directement affichable. Le formatage est systématiquement nécessaire et mérite d'être encapsulé une fois dans la lib.

**Independent Test** : `formater(300)` → `"5 min"`. `formater(3900)` → `"1 h 05 min"`. `formater(0)` → `"0 min"`.

**Acceptance Scenarios** :

1. **Given** `300` secondes, **When** `formater(300)`, **Then** résultat = `"5 min"`.
2. **Given** `60` secondes, **When** `formater(60)`, **Then** résultat = `"1 min"`.
3. **Given** `3900` secondes (1 h 5 min), **When** `formater(3900)`, **Then** résultat = `"1 h 05 min"`.
4. **Given** `45` secondes (moins d'une minute), **When** `formater(45)`, **Then** résultat = `"1 min"` (minimum affiché — pas de "0 min" pour une durée non nulle).
5. **Given** `0` secondes, **When** `formater(0)`, **Then** résultat = `"0 min"`.
6. **Given** un roman de 200 000 mots estimé à 60 000 s, **When** `formater(60000)`, **Then** résultat = `"16 h 40 min"` — pas d'erreur sur les grandes valeurs.

---

### User Story 3 — Personnaliser la vitesse de lecture (Priorité : P2)

Un public jeunesse lit plus lentement, une lecture universitaire plus rapidement. Le développeur passe une vitesse custom pour obtenir une estimation adaptée à son contexte.

**Why this priority** : La vitesse par défaut couvre la majorité des cas littéraires adultes. La personnalisation est utile mais non bloquante pour le MVP.

**Independent Test** : `estimer(1000, 100)` → `600` secondes. `estimer(1000, 400)` → `150` secondes.

**Acceptance Scenarios** :

1. **Given** `1000` mots à 100 mots/min, **When** `estimer(1000, 100)`, **Then** résultat = `600` secondes.
2. **Given** `1000` mots à 400 mots/min, **When** `estimer(1000, 400)`, **Then** résultat = `150` secondes.
3. **Given** une vitesse invalide (`0` ou négative), **When** `estimer(1000, 0)`, **Then** fallback sur `VITESSE_LECTURE_DEFAUT` — pas d'exception.

---

### Edge Cases

- `null`, `undefined`, `NaN`, `Infinity`, négatif → traités comme `0` dans `estimer()`.
- Décimal → `Math.floor` avant calcul.
- Vitesse `0` ou négative → fallback `VITESSE_LECTURE_DEFAUT`.
- Durée entre 1 et 59 secondes → `formater()` retourne `"1 min"`.
- Durée exactement `0` → `formater()` retourne `"0 min"`.
- Grande valeur (ex. 200 000 mots) → fonctionne sans erreur.

---

## API Publique

### Nom d'export

```
TempsLectureService
```

### Méthodes

| Méthode | Signature | Description |
|---|---|---|
| `estimer` | `(nombreMots: number \| null, vitesseMots?: number) → number` | Retourne le temps estimé en **secondes**. |
| `formater` | `(secondes: number) → string` | Retourne une chaîne formatée (`"5 min"`, `"1 h 05 min"`). Pas de paramètre langue — le format est universel. |

### Constante exportée

| Constante | Valeur | Description |
|---|---|---|
| `VITESSE_LECTURE_DEFAUT` | `200` | Approximation de la vitesse de lecture adulte en mots par minute. Valeur documentée pour l'anglais — non validée spécifiquement pour le français. L'app hôte peut surcharger via le paramètre `vitesseMots`. |

### Notes d'intégration

Le service est sans état et autonome. Il ne connaît pas `LiseuseManuscritComponent`. L'app hôte peut choisir de passer `estimer()` à l'input `estimatedReadingTime` de la liseuse — c'est entièrement facultatif et hors scope de ce service.

---

## Requirements

### Functional Requirements

- **FR-001** : `estimer()` DOIT calculer `Math.round((Math.floor(nombreMots) / vitesse) * 60)` secondes.
- **FR-002** : La vitesse par défaut DOIT être `VITESSE_LECTURE_DEFAUT` (200 mots/min).
- **FR-003** : `estimer()` DOIT normaliser les entrées invalides (`null`, négatif, décimal) sans exception.
- **FR-004** : `formater()` DOIT retourner `"X min"` pour les durées inférieures à 1 heure.
- **FR-005** : `formater()` DOIT retourner `"X h MM min"` (minutes sur 2 chiffres) pour les durées d'une heure ou plus.
- **FR-006** : `formater()` DOIT retourner `"1 min"` pour toute durée entre 1 et 59 secondes.
- **FR-007** : `formater()` DOIT retourner `"0 min"` pour `0` secondes.
- **FR-008** : Le service DOIT être sans état — aucun signal, aucune subscription, aucun effet de bord.
- **FR-009** : `VITESSE_LECTURE_DEFAUT` DOIT être exportée comme constante publique.

### Key Entities

- **NombreMots** : entier positif ou nul — longueur d'un texte.
- **VitesseLecture** : entier positif en mots par minute (défaut : `VITESSE_LECTURE_DEFAUT`).
- **TempsEstimé** : entier en secondes, résultat du calcul.
- **DuréeFormatée** : chaîne prête à afficher (`"5 min"`, `"1 h 05 min"`).

---

## Success Criteria

### Measurable Outcomes

- **SC-001** : `estimer(1000)` retourne exactement `300` secondes avec la vitesse par défaut.
- **SC-002** : `formater(3900)` retourne `"1 h 05 min"`.
- **SC-003** : Toute valeur d'entrée invalide est traitée sans exception.
- **SC-004** : Le service est importable et utilisable sans aucune configuration — pas de `providers`, pas de module, pas de token.
- **SC-005** : L'ensemble des cas des FR-001 à FR-009 est couvert par des tests unitaires Vitest.

---

## Assumptions

- `VITESSE_LECTURE_DEFAUT = 200` mots/min est une approximation issue de la littérature anglophone — non validée spécifiquement pour le français. Elle est exposée comme constante publique pour permettre à l'app hôte de surcharger selon son contexte.
- Le format `"h"` / `"min"` est suffisamment universel pour fr/en/cr — aucun paramètre de langue requis dans `formater()`.
- La précision à la seconde n'est pas affichée — l'arrondi à la minute est suffisant pour une estimation de temps de lecture.
- Les durées supérieures à 99 heures sont hors scope (aucun manuscrit littéraire raisonnable ne les atteint à 200 mots/min).
