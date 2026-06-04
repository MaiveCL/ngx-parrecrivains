import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './shared/nav/nav';
import { LangueService } from './shared/services/langue.service';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, NavComponent],
  template: `
    <app-nav />
    <main class="contenu-principal">
      <router-outlet />
    </main>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100dvh;
    }
    .contenu-principal {
      flex: 1;
      padding: 2rem 1.5rem;
      max-width: 900px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }
  `,
})
export class App implements OnInit {
  private readonly langue = inject(LangueService);

  ngOnInit(): void {
    this.langue.charger('fr');
  }
}
