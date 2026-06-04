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
      @if (label()) {
        <div class="snippet-label">{{ label() }}</div>
      }
      <div class="snippet-body">
        <pre><code>{{ code() }}</code></pre>
        <button
          class="snippet-copy"
          [attr.aria-label]="copie() ? 'Copié' : 'Copier le code'"
          (click)="copier()"
        >
          {{ copie() ? '✓ Copié' : 'Copier' }}
        </button>
      </div>
    </div>
  `,
  styles: `
    .snippet {
      margin: 0.75rem 0;
    }
    .snippet-label {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--couleur-accent, #5c6ac4);
      margin-bottom: 0.25rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .snippet-body {
      position: relative;
      background: var(--couleur-code-fond, #1e1e2e);
      border-radius: 6px;
      overflow: hidden;
    }
    pre {
      margin: 0;
      padding: 1rem;
      padding-right: 5rem;
      overflow-x: auto;
    }
    code {
      font-family: 'Fira Code', 'Cascadia Code', monospace;
      font-size: 0.875rem;
      line-height: 1.5;
      color: var(--couleur-code-texte, #cdd6f4);
      white-space: pre;
    }
    .snippet-copy {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      padding: 0.25rem 0.6rem;
      font-size: 0.75rem;
      background: rgba(255, 255, 255, 0.1);
      color: #cdd6f4;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .snippet-copy:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    .snippet-copy:focus-visible {
      outline: 2px solid var(--couleur-accent, #5c6ac4);
      outline-offset: 2px;
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
