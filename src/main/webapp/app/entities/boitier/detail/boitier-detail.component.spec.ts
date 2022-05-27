import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BoitierDetailComponent } from './boitier-detail.component';

describe('Boitier Management Detail Component', () => {
  let comp: BoitierDetailComponent;
  let fixture: ComponentFixture<BoitierDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoitierDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ boitier: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(BoitierDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BoitierDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load boitier on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.boitier).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
