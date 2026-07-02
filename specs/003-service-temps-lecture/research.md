# Research : TempsLectureService

**Feature** : `003-service-temps-lecture` | **Date** : 2026-06-02

---

## §1 — Pattern de service sans dépendance

**Décision** : `@Injectable({ providedIn: 'root' })` avec aucun `inject()`.

**Rationale** : Le service ne dépend d'aucun autre service Angular. L'absence de dépendances permet de l'instancier directement avec `new TempsLectureService()` dans les tests Vitest sans configurer de TestBed — cohérent avec le pattern de `MotsPipe` (tests unitaires purs).

**Alternative écartée** : Service fourni au niveau composant (`providers: [TempsLectureService]`) — inutile pour un service stateless injectable partout.

---

## §2 — Arrondi dans `estimer()`

**Décision** : `Math.round((Math.floor(nombreMots) / vitesse) * 60)`

**Rationale** :
- `Math.floor(nombreMots)` en premier pour normaliser les décimaux (FR-003).
- `Math.round` sur le résultat en secondes : une fraction de seconde n'est pas significative dans une estimation de temps de lecture. `Math.ceil` serait systématiquement pessimiste ; `Math.floor` systématiquement optimiste. `Math.round` est le plus neutre.

**Exemple** : 1001 mots à 200 mots/min → 300,3 s → `Math.round` → 300 s.

---

## §3 — Arrondi dans `formater()`

**Décision** : Minutes calculées avec `Math.ceil(secondes / 60)`, sauf pour 0.

**Rationale** :
- Une durée de 45 s doit afficher `"1 min"` (FR-006) — ce qui impose `Math.ceil`.
- Une durée de 0 s doit afficher `"0 min"` (FR-007) — cas spécial traité en premier.
- Pour les heures : `heures = Math.floor(total_minutes / 60)`, `minutes_restantes = total_minutes % 60`.

**Exemple** :
- 45 s → `Math.ceil(45/60)` = 1 → `"1 min"` ✅
- 300 s → `Math.ceil(300/60)` = 5 → `"5 min"` ✅
- 3900 s → `Math.ceil(3900/60)` = 65 min → 1 h 05 min → `"1 h 05 min"` ✅

---

## §4 — i18n dans `formater()`

**Décision** : Aucun paramètre `langue`. Format unique : `"X min"` / `"X h MM min"`.

**Rationale** : Décision actée dans la spec. Les abréviations `"h"` et `"min"` sont identiques en français, anglais et cri — aucune variante nécessaire. Pas de spéculation sur des formats futurs.

---

## §5 — Validation de `VITESSE_LECTURE_DEFAUT`

**Décision** : `200` mots/min, documentée comme approximation.

**Rationale** : Valeur la plus citée dans la littérature anglophone (Rayner et al., 2016 — ~238 mots/min en silence, arrondi conservateur à 200 pour tenir compte de la variabilité). Non validée spécifiquement pour le français (mots plus longs en moyenne → vitesse réelle potentiellement plus basse). Exposée comme constante publique pour permettre à l'app hôte de surcharger.

**Référence** : Rayner, K. et al. (2016). *So Much to Read, So Little Time*. Psychological Science in the Public Interest.

---

## §6 — Fichiers i18n

**Décision** : Aucun fichier i18n requis pour ce service.

**Rationale** : `formater()` retourne des abréviations numériques universelles — pas des chaînes UI traduisibles. Le service ne produit aucun texte visible par l'utilisateur final au sens i18n du terme.
