# Quickstart : TempsLectureService

**Feature** : `003-service-temps-lecture` | **Date** : 2026-06-02

---

## Installation

```bash
npm install ngx-parrecrivains
```

## Cas 1 — Estimation simple

```typescript
import { inject } from '@angular/core';
import { TempsLectureService } from 'ngx-parrecrivains';

@Component({ /* ... */ })
export class FicheManuscritComponent {
  private readonly tempsLecture = inject(TempsLectureService);

  readonly nombreMots = input.required<number>();

  readonly tempsAffiche = computed(() =>
    this.tempsLecture.formater(
      this.tempsLecture.estimer(this.nombreMots())
    )
  );
  // 1000 mots → "5 min"
  // 45000 mots → "3 h 45 min"
}
```

## Cas 2 — Vitesse personnalisée

```typescript
readonly tempsJeunesse = computed(() =>
  this.tempsLecture.formater(
    this.tempsLecture.estimer(this.nombreMots(), 120) // 120 mots/min
  )
);
```

## Cas 3 — Passer le résultat à la liseuse

```typescript
// estimer() retourne des secondes — compatible avec estimatedReadingTime
readonly secondesEstimees = computed(() =>
  this.tempsLecture.estimer(this.nombreMots())
);
```

```html
<ngx-liseuse-manuscrit
  [contenu]="manuscrit()"
  [estimatedReadingTime]="secondesEstimees()"
/>
```

## Cas 4 — Utiliser la constante

```typescript
import { VITESSE_LECTURE_DEFAUT } from 'ngx-parrecrivains';

// Afficher dans l'UI : "Basé sur X mots/min"
readonly vitesseLabel = `Estimé à ${VITESSE_LECTURE_DEFAUT} mots/min`;
```

## Cas 5 — Sans Angular (test unitaire pur)

```typescript
import { TempsLectureService } from 'ngx-parrecrivains';

const service = new TempsLectureService();
service.estimer(1000);   // 300
service.formater(3900);  // "1 h 05 min"
```

---

## Checklist de validation manuelle

- [ ] `estimer(1000)` → `300`
- [ ] `formater(300)` → `"5 min"`
- [ ] `formater(3900)` → `"1 h 05 min"`
- [ ] `estimer(null)` → `0` (pas d'exception)
- [ ] `formater(0)` → `"0 min"`
- [ ] `formater(45)` → `"1 min"`
- [ ] `estimer(1000, 100)` → `600`
- [ ] Instanciable avec `new TempsLectureService()` sans TestBed
