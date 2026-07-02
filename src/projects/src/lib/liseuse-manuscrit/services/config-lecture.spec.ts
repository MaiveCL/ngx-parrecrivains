import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { ConfigLectureService } from './config-lecture';
import { CONFIG_LECTURE_DEFAUT } from '../../types/liseuse.types';

describe('ConfigLectureService — US2', () => {
  let service: ConfigLectureService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ConfigLectureService] });
    service = TestBed.inject(ConfigLectureService);
    service.initialiser({});
  });

  it('clamp taillePolicePx bas → 16', () => {
    service.mettre({ taillePolicePx: 10 });
    expect(service.configCourante().taillePolicePx).toBe(16);
  });

  it('clamp taillePolicePx haut → 24', () => {
    service.mettre({ taillePolicePx: 30 });
    expect(service.configCourante().taillePolicePx).toBe(24);
  });

  it('clamp interligne bas → 1.4', () => {
    service.mettre({ interligne: 1.0 });
    expect(service.configCourante().interligne).toBe(1.4);
  });

  it('clamp interligne haut → 1.8', () => {
    service.mettre({ interligne: 2.5 });
    expect(service.configCourante().interligne).toBe(1.8);
  });

  it('clamp largeurColonneCh bas → 45', () => {
    service.mettre({ largeurColonneCh: 20 });
    expect(service.configCourante().largeurColonneCh).toBe(45);
  });

  it('clamp largeurColonneCh haut → 90', () => {
    service.mettre({ largeurColonneCh: 150 });
    expect(service.configCourante().largeurColonneCh).toBe(90);
  });

  it('clamp niveauZoom bas → 0.5', () => {
    service.mettre({ niveauZoom: 0.1 });
    expect(service.configCourante().niveauZoom).toBe(0.5);
  });

  it('clamp niveauZoom haut → 2.0', () => {
    service.mettre({ niveauZoom: 5.0 });
    expect(service.configCourante().niveauZoom).toBe(2.0);
  });

  it('clamp brightness hors bornes 0–200', () => {
    service.mettre({ brightness: 300 });
    expect(service.configCourante().brightness).toBe(200);
    service.mettre({ brightness: -10 });
    expect(service.configCourante().brightness).toBe(0);
  });

  it('clamp contrast haut → 200', () => {
    service.mettre({ contrast: 500 });
    expect(service.configCourante().contrast).toBe(200);
  });

  it('clamp superpositionOpacite hors bornes 0–1', () => {
    service.mettre({ superpositionOpacite: 2 });
    expect(service.configCourante().superpositionOpacite).toBe(1);
    service.mettre({ superpositionOpacite: -0.5 });
    expect(service.configCourante().superpositionOpacite).toBe(0);
  });

  it('initialiser({modeNuit:true}) fusionne avec CONFIG_LECTURE_DEFAUT', () => {
    service.initialiser({ modeNuit: true });
    const c = service.configCourante();
    expect(c.modeNuit).toBe(true);
    expect(c.taillePolicePx).toBe(CONFIG_LECTURE_DEFAUT.taillePolicePx);
    expect(c.interligne).toBe(CONFIG_LECTURE_DEFAUT.interligne);
  });
});
