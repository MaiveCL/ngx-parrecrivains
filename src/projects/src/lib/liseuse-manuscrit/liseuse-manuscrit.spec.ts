import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LiseuseManuscritComponent } from './liseuse-manuscrit';
import { ComponentRef } from '@angular/core';
import { ConfigLectureService } from './services/config-lecture';
import { ChronomètreLectureService } from './services/chronometre-lecture';

describe('LiseuseManuscritComponent — US1', () => {
  let fixture: ComponentFixture<LiseuseManuscritComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiseuseManuscritComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiseuseManuscritComponent);
  });

  it('affiche un texte brut dans la zone de lecture', () => {
    fixture.componentRef.setInput('contenu', 'Mon manuscrit');
    fixture.detectChanges();
    compiled = fixture.nativeElement;
    const zone = compiled.querySelector('ngx-zone-lecture');
    expect(zone).not.toBeNull();
  });

  it('applique la config par défaut : taillePolicePx=18, interligne=1.6', () => {
    fixture.componentRef.setInput('contenu', 'Texte');
    fixture.detectChanges();
    compiled = fixture.nativeElement;
    const zoneOptimisee = compiled.querySelector('.zone-optimisee') as HTMLElement;
    expect(zoneOptimisee?.style.getPropertyValue('--taille-police')).toContain('18');
  });

  it('transmet titre et auteur au panneau info', () => {
    fixture.componentRef.setInput('contenu', 'Texte');
    fixture.componentRef.setInput('titre', 'Le Roman');
    fixture.componentRef.setInput('auteur', "L'Autrice");
    fixture.detectChanges();
    compiled = fixture.nativeElement;
    // Le panneau infos est dans @if (panneauActif() === 'infos') — ouvrir via btn-infos
    (compiled.querySelector('[data-testid="btn-infos"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(compiled.textContent).toContain('Le Roman');
    expect(compiled.textContent).toContain("L'Autrice");
  });

  it('affiche un embed pour un fichier PDF', () => {
    const fichier = new File(['%PDF'], 'doc.pdf', { type: 'application/pdf' });
    fixture.componentRef.setInput('contenu', fichier);
    fixture.detectChanges();
    compiled = fixture.nativeElement;
    const embed = compiled.querySelector('embed[type="application/pdf"]');
    expect(embed).not.toBeNull();
  });

  it('affiche un iframe pour une URL Google Docs', () => {
    fixture.componentRef.setInput('contenu', 'https://docs.google.com/document/d/X/edit');
    fixture.detectChanges();
    compiled = fixture.nativeElement;
    const iframe = compiled.querySelector('iframe');
    expect(iframe).not.toBeNull();
  });
});

describe('LiseuseManuscritComponent — US2', () => {
  let fixture: ComponentFixture<LiseuseManuscritComponent>;
  let componentRef: ComponentRef<LiseuseManuscritComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiseuseManuscritComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiseuseManuscritComponent);
    componentRef = fixture.componentRef;
    componentRef.setInput('contenu', 'Texte de test');
    fixture.detectChanges();
  });

  it('mode nuit actif → classe mode-nuit sur le host', () => {
    componentRef.setInput('config', { modeNuit: true });
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('mode-nuit')).toBe(true);
  });

  it('taillePolicePx=20 → CSS var --taille-police mis à jour', () => {
    componentRef.setInput('config', { taillePolicePx: 20 });
    fixture.detectChanges();
    const zoneOptimisee = fixture.nativeElement.querySelector('.zone-optimisee') as HTMLElement;
    expect(zoneOptimisee?.style.getPropertyValue('--taille-police')).toContain('20');
  });

  it('brightness=150 → filter contient brightness(150%) sur .zone-contenu', () => {
    componentRef.setInput('config', { brightness: 150 });
    fixture.detectChanges();
    const zoneContenu = fixture.nativeElement.querySelector('.zone-contenu') as HTMLElement;
    expect(zoneContenu?.style.filter).toContain('brightness(150%)');
  });

  it('superpositionOpacite=0.3 → div.superposition-rgba présente avec opacity 0.3', () => {
    componentRef.setInput('config', { superpositionOpacite: 0.3 });
    fixture.detectChanges();
    const superposition = fixture.nativeElement.querySelector('.superposition-rgba') as HTMLElement;
    expect(superposition).not.toBeNull();
    expect(superposition?.style.opacity).toBe('0.3');
  });

  it('pleinEcran=true → classe plein-ecran sur le host', () => {
    componentRef.setInput('config', { pleinEcran: true });
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('plein-ecran')).toBe(true);
  });
});

