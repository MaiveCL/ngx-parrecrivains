# Research : IsbnValidator

**Feature** : `004-validator-isbn` | **Date** : 2026-06-02

---

## §1 — Algorithme checksum ISBN-10

**Décision** : Somme pondérée 10→1, modulo 11.

```
( d₁×10 + d₂×9 + d₃×8 + ... + d₁₀×1 ) ≡ 0 (mod 11)
```

**Cas du X** : quand le chiffre de contrôle calculé vaut 10, il s'écrit `X` (ou `x`). Valide uniquement en dernière position. Traiter `'X'` et `'x'` comme la valeur numérique `10`.

**Vérification** : on peut simplement vérifier que la somme des 10 termes pondérés est divisible par 11 — pas besoin de recalculer le check digit séparément.

**Exemple** : `0306406152` → (0×10 + 3×9 + 0×8 + 6×7 + 4×6 + 0×5 + 6×4 + 1×3 + 5×2 + 2×1) = 130. 130 mod 11 = 0 ✅

**Rationale** : Algorithme officiel ISO 2108, source Wikipedia + ISBN International Agency.

---

## §2 — Algorithme checksum ISBN-13

**Décision** : Poids alternés 1 et 3 (position impaire=1, paire=3), modulo 10.

```
( d₁×1 + d₂×3 + d₃×1 + d₄×3 + ... + d₁₂×3 + d₁₃×1 ) ≡ 0 (mod 10)
```

**Chiffre de contrôle** : toujours dans {0…9}, jamais de lettre. `c = (10 - somme_12_premiers mod 10) mod 10` — le double `mod 10` est indispensable pour obtenir 0 quand le reste est 0.

**Exemple** : `9780306406157` → somme = 93 + 7 = 100. 100 mod 10 = 0 ✅

**Ordre des vérifications** : préfixe d'abord (`978` ou `979`), checksum ensuite.

**Rationale** : Algorithme GS1 standard, compatible EAN-13. Source : Wikipedia + DoGenerator.

---

## §3 — Pattern Angular ValidatorFn

**Décision** : Factory function retournant une `ValidatorFn`.

```
isbnValidator(options?) → ValidatorFn
ValidatorFn = (control: AbstractControl) → ValidationErrors | null
```

**Retour** :
- `null` → valide
- `{ isbnChecksum: true }` → invalide (clé d'erreur = nom de la constante)

**Champ vide** : retourner `null` immédiatement — la présence est gérée par `Validators.required`.

**Rationale** : Pattern standard Angular pour les validators paramétrables (ex. `Validators.minLength(n)`). Évite une classe et reste compatible avec `Validators.compose()`.

**Alternative écartée** : directive validator Angular (nécessite un module, pas adapté à une lib standalone).

---

## §4 — Préfixes ISBN-13 valides

**Décision** : Uniquement `978` et `979`.

Ces deux préfixes sont les seuls codes GS1 attribués à l'édition mondiale. Aucun autre préfixe n'existe à ce jour.

**Point asymétrique** : un ISBN-13 `979-…` n'a pas d'équivalent ISBN-10. La conversion ISBN-10 → ISBN-13 ne fonctionne qu'en ajoutant le préfixe `978`.

**Conséquence pour le code** : vérifier `isbn.startsWith('978') || isbn.startsWith('979')` avant le checksum.

---

## §5 — Transition historique et bornes de la zone grise

**Décision** : Zone grise = 2005 et 2006 inclus. ISBN-10 valide jusqu'au 31 décembre 2006. ISBN-13 obligatoire à partir du 1er janvier 2007.

| Année | ISBN-10 | ISBN-13 |
|---|---|---|
| ≤ 2004 | ✅ | ❌ `isbnCoherence` |
| 2005–2006 | ✅ | ✅ (zone grise) |
| ≥ 2007 | ❌ `isbnCoherence` | ✅ |

**Implémentation** : `annee < 2005` → `isbnCoherence` pour ISBN-13. `annee > 2006` → `isbnCoherence` pour ISBN-10.

---

## §6 — Structure du fichier

**Décision** : Un seul fichier `isbn.validator.ts` contenant :
- `ISBN_ERREURS` (constantes des clés)
- `IsbnOptions` (interface)
- `IsbnResultat` (interface)
- `validerIsbn()` (fonction pure, zéro dépendance Angular)
- `isbnValidator()` (factory Angular, importe uniquement `AbstractControl` et `ValidatorFn`)

**Rationale** : La fonction pure `validerIsbn()` est réutilisable sans Angular. L'import de `AbstractControl` est dans le même fichier mais la logique de calcul n'en dépend pas. Tree-shaking naturel — un consommateur qui n'importe que `validerIsbn` ne charge pas Angular forms.

**Alternative écartée** : deux fichiers séparés (`isbn-pure.ts` + `isbn.validator.ts`) — inutilement complexe pour 3 fonctions.
