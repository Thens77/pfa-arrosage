import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ConnecteService } from '../service/connecte.service';
import { IConnecte, Connecte } from '../connecte.model';
import { ICapteur } from 'app/entities/capteur/capteur.model';
import { CapteurService } from 'app/entities/capteur/service/capteur.service';
import { IBoitier } from 'app/entities/boitier/boitier.model';
import { BoitierService } from 'app/entities/boitier/service/boitier.service';

import { ConnecteUpdateComponent } from './connecte-update.component';

describe('Connecte Management Update Component', () => {
  let comp: ConnecteUpdateComponent;
  let fixture: ComponentFixture<ConnecteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let connecteService: ConnecteService;
  let capteurService: CapteurService;
  let boitierService: BoitierService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ConnecteUpdateComponent],
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
      .overrideTemplate(ConnecteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ConnecteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    connecteService = TestBed.inject(ConnecteService);
    capteurService = TestBed.inject(CapteurService);
    boitierService = TestBed.inject(BoitierService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Capteur query and add missing value', () => {
      const connecte: IConnecte = { id: 456 };
      const capteur: ICapteur = { id: 96884 };
      connecte.capteur = capteur;

      const capteurCollection: ICapteur[] = [{ id: 6860 }];
      jest.spyOn(capteurService, 'query').mockReturnValue(of(new HttpResponse({ body: capteurCollection })));
      const additionalCapteurs = [capteur];
      const expectedCollection: ICapteur[] = [...additionalCapteurs, ...capteurCollection];
      jest.spyOn(capteurService, 'addCapteurToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ connecte });
      comp.ngOnInit();

      expect(capteurService.query).toHaveBeenCalled();
      expect(capteurService.addCapteurToCollectionIfMissing).toHaveBeenCalledWith(capteurCollection, ...additionalCapteurs);
      expect(comp.capteursSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Boitier query and add missing value', () => {
      const connecte: IConnecte = { id: 456 };
      const boitier: IBoitier = { id: 10371 };
      connecte.boitier = boitier;

      const boitierCollection: IBoitier[] = [{ id: 86433 }];
      jest.spyOn(boitierService, 'query').mockReturnValue(of(new HttpResponse({ body: boitierCollection })));
      const additionalBoitiers = [boitier];
      const expectedCollection: IBoitier[] = [...additionalBoitiers, ...boitierCollection];
      jest.spyOn(boitierService, 'addBoitierToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ connecte });
      comp.ngOnInit();

      expect(boitierService.query).toHaveBeenCalled();
      expect(boitierService.addBoitierToCollectionIfMissing).toHaveBeenCalledWith(boitierCollection, ...additionalBoitiers);
      expect(comp.boitiersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const connecte: IConnecte = { id: 456 };
      const capteur: ICapteur = { id: 85216 };
      connecte.capteur = capteur;
      const boitier: IBoitier = { id: 69827 };
      connecte.boitier = boitier;

      activatedRoute.data = of({ connecte });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(connecte));
      expect(comp.capteursSharedCollection).toContain(capteur);
      expect(comp.boitiersSharedCollection).toContain(boitier);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Connecte>>();
      const connecte = { id: 123 };
      jest.spyOn(connecteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ connecte });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: connecte }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(connecteService.update).toHaveBeenCalledWith(connecte);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Connecte>>();
      const connecte = new Connecte();
      jest.spyOn(connecteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ connecte });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: connecte }));
      saveSubject.complete();

      // THEN
      expect(connecteService.create).toHaveBeenCalledWith(connecte);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Connecte>>();
      const connecte = { id: 123 };
      jest.spyOn(connecteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ connecte });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(connecteService.update).toHaveBeenCalledWith(connecte);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackCapteurById', () => {
      it('Should return tracked Capteur primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCapteurById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackBoitierById', () => {
      it('Should return tracked Boitier primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackBoitierById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
