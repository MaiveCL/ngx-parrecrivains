import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { BarreControlesComponent } from './barre-controles';
import { CONFIG_LECTURE_DEFAUT, ConfigLecture } from '../../../types/liseuse.types';

describe('BarreControlesComponent — US2', () => {
  let fixture: ComponentFixture<BarreControlesComponent>;
  let component: BarreControlesComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarreControlesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BarreControlesComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', { ...CONFIG_LECTURE_DEFAUT });
    fixture.detectChanges();
    // Les contrôles sont dans @if (panneauActif() === 'controles') — ouvrir le panneau
    component.basculerControles();
    fixture.detectChanges();
  });

  it('clic toggle modeNuit → output changerConfig émet {modeNuit:true}', () => {
    const emis: Partial<ConfigLecture>[] = [];
    component.changerConfig.subscribe((v: Partial<ConfigLecture>) => emis.push(v));
    const btn = fixture.nativeElement.querySelector('[data-testid="toggle-mode-nuit"]') as HTMLElement;
    btn.click();
    expect(emis.length).toBeGreaterThan(0);
    expect(emis[emis.length - 1]).toMatchObject({ modeNuit: true });
  });

  it('slider taillePolicePx=20 → output changerConfig émet {taillePolicePx:20}', () => {
    const emis: Partial<ConfigLecture>[] = [];
    component.changerConfig.subscribe((v: Partial<ConfigLecture>) => emis.push(v));
    const slider = fixture.nativeElement.querySelector('[data-testid="slider-taille-police"]') as HTMLInputElement;
    slider.value = '20';
    slider.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(emis.some(e => e.taillePolicePx === 20)).toBe(true);
  });

  it('slider brightness=150 → output changerConfig émet {brightness:150}', () => {
    const emis: Partial<ConfigLecture>[] = [];
    component.changerConfig.subscribe((v: Partial<ConfigLecture>) => emis.push(v));
    const slider = fixture.nativeElement.querySelector('[data-testid="slider-brightness"]') as HTMLInputElement;
    slider.value = '150';
    slider.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(emis.some(e => e.brightness === 150)).toBe(true);
  });

  it('clic toggle pleinEcran → output changerConfig émet {pleinEcran:true}', () => {
    const emis: Partial<ConfigLecture>[] = [];
    component.changerConfig.subscribe((v: Partial<ConfigLecture>) => emis.push(v));
    const btn = fixture.nativeElement.querySelector('[data-testid="toggle-plein-ecran"]') as HTMLElement;
    btn.click();
    expect(emis.some(e => e.pleinEcran === true)).toBe(true);
  });
});
