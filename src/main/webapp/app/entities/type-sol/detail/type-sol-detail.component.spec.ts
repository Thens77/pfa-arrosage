import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TypeSolDetailComponent } from './type-sol-detail.component';

describe('TypeSol Management Detail Component', () => {
  let comp: TypeSolDetailComponent;
  let fixture: ComponentFixture<TypeSolDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypeSolDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ typeSol: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TypeSolDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TypeSolDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load typeSol on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.typeSol).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
