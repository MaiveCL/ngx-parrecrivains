import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LangueService } from '../services/langue.service';

@Component({
  selector: 'app-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class NavComponent {
  readonly langue = inject(LangueService);

  basculerLangue(): void {
    const prochaine = this.langue.langue() === 'fr' ? 'en' : 'fr';
    this.langue.charger(prochaine);
  }
}
