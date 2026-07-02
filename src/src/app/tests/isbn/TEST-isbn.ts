// FICHIER TEMPORAIRE — SUPPRIMER AVANT PUBLICATION
// Sert uniquement à tester visuellement isbnValidator / validerIsbn (ngx-parrecrivains)

import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ISBN_ERREURS, isbnValidator, validerIsbn } from 'ngx-parrecrivains';

@Component({
  selector: 'app-test-isbn',
  imports: [],
  templateUrl: './TEST-isbn.html',
  styleUrl: './TEST-isbn.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TESTIsbnComponent {
  readonly isbnSaisie  = signal('');
  readonly anneeSaisie = signal<number | undefined>(undefined);

  readonly resultatDirect    = computed(() => validerIsbn(this.isbnSaisie(), this.anneeSaisie()));
  readonly erreursFormCtrl   = computed(() => new FormControl(this.isbnSaisie(), isbnValidator()).errors);

  readonly estValide         = computed(() => this.resultatDirect().valide);
  readonly erreurCle         = computed(() => { const r = this.resultatDirect(); return r.valide ? null : r.erreur; });
  readonly erreurFormCtrlCle = computed(() => { const e = this.erreursFormCtrl(); return e ? Object.keys(e)[0] : null; });

  readonly erreursCles = Object.values(ISBN_ERREURS);

  readonly casReference: { label: string; isbn: string; annee?: number; attendu: string }[] = [
    { label: 'ISBN-13 valide',                    isbn: '9780306406157',     attendu: 'valide'        },
    { label: 'ISBN-13 checksum invalide',          isbn: '9780306406156',     attendu: 'isbnChecksum'  },
    { label: 'ISBN-13 préfixe invalide',           isbn: '9910306406157',     attendu: 'isbnPrefixe'   },
    { label: 'ISBN-10 valide',                     isbn: '0306406152',        attendu: 'valide'        },
    { label: 'ISBN-10 avec X majuscule',           isbn: '000000006X',        attendu: 'valide'        },
    { label: 'ISBN-10 avec x minuscule',           isbn: '000000006x',        attendu: 'valide'        },
    { label: 'ISBN-10 checksum invalide',          isbn: '0306406153',        attendu: 'isbnChecksum'  },
    { label: 'Format trop court',                  isbn: '12345',             attendu: 'isbnFormat'    },
    { label: 'Format avec tirets',                 isbn: '978-0-306-40615-7', attendu: 'isbnFormat'    },
    { label: 'Vide → valide (champ optionnel)',     isbn: '',                  attendu: 'valide'        },
    { label: 'ISBN-10 + annee 2010',               isbn: '0306406152', annee: 2010, attendu: 'isbnCoherence' },
    { label: 'ISBN-10 + annee 2006 (zone grise)',  isbn: '0306406152', annee: 2006, attendu: 'valide'        },
    { label: 'ISBN-13 + annee 2003',               isbn: '9780306406157', annee: 2003, attendu: 'isbnCoherence' },
    { label: 'ISBN-13 + annee 2005 (zone grise)',  isbn: '9780306406157', annee: 2005, attendu: 'valide'        },
    { label: 'ISBN-10 + annee 2003 (cohérent)',    isbn: '0306406152', annee: 2003, attendu: 'valide'        },
    { label: 'ISBN-13 + annee 2010 (cohérent)',    isbn: '9780306406157', annee: 2010, attendu: 'valide'      },
  ];

  resultatCas(isbn: string, annee: number | undefined): string {
    const r = validerIsbn(isbn, annee);
    return r.valide ? 'valide' : r.erreur;
  }

  onIsbnChange(event: Event): void {
    this.isbnSaisie.set((event.target as HTMLInputElement).value);
  }

  onAnneeChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.anneeSaisie.set(val ? Number(val) : undefined);
  }
}
