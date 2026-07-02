import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { PanneauInfoComponent } from './panneau-info';

describe('PanneauInfoComponent', () => {
  let fixture: ComponentFixture<PanneauInfoComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanneauInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PanneauInfoComponent);
    fixture.componentRef.setInput('totalMots', 250);
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('affiche le titre si fourni', () => {
    fixture.componentRef.setInput('titre', 'Mon Roman');
    fixture.detectChanges();
    expect(compiled.textContent).toContain('Mon Roman');
  });

  it("n'affiche pas de titre si absent", () => {
    fixture.detectChanges();
    const titreEl = compiled.querySelector('[data-testid="titre"]');
    expect(titreEl).toBeNull();
  });

  it("affiche l'auteur si fourni", () => {
    fixture.componentRef.setInput('auteur', 'Marie Tremblay');
    fixture.detectChanges();
    expect(compiled.textContent).toContain('Marie Tremblay');
  });

  it('affiche le nombre de mots', () => {
    fixture.componentRef.setInput('totalMots', 1234);
    fixture.detectChanges();
    expect(compiled.textContent).toContain('1234');
  });

  it('affiche estimatedReadingTime si défini', () => {
    fixture.componentRef.setInput('estimatedReadingTime', '5 min');
    fixture.detectChanges();
    const el = compiled.querySelector('[data-testid="temps-estime"]');
    expect(el).not.toBeNull();
    expect(el?.textContent).toContain('5 min');
  });

  it("n'affiche pas estimatedReadingTime si undefined", () => {
    fixture.detectChanges();
    const el = compiled.querySelector('[data-testid="temps-estime"]');
    expect(el).toBeNull();
  });
});