// FICHIER TEMPORAIRE — SUPPRIMER AVANT PUBLICATION
// Sert uniquement à tester visuellement MotsPipe / WordsPipe (ngx-parrecrivains)

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MotsPipe, WordsPipe } from 'ngx-parrecrivains';

interface CasTest {
  id:          number;
  groupe:      string;
  label:       string;
  description: string;
}

@Component({
  selector: 'app-test-pipe-mots',
  imports: [MotsPipe, WordsPipe],
  templateUrl: './TEST-pipe-mots.html',
  styleUrl: './TEST-pipe-mots.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TESTpipeMotsComponent {

  readonly casList: CasTest[] = [
    { id: 0, groupe: 'Français (défaut)',  label: 'Pluriel FR',         description: '1234 | mots'                          },
    { id: 1, groupe: 'Français (défaut)',  label: 'Singulier FR',       description: '1 | mots'                             },
    { id: 2, groupe: 'Français (défaut)',  label: 'Zéro FR',            description: '0 | mots → singulier'                 },
    { id: 3, groupe: 'Français (défaut)',  label: 'Million FR',         description: '1000000 | mots'                       },
    { id: 4, groupe: 'Anglais',            label: 'Pluriel EN',         description: "1234 | mots:'en'"                     },
    { id: 5, groupe: 'Anglais',            label: 'Singulier EN',       description: "1 | mots:'en'"                        },
    { id: 6, groupe: 'Anglais',            label: 'Zéro EN',            description: "0 | mots:'en' → pluriel"              },
    { id: 7, groupe: 'Cri',               label: 'Pluriel CR',         description: "1234 | mots:'cr'"                     },
    { id: 8, groupe: 'Cri',               label: 'Singulier CR',       description: "1 | mots:'cr'"                        },
    { id: 9, groupe: 'Cri',               label: 'Zéro CR',            description: "0 | mots:'cr' → singulier (fallback)" },
    { id: 10, groupe: 'Alias words',      label: 'Alias EN',           description: "1234 | words:'en'"                    },
    { id: 11, groupe: 'Alias words',      label: 'Alias FR',           description: '1234 | words'                         },
    { id: 12, groupe: 'Cas limites',      label: 'null',               description: 'null | mots → 0 mot'                  },
    { id: 13, groupe: 'Cas limites',      label: 'Négatif',            description: '-5 | mots → 0 mot'                    },
    { id: 14, groupe: 'Cas limites',      label: 'Décimal',            description: '1.7 | mots → 1 mot'                   },
    { id: 15, groupe: 'Custom + Intl',    label: 'Portugais',          description: "1234 | mots:'pt':'palavra':'palavras'" },
    { id: 16, groupe: 'Custom + Intl',    label: 'Portugais singulier',description: "1 | mots:'pt':'palavra':'palavras'"    },
    { id: 17, groupe: 'Custom + Intl',    label: 'Zéro PT surcharge',  description: "0 | mots:'pt':'palavra':'palavras':true → pluriel" },
    { id: 18, groupe: 'Custom + Intl',    label: 'Langue inconnue',    description: "1234 | mots:'xx' → fallback fr"       },
  ];

  readonly casCourant = signal<number>(0);

  selectionner(id: number): void {
    this.casCourant.set(id);
  }

  readonly groupes = [...new Set(this.casList.map(c => c.groupe))];

  casParGroupe(groupe: string): CasTest[] {
    return this.casList.filter(c => c.groupe === groupe);
  }
}
