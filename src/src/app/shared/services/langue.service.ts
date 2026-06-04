import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LangueService {
  private readonly http = inject(HttpClient);

  readonly langue = signal<'fr' | 'en'>('fr');
  private readonly traductions = signal<Record<string, string>>({});

  constructor() {
    this.charger('fr');
  }

  charger(langue: 'fr' | 'en'): void {
    this.http
      .get<Record<string, string>>(`i18n/${langue}.json`)
      .subscribe((t) => {
        this.traductions.set(t);
        this.langue.set(langue);
      });
  }

  t(cle: string): string {
    return this.traductions()[cle] ?? cle;
  }
}
