import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { InstallationDetailComponent } from './installation-detail.component';

describe('Installation Management Detail Component', () => {
  let comp: InstallationDetailComponent;
  let fixture: ComponentFixture<InstallationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstallationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ installation: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(InstallationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(InstallationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load installation on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.installation).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
