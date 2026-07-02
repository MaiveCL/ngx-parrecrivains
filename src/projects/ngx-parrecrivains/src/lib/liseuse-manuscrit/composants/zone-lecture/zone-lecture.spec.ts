import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { ZoneLectureComponent } from './zone-lecture';
import { ConfigLectureService } from '../../services/config-lecture';

describe('ZoneLectureComponent', () => {
  let fixture: ComponentFixture<ZoneLectureComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZoneLectureComponent],
      providers: [ConfigLectureService],
    }).compileComponents();

    fixture = TestBed.createComponent(ZoneLectureComponent);
  });

  it('affiche le texte brut dans un div avec var CSS --largeur-colonne', () => {
    fixture.componentRef.setInput('contenu', 'Bonjour le monde');
    fixture.detectChanges();
    compiled = fixture.nativeElement;
    const div = compiled.querySelector('.zone-optimisee');
    expect(div).not.toBeNull();
    expect(div?.textContent).toContain('Bonjour le monde');
  });

  it('affiche du HTML via innerHTML', () => {
    fixture.componentRef.setInput('contenu', '<p>Bonjour</p>');
    fixture.detectChanges();
    compiled = fixture.nativeElement;
    const div = compiled.querySelector('.zone-optimisee');
    expect(div?.innerHTML).toContain('<p>');
  });

  it('affiche un embed pour un fichier PDF', () => {
    const fichier = new File(['%PDF'], 'doc.pdf', { type: 'application/pdf' });
    fixture.componentRef.setInput('contenu', fichier);
    fixture.detectChanges();
    compiled = fixture.nativeElement;
    const embed = compiled.querySelector('embed[type="application/pdf"]');
    expect(embed).not.toBeNull();
  });

  it('affiche un iframe pour un fichier DOCX', () => {
    const fichier = new File([''], 'doc.docx');
    fixture.componentRef.setInput('contenu', fichier);
    fixture.detectChanges();
    compiled = fixture.nativeElement;
    const iframe = compiled.querySelector('iframe');
    expect(iframe).not.toBeNull();
  });
});

describe('ZoneLectureComponent — US3 Navigation', () => {
  let fixture: ComponentFixture<ZoneLectureComponent>;
  let component: ZoneLectureComponent;
  let el: HTMLElement;
  let configService: ConfigLectureService;

  function creerTouch(x: number, y: number): Touch {
    return { identifier: 1, target: el, clientX: x, clientY: y, pageX: x, pageY: y, screenX: x, screenY: y, radiusX: 1, radiusY: 1, rotationAngle: 0, force: 1 } as Touch;
  }

  function swiper(deltaX: number, deltaY = 0): void {
    const startX = 200, startY = 100;
    el.dispatchEvent(new TouchEvent('touchstart', { touches: [creerTouch(startX, startY)], bubbles: true }));
    el.dispatchEvent(new TouchEvent('touchend', { changedTouches: [creerTouch(startX + deltaX, startY + deltaY)], bubbles: true }));
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZoneLectureComponent],
      providers: [ConfigLectureService],
    }).compileComponents();

    configService = TestBed.inject(ConfigLectureService);
    fixture = TestBed.createComponent(ZoneLectureComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('contenu', 'Texte de test');
    el = fixture.nativeElement;

    // Mock DOM dimensions avant ngAfterViewInit pour simuler 5 pages (1000/200)
    Object.defineProperty(el, 'scrollHeight', { configurable: true, get: () => 1000 });
    Object.defineProperty(el, 'clientHeight', { configurable: true, get: () => 200 });

    fixture.detectChanges();
  });

  it('swipe gauche -60px → pageChangee.page = pageActuelle+1 (page suivante)', () => {
    const emis: { page: number; total: number }[] = [];
    component.pageChangee.subscribe((v: { page: number; total: number }) => emis.push(v));
    swiper(-60, 0);
    expect(emis.length).toBe(1);
    expect(emis[0].page).toBe(2);
  });

  it('swipe droit +60px depuis page 2 → pageChangee.page = 1 (page précédente)', () => {
    component.allerPage(2);
    const emis: { page: number; total: number }[] = [];
    component.pageChangee.subscribe((v: { page: number; total: number }) => emis.push(v));
    swiper(60, 0);
    expect(emis.length).toBe(1);
    expect(emis[0].page).toBe(1);
  });

  it('swipe horizontal 20px (< seuil) → aucune émission', () => {
    const emis: { page: number; total: number }[] = [];
    component.pageChangee.subscribe((v: { page: number; total: number }) => emis.push(v));
    swiper(20, 0);
    expect(emis.length).toBe(0);
  });

  it('swipe vertical (|deltaY| > |deltaX|) → aucune émission', () => {
    const emis: { page: number; total: number }[] = [];
    component.pageChangee.subscribe((v: { page: number; total: number }) => emis.push(v));
    swiper(30, 80);
    expect(emis.length).toBe(0);
  });

  it('wheel deltaY>0 en modePagination=true → pageChangee émis', () => {
    configService.mettre({ modePagination: true });
    const emis: { page: number; total: number }[] = [];
    component.pageChangee.subscribe((v: { page: number; total: number }) => emis.push(v));
    el.dispatchEvent(new WheelEvent('wheel', { deltaY: 100, bubbles: true, cancelable: true }));
    expect(emis.length).toBeGreaterThan(0);
  });

  it('wheel en modePagination=false → pas d\'émission pageChangee', () => {
    configService.mettre({ modePagination: false });
    const emis: { page: number; total: number }[] = [];
    component.pageChangee.subscribe((v: { page: number; total: number }) => emis.push(v));
    el.dispatchEvent(new WheelEvent('wheel', { deltaY: 100, bubbles: true }));
    expect(emis.length).toBe(0);
  });
});
