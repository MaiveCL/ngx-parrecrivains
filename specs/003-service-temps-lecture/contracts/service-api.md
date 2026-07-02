# Contrat API : TempsLectureService

**Feature** : `003-service-temps-lecture` | **Date** : 2026-06-02

---

## Export public

```typescript
import { TempsLectureService, VITESSE_LECTURE_DEFAUT } from 'ngx-parrecrivains';
```

---

## `estimer(nombreMots, vitesseMots?)`

**Signature** : `estimer(nombreMots: number | null, vitesseMots?: number): number`

**Retourne** : Temps estimé en **secondes** (entier ≥ 0).

| Paramètre | Type | Requis | Défaut | Description |
|---|---|---|---|---|
| `nombreMots` | `number \| null` | ✅ | — | Nombre de mots du texte |
| `vitesseMots` | `number` | — | `VITESSE_LECTURE_DEFAUT` (200) | Vitesse de lecture en mots/min |

**Normalisation automatique** :
- `null`, négatif → `0`
- Décimal → `Math.floor` avant calcul
- `vitesseMots` ≤ 0 → fallback `VITESSE_LECTURE_DEFAUT`

**Exemples** :

```typescript
service.estimer(1000)        // → 300
service.estimer(1000, 100)   // → 600
service.estimer(null)        // → 0
service.estimer(1000.7)      // → 300
service.estimer(1000, 0)     // → 300 (fallback)
```

---

## `formater(secondes)`

**Signature** : `formater(secondes: number): string`

**Retourne** : Chaîne prête à afficher.

| Paramètre | Type | Requis | Description |
|---|---|---|---|
| `secondes` | `number` | ✅ | Résultat de `estimer()` ou toute durée en secondes |

**Format de sortie** :

| Condition | Format | Exemple |
|---|---|---|
| `secondes === 0` | `"0 min"` | `formater(0)` → `"0 min"` |
| `0 < secondes < 3600` | `"X min"` | `formater(300)` → `"5 min"` |
| `secondes ≥ 3600` | `"X h MM min"` | `formater(3900)` → `"1 h 05 min"` |

Minimum affiché pour durée non nulle : `"1 min"` (ex. 45 s → `"1 min"`).
Les minutes sont toujours sur 2 chiffres quand précédées d'une heure (`"1 h 05 min"` pas `"1 h 5 min"`).

**Exemples** :

```typescript
service.formater(0)      // → "0 min"
service.formater(45)     // → "1 min"
service.formater(300)    // → "5 min"
service.formater(3900)   // → "1 h 05 min"
service.formater(60000)  // → "16 h 40 min"
```

---

## `VITESSE_LECTURE_DEFAUT`

**Type** : `number` (constante)
**Valeur** : `200`

Vitesse de lecture adulte en mots par minute. Approximation — non validée spécifiquement pour le français. L'app hôte peut s'en référer pour afficher ou surcharger la vitesse.

```typescript
import { VITESSE_LECTURE_DEFAUT } from 'ngx-parrecrivains';
// VITESSE_LECTURE_DEFAUT === 200
```

---

## Garanties du contrat

- Aucune exception levée pour toute valeur d'entrée valide ou invalide.
- Retours déterministes — mêmes entrées = mêmes sorties (pas d'état interne).
- Compatible avec `new TempsLectureService()` sans Angular TestBed (aucune injection requise).
