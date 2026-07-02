import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

interface LienTest {
  path:  string;
  label: string;
}

@Component({
  selector: 'app-test-menu',
  imports: [RouterLink],
  templateUrl: './TEST-menu.html',
  styleUrl: './TEST-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TESTMenuComponent {
  private readonly router = inject(Router);

  readonly liens: LienTest[] = this.router.config
    .filter(route => typeof route.path === 'string' && route.path.startsWith('tests/'))
    .map(route => ({
      path:  '/' + route.path,
      label: typeof route.title === 'string' ? route.title : route.path!,
    }));
}
