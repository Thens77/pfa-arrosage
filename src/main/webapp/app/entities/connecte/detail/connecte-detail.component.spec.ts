import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ConnecteDetailComponent } from './connecte-detail.component';

describe('Connecte Management Detail Component', () => {
  let comp: ConnecteDetailComponent;
  let fixture: ComponentFixture<ConnecteDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConnecteDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ connecte: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ConnecteDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ConnecteDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load connecte on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.connecte).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
