import { describe, it, expect, beforeEach } from 'vitest';
import { MotsPipe, WordsPipe } from './mots.pipe';

describe('MotsPipe', () => {
  let pipe: MotsPipe;

  beforeEach(() => {
    pipe = new MotsPipe();
  });

  // ─── US1 : Français (défaut) ──────────────────────────────────────────────

  it('(1234) → "1 234 mots"', () => {
    expect(pipe.transform(1234)).toBe('1 234 mots');
  });

  it('(1) → "1 mot"', () => {
    expect(pipe.transform(1)).toBe('1 mot');
  });

  it('(0) → "0 mot" (convention française : zéro singulier)', () => {
    expect(pipe.transform(0)).toBe('0 mot');
  });

  it("(1234, 'fr') → identique à sans argument", () => {
    expect(pipe.transform(1234, 'fr')).toBe('1 234 mots');
  });

  // ─── US2 : Anglais ───────────────────────────────────────────────────────

  it("(1234, 'en') → \"1,234 words\"", () => {
    expect(pipe.transform(1234, 'en')).toBe('1,234 words');
  });

  it("(1, 'en') → \"1 word\"", () => {
    expect(pipe.transform(1, 'en')).toBe('1 word');
  });

  it("(0, 'en') → \"0 words\" (convention anglaise : zéro pluriel)", () => {
    expect(pipe.transform(0, 'en')).toBe('0 words');
  });

  // ─── US4 : Cri ───────────────────────────────────────────────────────────

  it("(1234, 'cr') → pluriel cri avec espace fine", () => {
    expect(pipe.transform(1234, 'cr')).toBe('1 234 nêhiyaw-pîkiskwêwina');
  });

  it("(1, 'cr') → singulier cri", () => {
    expect(pipe.transform(1, 'cr')).toBe('1 nêhiyaw-pîkiskwêwin');
  });

  it("(0, 'cr') → singulier (convention non documentée → fallback false)", () => {
    expect(pipe.transform(0, 'cr')).toBe('0 nêhiyaw-pîkiskwêwin');
  });

  // ─── Cas limites ─────────────────────────────────────────────────────────

  it('(null) → "0 mot"', () => {
    expect(pipe.transform(null)).toBe('0 mot');
  });

  it('(-5) → "0 mot"', () => {
    expect(pipe.transform(-5)).toBe('0 mot');
  });

  it('(1.7) → "1 mot" (arrondi vers le bas)', () => {
    expect(pipe.transform(1.7)).toBe('1 mot');
  });

  it('(1000000) → formaté correctement', () => {
    expect(pipe.transform(1000000)).toBe('1 000 000 mots');
  });

  // ─── Paramètres custom ───────────────────────────────────────────────────

  it("(1234, 'pt', 'palavra', 'palavras') → pluriel portugais", () => {
    expect(pipe.transform(1234, 'pt', 'palavra', 'palavras')).toContain('palavras');
  });

  it("(1, 'pt', 'palavra', 'palavras') → singulier portugais", () => {
    expect(pipe.transform(1, 'pt', 'palavra', 'palavras')).toBe('1 palavra');
  });

  it("(0, 'pt', 'palavra', 'palavras') → \"0 palavra\" (défaut singulier)", () => {
    expect(pipe.transform(0, 'pt', 'palavra', 'palavras')).toBe('0 palavra');
  });

  it("(0, 'pt', 'palavra', 'palavras', true) → \"0 palavras\" (zeroPluriel explicite)", () => {
    expect(pipe.transform(0, 'pt', 'palavra', 'palavras', true)).toBe('0 palavras');
  });

  it("(0, 'en', undefined, undefined, false) → surcharge intégrée : \"0 word\"", () => {
    expect(pipe.transform(0, 'en', undefined, undefined, false)).toBe('0 word');
  });

  // ─── Fallback langue inconnue ─────────────────────────────────────────────

  it("(1234, 'xx') → fallback fr pour le mot", () => {
    expect(pipe.transform(1234, 'xx')).toContain('mots');
  });

  it("(0, 'xx') → fallback fr : zéro singulier", () => {
    expect(pipe.transform(0, 'xx')).toContain('mot');
    expect(pipe.transform(0, 'xx')).not.toContain('mots');
  });
});

describe('WordsPipe', () => {
  let pipe: WordsPipe;

  beforeEach(() => {
    pipe = new WordsPipe();
  });

  // ─── US3 : Alias words ───────────────────────────────────────────────────

  it("(1234, 'en') → identique à MotsPipe", () => {
    expect(pipe.transform(1234, 'en')).toBe('1,234 words');
  });

  it('(1234) → langue par défaut fr', () => {
    expect(pipe.transform(1234)).toBe('1 234 mots');
  });

  it("(0, 'en') → \"0 words\" (convention anglaise héritée)", () => {
    expect(pipe.transform(0, 'en')).toBe('0 words');
  });
});
