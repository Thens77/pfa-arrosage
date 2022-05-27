import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GrandeurDetailComponent } from './grandeur-detail.component';

describe('Grandeur Management Detail Component', () => {
  let comp: GrandeurDetailComponent;
  let fixture: ComponentFixture<GrandeurDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrandeurDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ grandeur: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(GrandeurDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(GrandeurDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load grandeur on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.grandeur).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
