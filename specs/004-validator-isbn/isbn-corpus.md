# Liste d'ISBN de référence

## Contexte

**Objectif :** corpus d'ISBN réels pour vérifier que `isbnValidator` / `validerIsbn` n'écarte aucun ISBN légitimement publié.

**Futur service :** `IsbnLookupService` (v0.5.0 — voir BACKLOG.md)
- API : **Open Library** — `GET https://openlibrary.org/isbn/{isbn}.json`
- Gratuite, sans clé, sans CORS
- Retourne : titre, auteur(s), éditeur, date de publication, langue, couverture
A vérifier :
- https://www.chasse-aux-livres.fr/recherche-par-isbn

**Convention :** tous les ISBN du corpus principal ont le checksum vérifié mathématiquement.
Les données bibliographiques sont de mémoire — à confirmer via Open Library avant usage en production.

---

## ISBN valides — corpus principal

| ISBN-13 | ISBN-10 | Titre | Auteur(s) | Éditeur | Année | Langue |
|---|---|---|---|---|---|---|
| 9780306406157 | 0306406152 | *How to Solve It* | G. Polya | Princeton UP | 1990 | en |
| 9780596007126 | 0596007124 | *Head First Design Patterns* | Freeman, Robson et al. | O'Reilly | 2004 | en |
| 9780132350884 | 0132350882 | *Clean Code* | Robert C. Martin | Prentice Hall | 2008 | en |
| 9780201633610 | 0201633612 | *Design Patterns* | Gang of Four | Addison-Wesley | 1994 | en |
| 9780747532699 | 0747532699 | *Harry Potter and the Philosopher's Stone* | J.K. Rowling | Bloomsbury | 1997 | en |
| 9780747542155 | — | *Harry Potter and the Chamber of Secrets* | J.K. Rowling | Bloomsbury | 1998 | en |
| 9780451524935 | 0451524934 | *1984* | George Orwell | Signet Classic | 1961 | en |
| 9780743273565 | — | *The Great Gatsby* | F. Scott Fitzgerald | Scribner | 2004 | en |
| 9780140283334 | — | *Crime and Punishment* | Fiodor Dostoïevski | Penguin Classics | 1992 | en |
| 9780140449136 | 0140449132 | *The Iliad* | Homère (trad. E.V. Rieu) | Penguin Classics | 2003 | en |
| 9780061965548 | — | *To Kill a Mockingbird* | Harper Lee | Harper Perennial | 2002 | en |
| 9780062315007 | — | *The Alchemist* | Paulo Coelho | HarperCollins | 2014 | en |
| 9782070413119 | — | *Du côté de chez Swann* | Marcel Proust | Folio Classique | — | fr |
| 9782070360024 | — | *L'Étranger* | Albert Camus | Folio | — | fr |
| 9782070369911 | — | *La Nausée* | Jean-Paul Sartre | Folio | — | fr |
| 9782070541270 | — | *L'Alchimiste* | Paulo Coelho | Gallimard | — | fr |
| 9782890375147 | — | *Agaguk* | Yves Thériault | Typo | 2007 | fr-QC |
| — | 2764633297 | *(titre inconnu — exemple québécois valide)* | — | — | ~2004 | fr-QC |
| 9791090636071 | — | *(titre inconnu — préfixe 979 valide)* | — | — | 2017 | fr |
| 9791031202341 | — | *(titre inconnu — préfixe 979 valide)* | — | — | 2018 | fr |

> **Note :** les entrées sans titre sont à enrichir en priorité via `IsbnLookupService`.
>
> **À ne pas réhabiliter :** `9782764633291`, `9782764600006` et `047191177X` circulent dans des sources
> tierces mais ont un **checksum incorrect** — ce sont des erreurs dans ces sources, pas un bug du validator.

---

## ISBN invalides — Cas de test négatifs

Ces entrées doivent produire une erreur — elles servent à tester les rejets du validator.

| ISBN | Résultat attendu | Raison |
|---|---|---|
| 0306406153 | `isbnChecksum` | Chiffre de contrôle modifié (2 → 3) |
| 9780306406156 | `isbnChecksum` | Chiffre de contrôle modifié (7 → 6) |
| 047191177A | `isbnFormat` | Caractère non autorisé (A ≠ X) |
| 04719117X7 | `isbnFormat` | X en position non terminale |
| 9780306406158 | `isbnChecksum` | Chiffre de contrôle modifié (7 → 8) |
| 9990306406157 | `isbnPrefixe` | Préfixe 999 — ni 978 ni 979 |
| 12345 | `isbnFormat` | Longueur incorrecte (5 ≠ 10 ou 13) |
| 978-0-306-40615-7 | `isbnFormat` | Tirets présents — format brut requis |
| *(chaîne vide)* | `valide` | Champ optionnel — vide → valide |
| null | `valide` | Idem |
| undefined | `valide` | Idem |

---

## Cohérence format / année — Cas de test

Zone grise 2005–2006 : ISBN-10 et ISBN-13 coexistaient, les deux sont acceptés.

| ISBN | Année | Résultat attendu | Explication |
|---|---|---|---|
| 0306406152 | 2003 | `valide` | ISBN-10 avant 2007 → cohérent |
| 0306406152 | 2006 | `valide` | Zone grise → accepté |
| 0306406152 | 2007 | `isbnCoherence` | ISBN-10 après 2006 → incohérent |
| 0306406152 | 2010 | `isbnCoherence` | ISBN-10 après 2006 → incohérent |
| 9780306406157 | 2003 | `isbnCoherence` | ISBN-13 avant 2005 → incohérent |
| 9780306406157 | 2005 | `valide` | Zone grise → accepté |
| 9780306406157 | 2006 | `valide` | Zone grise → accepté |
| 9780306406157 | 2007 | `valide` | ISBN-13 après 2004 → cohérent |
| 9791090636071 | 2020 | `valide` | Préfixe 979, année récente → cohérent |

---

## Edge cases techniques

ISBN construits mathématiquement pour couvrir des cas limites (pas nécessairement de vrais livres).

| ISBN | Résultat attendu | Usage |
|---|---|---|
| 000000006X | `valide` | ISBN-10 avec chiffre de contrôle X (majuscule) |
| 000000006x | `valide` | ISBN-10 avec chiffre de contrôle x (minuscule) |
| 0123456789 | `valide` | ISBN-10 séquentiel, checksum = 9 |
