import { Component, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ChronomètreLectureService } from './chronometre-lecture';

@Component({
  template: '',
  providers: [ChronomètreLectureService],
})
class HostTest {}

describe('ChronomètreLectureService — US4', () => {
  let fixture: ComponentFixture<HostTest>;
  let svc: ChronomètreLectureService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostTest],
    }).compileComponents();

    fixture = TestBed.createComponent(HostTest);
    fixture.detectChanges();
    svc = fixture.debugElement.injector.get(ChronomètreLectureService);
  });

  afterEach(() => {
    vi.useRealTimers();
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
  });

  it('demarrer() → tempsActif s\'incrémente avec fake timers', () => {
    vi.useFakeTimers();
    svc.demarrer();
    vi.advanceTimersByTime(3000);
    expect(svc.tempsActif()).toBe(3);
  });

  it('pause si document.hidden=true (visibilitychange)', () => {
    vi.useFakeTimers();
    svc.demarrer();
    vi.advanceTimersByTime(2000);
    expect(svc.tempsActif()).toBe(2);

    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));

    vi.advanceTimersByTime(3000);
    expect(svc.tempsActif()).toBe(2);
  });

  it('reprise si document.hidden=false après pause', () => {
    vi.useFakeTimers();
    svc.demarrer();

    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
    vi.advanceTimersByTime(2000);
    expect(svc.tempsActif()).toBe(0);

    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    document.dispatchEvent(new Event('visibilitychange'));
    vi.advanceTimersByTime(3000);
    expect(svc.tempsActif()).toBe(3);
  });

  it('pause si IntersectionObserver ratio<0.5', () => {
    let observerCallback!: IntersectionObserverCallback;
    const savedIO = (window as any).IntersectionObserver;
    (window as any).IntersectionObserver = class {
      constructor(cb: IntersectionObserverCallback) { observerCallback = cb; }
      observe = vi.fn();
      disconnect = vi.fn();
    };

    vi.useFakeTimers();
    svc.demarrer();

    observerCallback([{ intersectionRatio: 0.3 } as IntersectionObserverEntry], {} as IntersectionObserver);
    vi.advanceTimersByTime(3000);
    expect(svc.tempsActif()).toBe(0);

    observerCallback([{ intersectionRatio: 0.7 } as IntersectionObserverEntry], {} as IntersectionObserver);
    vi.advanceTimersByTime(2000);
    expect(svc.tempsActif()).toBe(2);

    (window as any).IntersectionObserver = savedIO;
  });

  it('dégradation gracieuse si IntersectionObserver absent', () => {
    const savedIO = (window as any).IntersectionObserver;
    delete (window as any).IntersectionObserver;

    vi.useFakeTimers();
    expect(() => svc.demarrer()).not.toThrow();
    vi.advanceTimersByTime(2000);
    expect(svc.tempsActif()).toBe(2);

    (window as any).IntersectionObserver = savedIO;
  });
});
