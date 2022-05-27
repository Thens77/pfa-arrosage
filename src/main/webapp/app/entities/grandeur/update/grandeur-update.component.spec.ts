import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { GrandeurService } from '../service/grandeur.service';
import { IGrandeur, Grandeur } from '../grandeur.model';
import { IZone } from 'app/entities/zone/zone.model';
import { ZoneService } from 'app/entities/zone/service/zone.service';

import { GrandeurUpdateComponent } from './grandeur-update.component';

describe('Grandeur Management Update Component', () => {
  let comp: GrandeurUpdateComponent;
  let fixture: ComponentFixture<GrandeurUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let grandeurService: GrandeurService;
  let zoneService: ZoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [GrandeurUpdateComponent],
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
      .overrideTemplate(GrandeurUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GrandeurUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    grandeurService = TestBed.inject(GrandeurService);
    zoneService = TestBed.inject(ZoneService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Zone query and add missing value', () => {
      const grandeur: IGrandeur = { id: 456 };
      const zone: IZone = { id: 56282 };
      grandeur.zone = zone;

      const zoneCollection: IZone[] = [{ id: 69516 }];
      jest.spyOn(zoneService, 'query').mockReturnValue(of(new HttpResponse({ body: zoneCollection })));
      const additionalZones = [zone];
      const expectedCollection: IZone[] = [...additionalZones, ...zoneCollection];
      jest.spyOn(zoneService, 'addZoneToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ grandeur });
      comp.ngOnInit();

      expect(zoneService.query).toHaveBeenCalled();
      expect(zoneService.addZoneToCollectionIfMissing).toHaveBeenCalledWith(zoneCollection, ...additionalZones);
      expect(comp.zonesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const grandeur: IGrandeur = { id: 456 };
      const zone: IZone = { id: 200 };
      grandeur.zone = zone;

      activatedRoute.data = of({ grandeur });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(grandeur));
      expect(comp.zonesSharedCollection).toContain(zone);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Grandeur>>();
      const grandeur = { id: 123 };
      jest.spyOn(grandeurService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grandeur });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: grandeur }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(grandeurService.update).toHaveBeenCalledWith(grandeur);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Grandeur>>();
      const grandeur = new Grandeur();
      jest.spyOn(grandeurService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grandeur });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: grandeur }));
      saveSubject.complete();

      // THEN
      expect(grandeurService.create).toHaveBeenCalledWith(grandeur);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Grandeur>>();
      const grandeur = { id: 123 };
      jest.spyOn(grandeurService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grandeur });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(grandeurService.update).toHaveBeenCalledWith(grandeur);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackZoneById', () => {
      it('Should return tracked Zone primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackZoneById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
