// FICHIER TEMPORAIRE — SUPPRIMER AVANT PUBLICATION
// Sert uniquement à tester visuellement TempsLectureService (ngx-parrecrivains)

import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TempsLectureService, VITESSE_LECTURE_DEFAUT } from 'ngx-parrecrivains';

@Component({
  selector: 'app-test-temps-lecture',
  imports: [],
  templateUrl: './TEST-temps-lecture.html',
  styleUrl: './TEST-temps-lecture.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TESTTempsLectureComponent {
  private readonly tempsLecture = new TempsLectureService();

  readonly vitesseDefaut = VITESSE_LECTURE_DEFAUT;

  readonly nombreMots  = signal(1000);
  readonly vitesse     = signal(VITESSE_LECTURE_DEFAUT);

  readonly secondes    = computed(() => this.tempsLecture.estimer(this.nombreMots(), this.vitesse()));
  readonly duree       = computed(() => this.tempsLecture.formater(this.secondes()));

  readonly casLimites: { label: string; mots: number | null; vitesse?: number; attendu: string }[] = [
    { label: 'null',      mots: null,      attendu: '0 s → "0 min"' },
    { label: '0',         mots: 0,         attendu: '0 s → "0 min"' },
    { label: '45 s brut', mots: 150,       attendu: '45 s → "1 min"' },
    { label: '1 h 05',    mots: 13000,     attendu: '3 900 s → "1 h 05 min"' },
    { label: '200 000',   mots: 200000,    attendu: '60 000 s → "16 h 40 min"' },
    { label: 'vitesse 100', mots: 1000, vitesse: 100, attendu: '600 s → "10 min"' },
  ];

  resultat(cas: typeof this.casLimites[0]): string {
    const s = this.tempsLecture.estimer(cas.mots, cas.vitesse);
    return `${s} s → "${this.tempsLecture.formater(s)}"`;
  }

  onMotsChange(event: Event): void {
    this.nombreMots.set(Number((event.target as HTMLInputElement).value));
  }

  onVitesseChange(event: Event): void {
    this.vitesse.set(Number((event.target as HTMLInputElement).value));
  }
}
