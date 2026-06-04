import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SnippetComponent } from '../shared/snippet/snippet';
import { LangueService } from '../shared/services/langue.service';

interface EtapeInstallation {
  id: string;
  labelKey: string;
  commande?: string;
}

interface CarteComposant {
  routerLink: string;
  nom: string;
  version: string;
  type: string;
  ariaLabel: string;
}

const STORAGE_KEY = 'ngx-tuto-etapes-cochees';

@Component({
  selector: 'app-accueil',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SnippetComponent],
  templateUrl: './accueil.html',
  styleUrl: './accueil.scss',
})
export class AccueilComponent {
  readonly langue = inject(LangueService);

  readonly etapesFaites: EtapeInstallation[] = [
    { id: 'fait1', labelKey: 'accueil.fait.etape1', commande: 'ng new mon-projet' },
    { id: 'fait2', labelKey: 'accueil.fait.etape2' },
    { id: 'fait3', labelKey: 'accueil.fait.etape3' },
  ];

  readonly etapesAfaire: EtapeInstallation[] = [
    {
      id: 'afaire1',
      labelKey: 'accueil.afaire.etape1',
      commande: 'git clone -b tuto-depart https://github.com/MaiveCL/ngx-parrecrivains.git',
    },
    {
      id: 'afaire2',
      labelKey: 'accueil.afaire.etape2',
      commande: 'npm install',
    },
    {
      id: 'afaire3',
      labelKey: 'accueil.afaire.etape3',
      commande: 'npm install ngx-parrecrivains',
    },
    {
      id: 'afaire4',
      labelKey: 'accueil.afaire.etape4',
      commande: 'ng serve',
    },
  ];

  readonly composants: CarteComposant[] = [
    {
      routerLink: '/tutos/isbn',
      nom: 'isbnValidator',
      version: 'v0.4.0',
      type: 'Validator',
      ariaLabel: 'Tutoriel isbnValidator',
    },
    {
      routerLink: '/tutos/mots',
      nom: 'MotsPipe',
      version: 'v0.2.0',
      type: 'Pipe',
      ariaLabel: 'Tutoriel MotsPipe',
    },
    {
      routerLink: '/tutos/temps-lecture',
      nom: 'TempsLectureService',
      version: 'v0.3.0',
      type: 'Service',
      ariaLabel: 'Tutoriel TempsLectureService',
    },
    {
      routerLink: '/tutos/liseuse',
      nom: 'LiseuseManuscrit',
      version: 'v0.1.0',
      type: 'Component',
      ariaLabel: 'Tutoriel LiseuseManuscritComponent',
    },
  ];

  // Étapes cochées — chargées depuis localStorage, persistées à chaque toggle
  readonly etapesCochees = signal<Set<string>>(this.chargerEtapesCochees());

  estCochee(id: string): boolean {
    return this.etapesCochees().has(id);
  }

  toggleEtape(id: string): void {
    const prochaines = new Set(this.etapesCochees());
    if (prochaines.has(id)) {
      prochaines.delete(id);
    } else {
      prochaines.add(id);
    }
    this.etapesCochees.set(prochaines);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...prochaines]));
  }

  private chargerEtapesCochees(): Set<string> {
    try {
      const stocke = localStorage.getItem(STORAGE_KEY);
      return stocke ? new Set<string>(JSON.parse(stocke)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  }
}
