import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TypeSolService } from '../service/type-sol.service';
import { ITypeSol, TypeSol } from '../type-sol.model';

import { TypeSolUpdateComponent } from './type-sol-update.component';

describe('TypeSol Management Update Component', () => {
  let comp: TypeSolUpdateComponent;
  let fixture: ComponentFixture<TypeSolUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let typeSolService: TypeSolService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TypeSolUpdateComponent],
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
      .overrideTemplate(TypeSolUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TypeSolUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    typeSolService = TestBed.inject(TypeSolService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const typeSol: ITypeSol = { id: 456 };

      activatedRoute.data = of({ typeSol });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(typeSol));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TypeSol>>();
      const typeSol = { id: 123 };
      jest.spyOn(typeSolService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeSol });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: typeSol }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(typeSolService.update).toHaveBeenCalledWith(typeSol);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TypeSol>>();
      const typeSol = new TypeSol();
      jest.spyOn(typeSolService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeSol });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: typeSol }));
      saveSubject.complete();

      // THEN
      expect(typeSolService.create).toHaveBeenCalledWith(typeSol);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TypeSol>>();
      const typeSol = { id: 123 };
      jest.spyOn(typeSolService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeSol });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(typeSolService.update).toHaveBeenCalledWith(typeSol);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
