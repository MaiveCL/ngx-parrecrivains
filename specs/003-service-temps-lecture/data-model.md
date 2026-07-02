# Data Model : TempsLectureService

**Feature** : `003-service-temps-lecture` | **Date** : 2026-06-02

---

## Types et constantes

Le service est sans état — aucune entité persistée, aucun signal. Les seules données sont les paramètres d'entrée et les valeurs de retour.

### Constante publique

```
VITESSE_LECTURE_DEFAUT : number = 200
```
Vitesse de lecture adulte en mots par minute. Approximation issue de la littérature anglophone — non validée pour le français. Exportée pour permettre à l'app hôte de s'en référer ou de la surcharger.

### Types d'entrée / sortie

| Identifiant       | Type             | Contraintes                                              |
|---|---|---|
| `nombreMots`      | `number \| null` | Normalisé : `null` → 0, négatif → 0, décimal → `Math.floor` |
| `vitesseMots`     | `number`         | Optionnel. Invalide (≤ 0) → fallback `VITESSE_LECTURE_DEFAUT` |
| `TempsEstimé`     | `number`         | Entier en secondes, ≥ 0                                  |
| `DuréeFormatée`   | `string`         | `"0 min"` / `"X min"` / `"X h MM min"`                  |

---

## Règles de normalisation

### `estimer(nombreMots, vitesseMots?)`

```
si nombreMots == null, undefined, NaN, Infinity ou < 0 → nombreMots = 0
si nombreMots décimal → nombreMots = Math.floor(nombreMots)
si vitesseMots == null ou ≤ 0 → vitesseMots = VITESSE_LECTURE_DEFAUT
résultat = Math.round((nombreMots / vitesseMots) * 60)
```

### `formater(secondes)`

```
si secondes == 0 → "0 min"
totalMinutes = Math.ceil(secondes / 60)   // minimum 1 pour secondes > 0
si totalMinutes < 60 → "X min"
sinon →
  heures = Math.floor(totalMinutes / 60)
  minutesRestantes = totalMinutes % 60
  → "X h MM min"  (minutesRestantes sur 2 chiffres avec zéro initial si < 10)
```

---

## Table de vérification

| Entrée `estimer` | Résultat attendu |
|---|---|
| `(1000)` | `300` s |
| `(1000, 100)` | `600` s |
| `(1000, 400)` | `150` s |
| `(0)` | `0` s |
| `(null)` | `0` s |
| `(undefined)` | `0` s |
| `(NaN)` | `0` s |
| `(Infinity)` | `0` s |
| `(-5)` | `0` s |
| `(1000.7)` | `300` s |
| `(1000, 0)` | `300` s (fallback) |

| Entrée `formater` | Résultat attendu |
|---|---|
| `(0)` | `"0 min"` |
| `(45)` | `"1 min"` |
| `(60)` | `"1 min"` |
| `(300)` | `"5 min"` |
| `(3600)` | `"1 h 00 min"` |
| `(3900)` | `"1 h 05 min"` |
| `(60000)` | `"16 h 40 min"` |
