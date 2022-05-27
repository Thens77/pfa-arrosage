import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { InstallationService } from '../service/installation.service';
import { IInstallation, Installation } from '../installation.model';

import { InstallationUpdateComponent } from './installation-update.component';

describe('Installation Management Update Component', () => {
  let comp: InstallationUpdateComponent;
  let fixture: ComponentFixture<InstallationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let installationService: InstallationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [InstallationUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(InstallationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InstallationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    installationService = TestBed.inject(InstallationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const installation: IInstallation = { id: 456 };

      activatedRoute.data = of({ installation });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(installation));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Installation>>();
      const installation = { id: 123 };
      jest.spyOn(installationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ installation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: installation }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(installationService.update).toHaveBeenCalledWith(installation);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Installation>>();
      const installation = new Installation();
      jest.spyOn(installationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ installation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: installation }));
      saveSubject.complete();

      // THEN
      expect(installationService.create).toHaveBeenCalledWith(installation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Installation>>();
      const installation = { id: 123 };
      jest.spyOn(installationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ installation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(installationService.update).toHaveBeenCalledWith(installation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
