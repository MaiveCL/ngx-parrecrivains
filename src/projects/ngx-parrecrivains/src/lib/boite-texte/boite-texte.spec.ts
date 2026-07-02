import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoiteTexte } from './boite-texte';

describe('BoiteTexte', () => {
  let component: BoiteTexte;
  let fixture: ComponentFixture<BoiteTexte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoiteTexte]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoiteTexte);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