describe('LiseuseManuscritComponent — US5', () => {
  let fixture: ComponentFixture<LiseuseManuscritComponent>;
  let componentRef: ComponentRef<LiseuseManuscritComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiseuseManuscritComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiseuseManuscritComponent);
    componentRef = fixture.componentRef;
  });

  it('contenu=null → div.erreur-liseuse visible avec texte Aucun manuscrit', () => {
    componentRef.setInput('contenu', null);
    fixture.detectChanges();
    const erreur = fixture.nativeElement.querySelector('.erreur-liseuse') as HTMLElement;
    expect(erreur).not.toBeNull();
    expect(erreur?.textContent).toContain('Aucun manuscrit');
  });

  it('File(.xlsx) → div.erreur-liseuse avec texte Format non supporté', () => {
    const fichier = new File(['PK\x03\x04'], 'rapport.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    componentRef.setInput('contenu', fichier);
    fixture.detectChanges();
    const erreur = fixture.nativeElement.querySelector('.erreur-liseuse') as HTMLElement;
    expect(erreur).not.toBeNull();
    expect(erreur?.textContent).toContain('Format non supporté');
  });

  it('erreurIframe émise → div.erreur-liseuse avec texte Document privé', () => {
    componentRef.setInput('contenu', 'https://docs.google.com/document/d/ABC/edit');
    fixture.detectChanges();
    fixture.componentInstance.onErreurIframe();
    fixture.detectChanges();
    const erreur = fixture.nativeElement.querySelector('.erreur-liseuse') as HTMLElement;
    expect(erreur).not.toBeNull();
    expect(erreur?.textContent).toContain('Document privé');
  });

  it('langue non supportée (es) → affichage en français', () => {
    componentRef.setInput('contenu', null);
    componentRef.setInput('langue', 'es');
    fixture.detectChanges();
    const erreur = fixture.nativeElement.querySelector('.erreur-liseuse') as HTMLElement;
    expect(erreur).not.toBeNull();
    expect(erreur?.textContent).toContain('Aucun manuscrit');
  });
});

describe('LiseuseManuscritComponent — US3 Navigation', () => {
  let fixture: ComponentFixture<LiseuseManuscritComponent>;
  let componentRef: ComponentRef<LiseuseManuscritComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiseuseManuscritComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiseuseManuscritComponent);
    componentRef = fixture.componentRef;
    componentRef.setInput('contenu', 'Texte de test long');
    fixture.detectChanges();
  });

  it('swipe gauche sur zone-lecture → onPageChangee déclenché dans le parent', () => {
    const spy = vi.spyOn(fixture.componentInstance, 'onPageChangee');
    const zoneEl = fixture.nativeElement.querySelector('ngx-zone-lecture') as HTMLElement;
    const creerTouch = (x: number, y: number): Touch =>
      ({ identifier: 1, target: zoneEl, clientX: x, clientY: y, pageX: x, pageY: y, screenX: x, screenY: y, radiusX: 1, radiusY: 1, rotationAngle: 0, force: 1 } as Touch);

    zoneEl.dispatchEvent(new TouchEvent('touchstart', { touches: [creerTouch(200, 100)], bubbles: true }));
    zoneEl.dispatchEvent(new TouchEvent('touchend', { changedTouches: [creerTouch(140, 100)], bubbles: true }));

    expect(spy).toHaveBeenCalled();
  });

  it('wheel sur zone-lecture en modePagination → onPageChangee déclenché', () => {
    fixture.componentRef.injector.get(ConfigLectureService).mettre({ modePagination: true });
    fixture.detectChanges();

    const spy = vi.spyOn(fixture.componentInstance, 'onPageChangee');
    const zoneEl = fixture.nativeElement.querySelector('ngx-zone-lecture') as HTMLElement;
    zoneEl.dispatchEvent(new WheelEvent('wheel', { deltaY: 100, bubbles: true, cancelable: true }));

    expect(spy).toHaveBeenCalled();
  });

  it('bouton suivant présent et clic déclenche onChangerPage', () => {
    fixture.componentRef.injector.get(ConfigLectureService).mettre({ modePagination: true });
    // Simuler 3 pages pour que le bouton suivant soit actif (pageActuelle=1 < totalPages=3)
    fixture.componentInstance.onPageChangee({ page: 1, total: 3 });
    // btn-suivant est dans @if (panneauActif() === 'controles') — ouvrir via btn-parametres
    (fixture.nativeElement.querySelector('[data-testid="btn-parametres"]') as HTMLButtonElement).click();
    fixture.detectChanges();

    const spy = vi.spyOn(fixture.componentInstance, 'onChangerPage');
    const btn = fixture.nativeElement.querySelector('[data-testid="btn-suivant"]') as HTMLButtonElement;
    expect(btn).not.toBeNull();
    expect(btn.disabled).toBe(false);
    btn.click();
    expect(spy).toHaveBeenCalled();
  });

  it('clic toggle panneau → panneau s\'ouvre sans masquer zone-lecture', () => {
    // Panneau initialement fermé : .panneau absent du DOM
    expect(fixture.nativeElement.querySelector('.panneau')).toBeNull();

    // Le panneau est géré par panneauActif (signal interne barre-controles), pas par configService
    (fixture.nativeElement.querySelector('[data-testid="btn-infos"]') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.panneau')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('ngx-zone-lecture')).not.toBeNull();
  });
});

