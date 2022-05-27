import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PlanteService } from '../service/plante.service';
import { IPlante, Plante } from '../plante.model';
import { ITypePlante } from 'app/entities/type-plante/type-plante.model';
import { TypePlanteService } from 'app/entities/type-plante/service/type-plante.service';

import { PlanteUpdateComponent } from './plante-update.component';

describe('Plante Management Update Component', () => {
  let comp: PlanteUpdateComponent;
  let fixture: ComponentFixture<PlanteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let planteService: PlanteService;
  let typePlanteService: TypePlanteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PlanteUpdateComponent],
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
      .overrideTemplate(PlanteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PlanteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    planteService = TestBed.inject(PlanteService);
    typePlanteService = TestBed.inject(TypePlanteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call TypePlante query and add missing value', () => {
      const plante: IPlante = { id: 456 };
      const typeplante: ITypePlante = { id: 68952 };
      plante.typeplante = typeplante;

      const typePlanteCollection: ITypePlante[] = [{ id: 61228 }];
      jest.spyOn(typePlanteService, 'query').mockReturnValue(of(new HttpResponse({ body: typePlanteCollection })));
      const additionalTypePlantes = [typeplante];
      const expectedCollection: ITypePlante[] = [...additionalTypePlantes, ...typePlanteCollection];
      jest.spyOn(typePlanteService, 'addTypePlanteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ plante });
      comp.ngOnInit();

      expect(typePlanteService.query).toHaveBeenCalled();
      expect(typePlanteService.addTypePlanteToCollectionIfMissing).toHaveBeenCalledWith(typePlanteCollection, ...additionalTypePlantes);
      expect(comp.typePlantesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const plante: IPlante = { id: 456 };
      const typeplante: ITypePlante = { id: 98386 };
      plante.typeplante = typeplante;

      activatedRoute.data = of({ plante });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(plante));
      expect(comp.typePlantesSharedCollection).toContain(typeplante);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Plante>>();
      const plante = { id: 123 };
      jest.spyOn(planteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ plante });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: plante }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(planteService.update).toHaveBeenCalledWith(plante);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Plante>>();
      const plante = new Plante();
      jest.spyOn(planteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ plante });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: plante }));
      saveSubject.complete();

      // THEN
      expect(planteService.create).toHaveBeenCalledWith(plante);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Plante>>();
      const plante = { id: 123 };
      jest.spyOn(planteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ plante });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(planteService.update).toHaveBeenCalledWith(plante);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackTypePlanteById', () => {
      it('Should return tracked TypePlante primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTypePlanteById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
