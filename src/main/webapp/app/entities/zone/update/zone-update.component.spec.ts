import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ZoneService } from '../service/zone.service';
import { IZone, Zone } from '../zone.model';
import { ITypeSol } from 'app/entities/type-sol/type-sol.model';
import { TypeSolService } from 'app/entities/type-sol/service/type-sol.service';
import { IEspaceVert } from 'app/entities/espace-vert/espace-vert.model';
import { EspaceVertService } from 'app/entities/espace-vert/service/espace-vert.service';
import { IBoitier } from 'app/entities/boitier/boitier.model';
import { BoitierService } from 'app/entities/boitier/service/boitier.service';

import { ZoneUpdateComponent } from './zone-update.component';

describe('Zone Management Update Component', () => {
  let comp: ZoneUpdateComponent;
  let fixture: ComponentFixture<ZoneUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let zoneService: ZoneService;
  let typeSolService: TypeSolService;
  let espaceVertService: EspaceVertService;
  let boitierService: BoitierService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ZoneUpdateComponent],
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
      .overrideTemplate(ZoneUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ZoneUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    zoneService = TestBed.inject(ZoneService);
    typeSolService = TestBed.inject(TypeSolService);
    espaceVertService = TestBed.inject(EspaceVertService);
    boitierService = TestBed.inject(BoitierService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call TypeSol query and add missing value', () => {
      const zone: IZone = { id: 456 };
      const typesol: ITypeSol = { id: 15409 };
      zone.typesol = typesol;

      const typeSolCollection: ITypeSol[] = [{ id: 35460 }];
      jest.spyOn(typeSolService, 'query').mockReturnValue(of(new HttpResponse({ body: typeSolCollection })));
      const additionalTypeSols = [typesol];
      const expectedCollection: ITypeSol[] = [...additionalTypeSols, ...typeSolCollection];
      jest.spyOn(typeSolService, 'addTypeSolToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ zone });
      comp.ngOnInit();

      expect(typeSolService.query).toHaveBeenCalled();
      expect(typeSolService.addTypeSolToCollectionIfMissing).toHaveBeenCalledWith(typeSolCollection, ...additionalTypeSols);
      expect(comp.typeSolsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call EspaceVert query and add missing value', () => {
      const zone: IZone = { id: 456 };
      const espaceVert: IEspaceVert = { id: 47113 };
      zone.espaceVert = espaceVert;

      const espaceVertCollection: IEspaceVert[] = [{ id: 63456 }];
      jest.spyOn(espaceVertService, 'query').mockReturnValue(of(new HttpResponse({ body: espaceVertCollection })));
      const additionalEspaceVerts = [espaceVert];
      const expectedCollection: IEspaceVert[] = [...additionalEspaceVerts, ...espaceVertCollection];
      jest.spyOn(espaceVertService, 'addEspaceVertToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ zone });
      comp.ngOnInit();

      expect(espaceVertService.query).toHaveBeenCalled();
      expect(espaceVertService.addEspaceVertToCollectionIfMissing).toHaveBeenCalledWith(espaceVertCollection, ...additionalEspaceVerts);
      expect(comp.espaceVertsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Boitier query and add missing value', () => {
      const zone: IZone = { id: 456 };
      const boitier: IBoitier = { id: 3065 };
      zone.boitier = boitier;

      const boitierCollection: IBoitier[] = [{ id: 86976 }];
      jest.spyOn(boitierService, 'query').mockReturnValue(of(new HttpResponse({ body: boitierCollection })));
      const additionalBoitiers = [boitier];
      const expectedCollection: IBoitier[] = [...additionalBoitiers, ...boitierCollection];
      jest.spyOn(boitierService, 'addBoitierToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ zone });
      comp.ngOnInit();

      expect(boitierService.query).toHaveBeenCalled();
      expect(boitierService.addBoitierToCollectionIfMissing).toHaveBeenCalledWith(boitierCollection, ...additionalBoitiers);
      expect(comp.boitiersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const zone: IZone = { id: 456 };
      const typesol: ITypeSol = { id: 74702 };
      zone.typesol = typesol;
      const espaceVert: IEspaceVert = { id: 38874 };
      zone.espaceVert = espaceVert;
      const boitier: IBoitier = { id: 54814 };
      zone.boitier = boitier;

      activatedRoute.data = of({ zone });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(zone));
      expect(comp.typeSolsSharedCollection).toContain(typesol);
      expect(comp.espaceVertsSharedCollection).toContain(espaceVert);
      expect(comp.boitiersSharedCollection).toContain(boitier);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Zone>>();
      const zone = { id: 123 };
      jest.spyOn(zoneService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ zone });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: zone }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(zoneService.update).toHaveBeenCalledWith(zone);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Zone>>();
      const zone = new Zone();
      jest.spyOn(zoneService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ zone });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: zone }));
      saveSubject.complete();

      // THEN
      expect(zoneService.create).toHaveBeenCalledWith(zone);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Zone>>();
      const zone = { id: 123 };
      jest.spyOn(zoneService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ zone });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(zoneService.update).toHaveBeenCalledWith(zone);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackTypeSolById', () => {
      it('Should return tracked TypeSol primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTypeSolById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackEspaceVertById', () => {
      it('Should return tracked EspaceVert primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEspaceVertById(0, entity);
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
