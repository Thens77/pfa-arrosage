import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PlantationDetailComponent } from './plantation-detail.component';

describe('Plantation Management Detail Component', () => {
  let comp: PlantationDetailComponent;
  let fixture: ComponentFixture<PlantationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlantationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ plantation: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PlantationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PlantationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load plantation on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.plantation).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
