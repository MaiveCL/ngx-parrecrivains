import { ChangeDetectionStrategy, Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-bandeau',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bandeau.html',
  styleUrl: './bandeau.scss',
})
export class BandeauComponent {
  readonly environnement = environment;
}
