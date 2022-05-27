import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TypePlanteDetailComponent } from './type-plante-detail.component';

describe('TypePlante Management Detail Component', () => {
  let comp: TypePlanteDetailComponent;
  let fixture: ComponentFixture<TypePlanteDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypePlanteDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ typePlante: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TypePlanteDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TypePlanteDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load typePlante on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.typePlante).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
