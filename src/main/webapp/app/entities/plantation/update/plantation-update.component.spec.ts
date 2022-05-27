import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PlantationService } from '../service/plantation.service';
import { IPlantation, Plantation } from '../plantation.model';
import { IPlante } from 'app/entities/plante/plante.model';
import { PlanteService } from 'app/entities/plante/service/plante.service';
import { IZone } from 'app/entities/zone/zone.model';
import { ZoneService } from 'app/entities/zone/service/zone.service';

import { PlantationUpdateComponent } from './plantation-update.component';

describe('Plantation Management Update Component', () => {
  let comp: PlantationUpdateComponent;
  let fixture: ComponentFixture<PlantationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let plantationService: PlantationService;
  let planteService: PlanteService;
  let zoneService: ZoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PlantationUpdateComponent],
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
      .overrideTemplate(PlantationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PlantationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    plantationService = TestBed.inject(PlantationService);
    planteService = TestBed.inject(PlanteService);
    zoneService = TestBed.inject(ZoneService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Plante query and add missing value', () => {
      const plantation: IPlantation = { id: 456 };
      const plante: IPlante = { id: 58248 };
      plantation.plante = plante;

      const planteCollection: IPlante[] = [{ id: 64532 }];
      jest.spyOn(planteService, 'query').mockReturnValue(of(new HttpResponse({ body: planteCollection })));
      const additionalPlantes = [plante];
      const expectedCollection: IPlante[] = [...additionalPlantes, ...planteCollection];
      jest.spyOn(planteService, 'addPlanteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ plantation });
      comp.ngOnInit();

      expect(planteService.query).toHaveBeenCalled();
      expect(planteService.addPlanteToCollectionIfMissing).toHaveBeenCalledWith(planteCollection, ...additionalPlantes);
      expect(comp.plantesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Zone query and add missing value', () => {
      const plantation: IPlantation = { id: 456 };
      const zone: IZone = { id: 60622 };
      plantation.zone = zone;

      const zoneCollection: IZone[] = [{ id: 81462 }];
      jest.spyOn(zoneService, 'query').mockReturnValue(of(new HttpResponse({ body: zoneCollection })));
      const additionalZones = [zone];
      const expectedCollection: IZone[] = [...additionalZones, ...zoneCollection];
      jest.spyOn(zoneService, 'addZoneToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ plantation });
      comp.ngOnInit();

      expect(zoneService.query).toHaveBeenCalled();
      expect(zoneService.addZoneToCollectionIfMissing).toHaveBeenCalledWith(zoneCollection, ...additionalZones);
      expect(comp.zonesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const plantation: IPlantation = { id: 456 };
      const plante: IPlante = { id: 25333 };
      plantation.plante = plante;
      const zone: IZone = { id: 78101 };
      plantation.zone = zone;

      activatedRoute.data = of({ plantation });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(plantation));
      expect(comp.plantesSharedCollection).toContain(plante);
      expect(comp.zonesSharedCollection).toContain(zone);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Plantation>>();
      const plantation = { id: 123 };
      jest.spyOn(plantationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ plantation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: plantation }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(plantationService.update).toHaveBeenCalledWith(plantation);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Plantation>>();
      const plantation = new Plantation();
      jest.spyOn(plantationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ plantation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: plantation }));
      saveSubject.complete();

      // THEN
      expect(plantationService.create).toHaveBeenCalledWith(plantation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Plantation>>();
      const plantation = { id: 123 };
      jest.spyOn(plantationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ plantation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(plantationService.update).toHaveBeenCalledWith(plantation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackPlanteById', () => {
      it('Should return tracked Plante primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPlanteById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackZoneById', () => {
      it('Should return tracked Zone primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackZoneById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
