# Quickstart — MotsPipe / WordsPipe

**ngx-parrecrivains** — validation dans un projet Angular vierge

---

## Installation

```bash
npm install ngx-parrecrivains
```

## Import dans un composant standalone

```typescript
import { Component } from '@angular/core';
import { MotsPipe } from 'ngx-parrecrivains';

@Component({
  selector: 'app-demo',
  imports: [MotsPipe],
  template: `
    <p>{{ 1234 | mots }}</p>           <!-- 1 234 mots -->
    <p>{{ 1234 | mots:'en' }}</p>      <!-- 1,234 words -->
    <p>{{ 1 | mots }}</p>              <!-- 1 mot -->
    <p>{{ 0 | mots }}</p>              <!-- 0 mot -->
  `
})
export class DemoComponent {}
```

## Alias anglophone

```typescript
import { WordsPipe } from 'ngx-parrecrivains';

@Component({
  imports: [WordsPipe],
  template: `<p>{{ 1234 | words:'en' }}</p>` // 1,234 words
})
export class DemoComponent {}
```

## Langue custom avec formes personnalisées

```typescript
import { MotsPipe } from 'ngx-parrecrivains';

@Component({
  imports: [MotsPipe],
  template: `
    <p>{{ 1234 | mots:'pt':'palavra':'palavras' }}</p>  <!-- 1 234 palavras -->
    <p>{{ 1    | mots:'pt':'palavra':'palavras' }}</p>  <!-- 1 palavra -->
  `
})
export class DemoComponent {}
```

## Usage direct en TypeScript (sans template)

```typescript
import { MotsPipe } from 'ngx-parrecrivains';

const pipe = new MotsPipe();
const label = pipe.transform(manuscrit.totalMots, 'fr'); // "45 231 mots"
```

## Checklist de validation

- [ ] `{{ 1234 | mots }}` → `"1 234 mots"` (espace fine insécable visible)
- [ ] `{{ 1 | mots }}` → `"1 mot"` (singulier)
- [ ] `{{ 1234 | mots:'en' }}` → `"1,234 words"`
- [ ] `{{ 1 | words }}` → `"1 mot"` (alias, même langue par défaut)
- [ ] `{{ null | mots }}` → `"0 mot"` (pas d'erreur)
- [ ] `{{ 1234 | mots:'pt':'palavra':'palavras' }}` → `"1 234 palavras"`
