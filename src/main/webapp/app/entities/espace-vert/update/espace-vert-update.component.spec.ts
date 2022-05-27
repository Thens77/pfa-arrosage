import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EspaceVertService } from '../service/espace-vert.service';
import { IEspaceVert, EspaceVert } from '../espace-vert.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { EspaceVertUpdateComponent } from './espace-vert-update.component';

describe('EspaceVert Management Update Component', () => {
  let comp: EspaceVertUpdateComponent;
  let fixture: ComponentFixture<EspaceVertUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let espaceVertService: EspaceVertService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EspaceVertUpdateComponent],
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
      .overrideTemplate(EspaceVertUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EspaceVertUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    espaceVertService = TestBed.inject(EspaceVertService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const espaceVert: IEspaceVert = { id: 456 };
      const user: IUser = { id: 99726 };
      espaceVert.user = user;

      const userCollection: IUser[] = [{ id: 39133 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ espaceVert });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const espaceVert: IEspaceVert = { id: 456 };
      const user: IUser = { id: 92101 };
      espaceVert.user = user;

      activatedRoute.data = of({ espaceVert });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(espaceVert));
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EspaceVert>>();
      const espaceVert = { id: 123 };
      jest.spyOn(espaceVertService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ espaceVert });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: espaceVert }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(espaceVertService.update).toHaveBeenCalledWith(espaceVert);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EspaceVert>>();
      const espaceVert = new EspaceVert();
      jest.spyOn(espaceVertService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ espaceVert });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: espaceVert }));
      saveSubject.complete();

      // THEN
      expect(espaceVertService.create).toHaveBeenCalledWith(espaceVert);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EspaceVert>>();
      const espaceVert = { id: 123 };
      jest.spyOn(espaceVertService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ espaceVert });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(espaceVertService.update).toHaveBeenCalledWith(espaceVert);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
