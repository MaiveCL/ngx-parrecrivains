import { describe, it, expect } from 'vitest';
import { FormControl } from '@angular/forms';
import { isbnValidator, validerIsbn, ISBN_ERREURS } from './isbn.validator';

// ─── Helpers ────────────────────────────────────────────────────────────────

function ctrl(valeur: string | null, options?: { annee?: number }) {
  return new FormControl(valeur, isbnValidator(options));
}

// ISBNs de référence (checksums vérifiés mathématiquement — voir research.md)
// ISBN-13 valide : 9780306406157 (somme=100, 100%10=0)
// ISBN-10 valide : 0306406152   (somme=132, 132%11=0)
// ISBN-10 avec X : 000000006X   (somme=22,  22%11=0)

// ─── US1 : isbnValidator() via FormControl ───────────────────────────────────

describe('isbnValidator() — format', () => {

  it('champ vide → valide (null)', () => {
    expect(ctrl('').valid).toBe(true);
  });

  it('null → valide', () => {
    expect(ctrl(null).valid).toBe(true);
  });

  it('longueur incorrecte → isbnFormat', () => {
    expect(ctrl('12345').errors?.[ISBN_ERREURS.FORMAT]).toBeTruthy();
  });

  it('tirets → isbnFormat (pas de normalisation)', () => {
    expect(ctrl('978-2-7646-3329-1').errors?.[ISBN_ERREURS.FORMAT]).toBeTruthy();
  });

  it('espaces → isbnFormat', () => {
    expect(ctrl('978 2 7646 3329 1').errors?.[ISBN_ERREURS.FORMAT]).toBeTruthy();
  });

  it('X en position non finale → isbnFormat', () => {
    expect(ctrl('X764633297').errors?.[ISBN_ERREURS.FORMAT]).toBeTruthy();
  });

});

describe('isbnValidator() — préfixe ISBN-13', () => {

  it('préfixe 999 → isbnPrefixe', () => {
    expect(ctrl('9992764633291').errors?.[ISBN_ERREURS.PREFIXE]).toBeTruthy();
  });

  it('préfixe 978 → pas d\'erreur de préfixe', () => {
    expect(ctrl('9780306406157').errors?.[ISBN_ERREURS.PREFIXE]).toBeFalsy();
  });

  it('préfixe 979 → pas d\'erreur de préfixe', () => {
    // 9790123456789 — préfixe valide (checksum peut être incorrect, mais pas d'erreur de préfixe)
    expect(ctrl('9790000000000').errors?.[ISBN_ERREURS.PREFIXE]).toBeFalsy();
  });

});

describe('isbnValidator() — checksum ISBN-13', () => {

  it('ISBN-13 valide → null', () => {
    expect(ctrl('9780306406157').valid).toBe(true);
  });

  it('ISBN-13 checksum incorrect → isbnChecksum', () => {
    expect(ctrl('9780306406158').errors?.[ISBN_ERREURS.CHECKSUM]).toBeTruthy();
  });

});

describe('isbnValidator() — checksum ISBN-10', () => {

  it('ISBN-10 valide → null', () => {
    expect(ctrl('2764633297').valid).toBe(true);
  });

  it('ISBN-10 checksum incorrect → isbnChecksum', () => {
    expect(ctrl('2764633290').errors?.[ISBN_ERREURS.CHECKSUM]).toBeTruthy();
  });

  it('ISBN-10 avec X majuscule valide → null', () => {
    expect(ctrl('000000006X').valid).toBe(true);
  });

  it('ISBN-10 avec x minuscule valide → null', () => {
    expect(ctrl('000000006x').valid).toBe(true);
  });

});

describe('ISBN_ERREURS — constantes', () => {

  it('exporte les 4 clés', () => {
    expect(ISBN_ERREURS.FORMAT).toBe('isbnFormat');
    expect(ISBN_ERREURS.PREFIXE).toBe('isbnPrefixe');
    expect(ISBN_ERREURS.CHECKSUM).toBe('isbnChecksum');
    expect(ISBN_ERREURS.COHERENCE).toBe('isbnCoherence');
  });

});

// ─── US3 : validerIsbn() directement (hors formulaire) ──────────────────────

describe('validerIsbn() — usage hors Angular', () => {

  it('ISBN-13 valide → { valide: true }', () => {
    expect(validerIsbn('9780306406157')).toEqual({ valide: true });
  });

  it('ISBN-13 checksum incorrect → { valide: false, erreur: isbnChecksum }', () => {
    expect(validerIsbn('9780306406158')).toEqual({ valide: false, erreur: 'isbnChecksum' });
  });

  it('ISBN-10 valide → { valide: true }', () => {
    expect(validerIsbn('2764633297')).toEqual({ valide: true });
  });

  it('ISBN-10 avec X → { valide: true }', () => {
    expect(validerIsbn('000000006X')).toEqual({ valide: true });
  });

  it('préfixe invalide → { valide: false, erreur: isbnPrefixe }', () => {
    expect(validerIsbn('9992764633291')).toEqual({ valide: false, erreur: 'isbnPrefixe' });
  });

  it('format invalide → { valide: false, erreur: isbnFormat }', () => {
    expect(validerIsbn('12345')).toEqual({ valide: false, erreur: 'isbnFormat' });
  });

  it('tirets → { valide: false, erreur: isbnFormat }', () => {
    expect(validerIsbn('978-2-7646-3329-1')).toEqual({ valide: false, erreur: 'isbnFormat' });
  });

  it('null → { valide: true }', () => {
    expect(validerIsbn(null)).toEqual({ valide: true });
  });

  it('undefined → { valide: true }', () => {
    expect(validerIsbn(undefined)).toEqual({ valide: true });
  });

  it('chaîne vide → { valide: true }', () => {
    expect(validerIsbn('')).toEqual({ valide: true });
  });

});

