import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { LangueService } from '../services/langue.service';

@Component({
  selector: 'app-slot',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="slot" [class.slot--integre]="integre()">
      <div class="slot-barre">
        @if (integre()) {
          <span class="slot-icone" aria-hidden="true">✅</span>
          <span class="slot-texte">{{ langue.t('commun.slot.succes') }}</span>
        } @else {
          <span class="slot-icone" aria-hidden="true">⬚</span>
          <span class="slot-texte">{{ placeholder() }}</span>
        }
      </div>
      <div class="slot-contenu">
        <ng-content />
      </div>
    </div>
  `,
  styles: `
    .slot {
      border: 2px dashed var(--couleur-slot-bordure, #585b70);
      border-radius: 8px;
      min-height: 80px;
      background: var(--couleur-slot-fond, rgba(92, 106, 196, 0.05));
      overflow: hidden;
      transition: border-color 0.3s, background 0.3s;
    }
    .slot--integre {
      border-color: #a6e3a1;
      border-style: solid;
      background: rgba(166, 227, 161, 0.04);
    }
    .slot-barre {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 1rem;
      border-bottom: 1px dashed var(--couleur-slot-bordure, #585b70);
      color: var(--couleur-slot-texte, #7c83a8);
      font-size: 0.8rem;
      font-style: italic;
      transition: color 0.3s;
    }
    .slot--integre .slot-barre {
      color: #a6e3a1;
      border-bottom-color: rgba(166, 227, 161, 0.3);
      font-style: normal;
      font-weight: 500;
    }
    .slot-icone {
      font-size: 1rem;
      flex-shrink: 0;
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
  readonly langue = inject(LangueService);
  readonly placeholder = input('Le composant apparaîtra ici après intégration');
  readonly integre = input(false);
}
