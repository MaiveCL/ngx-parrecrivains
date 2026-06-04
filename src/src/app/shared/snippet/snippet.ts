import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-snippet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="snippet">
      <div class="snippet-barre">
        @if (label()) {
          <span class="snippet-label">{{ label() }}</span>
        }
        <button
          class="snippet-copy"
          [attr.aria-label]="copie() ? 'Copié' : 'Copier le code'"
          (click)="copier()"
        >
          {{ copie() ? '✓' : 'Copier' }}
        </button>
      </div>
      <pre><code>{{ code() }}</code></pre>
    </div>
  `,
  styles: `
    .snippet {
      margin: 0.5rem 0;
      border-radius: 6px;
      overflow: hidden;
      background: var(--couleur-code-fond, #1e1e2e);
    }
    .snippet-barre {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.3rem 0.6rem 0.3rem 0.75rem;
      background: rgba(0, 0, 0, 0.25);
      min-height: 1.75rem;
    }
    .snippet-label {
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--couleur-accent, #cba6f7);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      flex: 1;
    }
    .snippet-copy {
      padding: 0.15rem 0.5rem;
      font-size: 0.7rem;
      background: rgba(255, 255, 255, 0.08);
      color: #a6adc8;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 3px;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
      white-space: nowrap;
      align-self: center;
      flex-shrink: 0;

      &:hover {
        background: rgba(255, 255, 255, 0.16);
        color: #cdd6f4;
      }
      &:focus-visible {
        outline: 2px solid var(--couleur-accent, #cba6f7);
        outline-offset: 2px;
      }
    }
    pre {
      margin: 0;
      padding: 0.875rem 1rem;
      overflow-x: auto;
    }
    code {
      font-family: 'Fira Code', 'Cascadia Code', monospace;
      font-size: 0.85rem;
      line-height: 1.5;
      color: var(--couleur-code-texte, #cdd6f4);
      white-space: pre;
    }
  `,
})
export class SnippetComponent {
  readonly code = input.required<string>();
  readonly label = input<string | undefined>(undefined);

  readonly copie = signal(false);

  copier(): void {
    navigator.clipboard.writeText(this.code()).then(() => {
      this.copie.set(true);
      setTimeout(() => this.copie.set(false), 2000);
    });
  }
}