// ─── US2 : cohérence format / année ─────────────────────────────────────────

describe('isbnValidator() — cohérence avec annee', () => {

  it('ISBN-10 + annee 2010 → isbnCoherence', () => {
    expect(ctrl('2764633297', { annee: 2010 }).errors?.[ISBN_ERREURS.COHERENCE]).toBeTruthy();
  });

  it('ISBN-10 + annee 2007 → isbnCoherence (hors zone grise)', () => {
    expect(ctrl('2764633297', { annee: 2007 }).errors?.[ISBN_ERREURS.COHERENCE]).toBeTruthy();
  });

  it('ISBN-13 + annee 2003 → isbnCoherence', () => {
    expect(ctrl('9780306406157', { annee: 2003 }).errors?.[ISBN_ERREURS.COHERENCE]).toBeTruthy();
  });

  it('ISBN-10 + annee 2006 → null (zone grise)', () => {
    expect(ctrl('2764633297', { annee: 2006 }).valid).toBe(true);
  });

  it('ISBN-13 + annee 2005 → null (zone grise)', () => {
    expect(ctrl('9780306406157', { annee: 2005 }).valid).toBe(true);
  });

  it('ISBN-10 + annee 2003 → null (cohérent)', () => {
    expect(ctrl('2764633297', { annee: 2003 }).valid).toBe(true);
  });

  it('ISBN-13 + annee 2010 → null (cohérent)', () => {
    expect(ctrl('9780306406157', { annee: 2010 }).valid).toBe(true);
  });

  it('sans annee → pas de vérification de cohérence', () => {
    expect(ctrl('2764633297').errors?.[ISBN_ERREURS.COHERENCE]).toBeFalsy();
  });

});

describe('validerIsbn() — cohérence avec annee', () => {

  it('ISBN-10 + 2010 → isbnCoherence', () => {
    expect(validerIsbn('2764633297', 2010)).toEqual({ valide: false, erreur: 'isbnCoherence' });
  });

  it('ISBN-13 + 2003 → isbnCoherence', () => {
    expect(validerIsbn('9780306406157', 2003)).toEqual({ valide: false, erreur: 'isbnCoherence' });
  });

  it('ISBN-10 + 2006 → { valide: true } (zone grise)', () => {
    expect(validerIsbn('2764633297', 2006)).toEqual({ valide: true });
  });

  it('ISBN-13 + 2005 → { valide: true } (zone grise)', () => {
    expect(validerIsbn('9780306406157', 2005)).toEqual({ valide: true });
  });

});

// ─── Corpus de référence (docs/notes/Liste_ISBN.md) ─────────────────────────
// Un seul test par sens — en cas d'échec, la liste complète des ISBN fautifs est affichée.

const CORPUS_VALIDES = [
  // ISBN-13 — littérature internationale
  '9780306406157', '9780596007126', '9780132350884', '9780201633610',
  '9780747532699', '9780747542155', '9780451524935', '9780743273565',
  '9780140283334', '9780140449136', '9780061965548', '9780062315007',
  // ISBN-13 — littérature française
  '9782070413119', '9782070360024', '9782070369911', '9782070541270',
  // ISBN-13 — littérature québécoise
  '9782890375147',
  // ISBN-13 — préfixe 979 (France)
  '9791090636071', '9791031202341',
  // ISBN-10
  '0306406152', '0596007124', '0132350882', '0201633612',
  '0747532699', '0451524934', '0140449132', '2764633297',
  // Edge cases : X majuscule, x minuscule, séquentiel
  '000000006X', '000000006x', '0123456789',
] as const;

const CORPUS_INVALIDES: { isbn: string; attendu: string }[] = [
  { isbn: '0306406153',        attendu: ISBN_ERREURS.CHECKSUM },
  { isbn: '9780306406156',     attendu: ISBN_ERREURS.CHECKSUM },
  { isbn: '9780306406158',     attendu: ISBN_ERREURS.CHECKSUM },
  { isbn: '9990306406157',     attendu: ISBN_ERREURS.PREFIXE  },
  { isbn: '047191177A',        attendu: ISBN_ERREURS.FORMAT   },
  { isbn: '04719117X7',        attendu: ISBN_ERREURS.FORMAT   },
  { isbn: '12345',             attendu: ISBN_ERREURS.FORMAT   },
  { isbn: '978-0-306-40615-7', attendu: ISBN_ERREURS.FORMAT   },
];

describe('corpus — valides (Liste_ISBN.md)', () => {

  it('aucun ISBN réel ne doit être rejeté', () => {
    const echecs = CORPUS_VALIDES
      .map(isbn => ({ isbn, r: validerIsbn(isbn) }))
      .filter(({ r }) => !r.valide)
      .map(({ isbn, r }) => `  ${isbn} → ${'erreur' in r ? r.erreur : '?'}`);

    expect(
      echecs,
      `${echecs.length} ISBN rejeté(s) à tort :\n${echecs.join('\n')}`
    ).toHaveLength(0);
  });

});

describe('corpus — invalides (Liste_ISBN.md)', () => {

  it('chaque ISBN invalide retourne l\'erreur attendue', () => {
    const echecs = CORPUS_INVALIDES
      .map(({ isbn, attendu }) => {
        const r = validerIsbn(isbn);
        if (r.valide)        return `  ${isbn} → accepté à tort (attendu : ${attendu})`;
        if (r.erreur !== attendu) return `  ${isbn} → obtenu ${r.erreur} (attendu : ${attendu})`;
        return null;
      })
      .filter((msg): msg is string => msg !== null);

    expect(
      echecs,
      `${echecs.length} ISBN mal traité(s) :\n${echecs.join('\n')}`
    ).toHaveLength(0);
  });

});
