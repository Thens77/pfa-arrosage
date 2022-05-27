import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ArrosageDetailComponent } from './arrosage-detail.component';

describe('Arrosage Management Detail Component', () => {
  let comp: ArrosageDetailComponent;
  let fixture: ComponentFixture<ArrosageDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArrosageDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ arrosage: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ArrosageDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ArrosageDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load arrosage on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.arrosage).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