describe('LiseuseManuscritComponent — US4 Progression', () => {
  let fixture: ComponentFixture<LiseuseManuscritComponent>;
  let componentRef: ComponentRef<LiseuseManuscritComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiseuseManuscritComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiseuseManuscritComponent);
    componentRef = fixture.componentRef;
    componentRef.setInput('contenu', 'Un deux trois quatre cinq six sept huit neuf dix');
    fixture.detectChanges();
  });

  it('scroll → output progressionLecture émis', () => {
    const emissions: number[] = [];
    fixture.componentInstance.progressionLecture.subscribe((v: number) => emissions.push(v));

    const zoneEl = fixture.nativeElement.querySelector('ngx-zone-lecture') as HTMLElement;
    Object.defineProperty(zoneEl, 'scrollTop', { configurable: true, value: 50 });
    Object.defineProperty(zoneEl, 'scrollHeight', { configurable: true, value: 200 });
    Object.defineProperty(zoneEl, 'clientHeight', { configurable: true, value: 100 });

    zoneEl.dispatchEvent(new Event('scroll', { bubbles: true }));
    fixture.detectChanges();

    expect(emissions.length).toBeGreaterThan(0);
  });

  it('estimatedReadingTime=\'45 min\' → affiché dans panneau info', () => {
    componentRef.setInput('estimatedReadingTime', '45 min');
    // Le panneau infos est dans @if (panneauActif() === 'infos') — ouvrir via btn-infos
    (fixture.nativeElement.querySelector('[data-testid="btn-infos"]') as HTMLButtonElement).click();
    fixture.detectChanges();

    const panneau = fixture.nativeElement.querySelector('[data-testid="temps-estime"]');
    expect(panneau).not.toBeNull();
    expect(panneau?.textContent).toContain('45 min');
  });

  it('estimatedReadingTime=undefined → champ temps-estime absent du DOM', () => {
    fixture.componentRef.injector.get(ConfigLectureService).mettre({ panneauInfoVisible: true });
    fixture.detectChanges();

    const panneau = fixture.nativeElement.querySelector('[data-testid="temps-estime"]');
    expect(panneau).toBeNull();
  });

  it('tempsActif change → output readingTime émis', () => {
    const emissions: number[] = [];
    fixture.componentInstance.readingTime.subscribe((v: number) => emissions.push(v));

    const svc = fixture.debugElement.injector.get(ChronomètreLectureService);
    svc.tempsActif.set(5);
    fixture.detectChanges();

    expect(emissions).toContain(5);
  });

  it('scroll jusqu\'en bas → progressionLecture émet valeur proche de 100', () => {
    const emissions: number[] = [];
    fixture.componentInstance.progressionLecture.subscribe((v: number) => emissions.push(v));

    const zoneEl = fixture.nativeElement.querySelector('ngx-zone-lecture') as HTMLElement;
    Object.defineProperty(zoneEl, 'scrollTop', { configurable: true, value: 100 });
    Object.defineProperty(zoneEl, 'scrollHeight', { configurable: true, value: 200 });
    Object.defineProperty(zoneEl, 'clientHeight', { configurable: true, value: 100 });

    zoneEl.dispatchEvent(new Event('scroll', { bubbles: true }));
    fixture.detectChanges();

    expect(emissions.some(v => v >= 95)).toBe(true);
  });
});