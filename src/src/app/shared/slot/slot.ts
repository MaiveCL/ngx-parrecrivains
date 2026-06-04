import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-slot',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="slot" [attr.aria-label]="placeholder()">
      <div class="slot-placeholder" aria-hidden="true">
        <span class="slot-icone">⬚</span>
        <span class="slot-texte">{{ placeholder() }}</span>
      </div>
      <div class="slot-contenu">
        <ng-content />
      </div>
    </div>
  `,
  styles: `
    .slot {
      border: 2px dashed var(--couleur-slot-bordure, #7c83a8);
      border-radius: 8px;
      min-height: 120px;
      background: var(--couleur-slot-fond, rgba(92, 106, 196, 0.05));
      overflow: hidden;
    }
    .slot-placeholder {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 1.25rem;
      color: var(--couleur-slot-texte, #7c83a8);
      font-size: 0.875rem;
      font-style: italic;
      border-bottom: 1px dashed var(--couleur-slot-bordure, #7c83a8);
    }
    .slot-icone {
      font-size: 1.25rem;
      opacity: 0.6;
    }
    .slot-contenu {
      padding: 0.5rem;
    }
    .slot-contenu:empty {
      display: none;
    }
  `,
})
export class SlotComponent {
  readonly placeholder = input('Le composant apparaîtra ici après intégration');
}
