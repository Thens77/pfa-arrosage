import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BoitierService } from '../service/boitier.service';
import { IBoitier, Boitier } from '../boitier.model';
import { IInstallation } from 'app/entities/installation/installation.model';
import { InstallationService } from 'app/entities/installation/service/installation.service';

import { BoitierUpdateComponent } from './boitier-update.component';

describe('Boitier Management Update Component', () => {
  let comp: BoitierUpdateComponent;
  let fixture: ComponentFixture<BoitierUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let boitierService: BoitierService;
  let installationService: InstallationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BoitierUpdateComponent],
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
      .overrideTemplate(BoitierUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BoitierUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    boitierService = TestBed.inject(BoitierService);
    installationService = TestBed.inject(InstallationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Installation query and add missing value', () => {
      const boitier: IBoitier = { id: 456 };
      const installation: IInstallation = { id: 82068 };
      boitier.installation = installation;

      const installationCollection: IInstallation[] = [{ id: 87243 }];
      jest.spyOn(installationService, 'query').mockReturnValue(of(new HttpResponse({ body: installationCollection })));
      const additionalInstallations = [installation];
      const expectedCollection: IInstallation[] = [...additionalInstallations, ...installationCollection];
      jest.spyOn(installationService, 'addInstallationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ boitier });
      comp.ngOnInit();

      expect(installationService.query).toHaveBeenCalled();
      expect(installationService.addInstallationToCollectionIfMissing).toHaveBeenCalledWith(
        installationCollection,
        ...additionalInstallations
      );
      expect(comp.installationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const boitier: IBoitier = { id: 456 };
      const installation: IInstallation = { id: 29038 };
      boitier.installation = installation;

      activatedRoute.data = of({ boitier });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(boitier));
      expect(comp.installationsSharedCollection).toContain(installation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Boitier>>();
      const boitier = { id: 123 };
      jest.spyOn(boitierService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ boitier });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: boitier }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(boitierService.update).toHaveBeenCalledWith(boitier);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Boitier>>();
      const boitier = new Boitier();
      jest.spyOn(boitierService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ boitier });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: boitier }));
      saveSubject.complete();

      // THEN
      expect(boitierService.create).toHaveBeenCalledWith(boitier);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Boitier>>();
      const boitier = { id: 123 };
      jest.spyOn(boitierService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ boitier });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(boitierService.update).toHaveBeenCalledWith(boitier);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackInstallationById', () => {
      it('Should return tracked Installation primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackInstallationById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
