import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TypePlanteService } from '../service/type-plante.service';
import { ITypePlante, TypePlante } from '../type-plante.model';

import { TypePlanteUpdateComponent } from './type-plante-update.component';

describe('TypePlante Management Update Component', () => {
  let comp: TypePlanteUpdateComponent;
  let fixture: ComponentFixture<TypePlanteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let typePlanteService: TypePlanteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TypePlanteUpdateComponent],
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
      .overrideTemplate(TypePlanteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TypePlanteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    typePlanteService = TestBed.inject(TypePlanteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const typePlante: ITypePlante = { id: 456 };

      activatedRoute.data = of({ typePlante });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(typePlante));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TypePlante>>();
      const typePlante = { id: 123 };
      jest.spyOn(typePlanteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typePlante });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: typePlante }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(typePlanteService.update).toHaveBeenCalledWith(typePlante);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TypePlante>>();
      const typePlante = new TypePlante();
      jest.spyOn(typePlanteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typePlante });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: typePlante }));
      saveSubject.complete();

      // THEN
      expect(typePlanteService.create).toHaveBeenCalledWith(typePlante);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TypePlante>>();
      const typePlante = { id: 123 };
      jest.spyOn(typePlanteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typePlante });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(typePlanteService.update).toHaveBeenCalledWith(typePlante);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
