import { describe, it, expect, beforeEach } from 'vitest';
import { TempsLectureService, VITESSE_LECTURE_DEFAUT } from './temps-lecture.service';

describe('TempsLectureService', () => {
  let service: TempsLectureService;

  beforeEach(() => {
    service = new TempsLectureService();
  });

  // ─── US1 : estimer() — vitesse par défaut ────────────────────────────────

  it('estimer(1000) → 300 secondes', () => {
    expect(service.estimer(1000)).toBe(300);
  });

  it('estimer(0) → 0', () => {
    expect(service.estimer(0)).toBe(0);
  });

  it('estimer(null) → 0', () => {
    expect(service.estimer(null)).toBe(0);
  });

  it('estimer(undefined) → 0', () => {
    expect(service.estimer(undefined)).toBe(0);
  });

  it('estimer(NaN) → 0', () => {
    expect(service.estimer(NaN)).toBe(0);
  });

  it('estimer(Infinity) → 0', () => {
    expect(service.estimer(Infinity)).toBe(0);
  });

  it('estimer(-5) → 0', () => {
    expect(service.estimer(-5)).toBe(0);
  });

  it('estimer(1000.7) → 300 (décimal tronqué)', () => {
    expect(service.estimer(1000.7)).toBe(300);
  });

  it('VITESSE_LECTURE_DEFAUT === 200', () => {
    expect(VITESSE_LECTURE_DEFAUT).toBe(200);
  });

  // ─── US2 : formater() ────────────────────────────────────────────────────

  it('formater(0) → "0 min"', () => {
    expect(service.formater(0)).toBe('0 min');
  });

  it('formater(45) → "1 min" (moins d\'une minute → minimum 1)', () => {
    expect(service.formater(45)).toBe('1 min');
  });

  it('formater(60) → "1 min"', () => {
    expect(service.formater(60)).toBe('1 min');
  });

  it('formater(300) → "5 min"', () => {
    expect(service.formater(300)).toBe('5 min');
  });

  it('formater(3600) → "1 h 00 min"', () => {
    expect(service.formater(3600)).toBe('1 h 00 min');
  });

  it('formater(3900) → "1 h 05 min"', () => {
    expect(service.formater(3900)).toBe('1 h 05 min');
  });

  it('formater(60000) → "16 h 40 min"', () => {
    expect(service.formater(60000)).toBe('16 h 40 min');
  });

  // ─── US3 : estimer() — vitesse personnalisée ─────────────────────────────

  it('estimer(1000, 100) → 600 secondes', () => {
    expect(service.estimer(1000, 100)).toBe(600);
  });

  it('estimer(1000, 400) → 150 secondes', () => {
    expect(service.estimer(1000, 400)).toBe(150);
  });

  it('estimer(1000, 0) → 300 secondes (fallback vitesse défaut)', () => {
    expect(service.estimer(1000, 0)).toBe(300);
  });

  it('estimer(1000, -50) → 300 secondes (fallback vitesse défaut)', () => {
    expect(service.estimer(1000, -50)).toBe(300);
  });
});
