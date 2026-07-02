# Data Model : IsbnValidator

**Feature** : `004-validator-isbn` | **Date** : 2026-06-02

---

## Types et constantes

### `ISBN_ERREURS`

```
ISBN_ERREURS.FORMAT      = 'isbnFormat'
ISBN_ERREURS.PREFIXE     = 'isbnPrefixe'
ISBN_ERREURS.CHECKSUM    = 'isbnChecksum'
ISBN_ERREURS.COHERENCE   = 'isbnCoherence'
```

### `IsbnOptions`

```
annee?: number    — Année de publication statique pour la cohérence format/date
```

### `IsbnResultat`

```
{ valide: true }
{ valide: false, erreur: 'isbnFormat' | 'isbnPrefixe' | 'isbnChecksum' | 'isbnCoherence' }
```

---

## Règles de normalisation et validation

### Étapes dans l'ordre (pour tout ISBN entrant)

```
1. Vide / null / undefined          → valide (null) — laisser required gérer
2. Longueur ≠ 10 et ≠ 13           → isbnFormat
3. Si longueur 10 :
     - Caractères 1-9 non numériques → isbnFormat
     - Dernier caractère ∉ {0-9, X, x} → isbnFormat
     - Checksum ISBN-10 ≠ 0 mod 11  → isbnChecksum
4. Si longueur 13 :
     - Tous caractères non numériques → isbnFormat
     - Préfixe ∉ {978, 979}          → isbnPrefixe
     - Checksum ISBN-13 ≠ 0 mod 10   → isbnChecksum
5. Si annee fournie :
     - ISBN-10 ET annee > 2006       → isbnCoherence
     - ISBN-13 ET annee < 2005       → isbnCoherence
     - Zone grise (2005-2006)        → null (valide)
```

### Algorithme checksum ISBN-10

```
somme = d₁×10 + d₂×9 + ... + d₉×2 + d₁₀×1
        (d₁₀ = 10 si X ou x)
valide = somme mod 11 === 0
```

### Algorithme checksum ISBN-13

```
somme = d₁×1 + d₂×3 + d₃×1 + d₄×3 + ... + d₁₂×3 + d₁₃×1
valide = somme mod 10 === 0
```

---

## Table de vérification

| Entrée | Résultat attendu | Raison |
|---|---|---|
| `''` / `null` | `null` | Champ vide |
| `'9780306406157'` | `null` | ISBN-13 valide (somme=100, 100%10=0) |
| `'9780306406158'` | `isbnChecksum` | Checksum incorrect |
| `'2764633297'` | `null` | ISBN-10 valide |
| `'047191177X'` | `null` | ISBN-10 valide avec X |
| `'2764633290'` | `isbnChecksum` | Checksum incorrect |
| `'9992764633291'` | `isbnPrefixe` | Préfixe 999 invalide |
| `'12345'` | `isbnFormat` | Longueur incorrecte |
| `'978-2-7646-3329-1'` | `isbnFormat` | Contient des tirets |
| `'978 2 7646 3329 1'` | `isbnFormat` | Contient des espaces |
| ISBN-10 + annee=2010 | `isbnCoherence` | ISBN-10 après 2006 |
| ISBN-13 + annee=2003 | `isbnCoherence` | ISBN-13 avant 2005 |
| ISBN-10 + annee=2006 | `null` | Zone grise |
| ISBN-13 + annee=2005 | `null` | Zone grise |
| ISBN-10 + annee=2007 | `isbnCoherence` | Hors zone grise |
