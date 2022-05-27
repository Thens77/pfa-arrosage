import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITypeSol, TypeSol } from '../type-sol.model';

import { TypeSolService } from './type-sol.service';

describe('TypeSol Service', () => {
  let service: TypeSolService;
  let httpMock: HttpTestingController;
  let elemDefault: ITypeSol;
  let expectedResult: ITypeSol | ITypeSol[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TypeSolService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      libelle: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a TypeSol', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new TypeSol()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TypeSol', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          libelle: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TypeSol', () => {
      const patchObject = Object.assign({}, new TypeSol());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TypeSol', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          libelle: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a TypeSol', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTypeSolToCollectionIfMissing', () => {
      it('should add a TypeSol to an empty array', () => {
        const typeSol: ITypeSol = { id: 123 };
        expectedResult = service.addTypeSolToCollectionIfMissing([], typeSol);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(typeSol);
      });

      it('should not add a TypeSol to an array that contains it', () => {
        const typeSol: ITypeSol = { id: 123 };
        const typeSolCollection: ITypeSol[] = [
          {
            ...typeSol,
          },
          { id: 456 },
        ];
        expectedResult = service.addTypeSolToCollectionIfMissing(typeSolCollection, typeSol);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TypeSol to an array that doesn't contain it", () => {
        const typeSol: ITypeSol = { id: 123 };
        const typeSolCollection: ITypeSol[] = [{ id: 456 }];
        expectedResult = service.addTypeSolToCollectionIfMissing(typeSolCollection, typeSol);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(typeSol);
      });

      it('should add only unique TypeSol to an array', () => {
        const typeSolArray: ITypeSol[] = [{ id: 123 }, { id: 456 }, { id: 71772 }];
        const typeSolCollection: ITypeSol[] = [{ id: 123 }];
        expectedResult = service.addTypeSolToCollectionIfMissing(typeSolCollection, ...typeSolArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const typeSol: ITypeSol = { id: 123 };
        const typeSol2: ITypeSol = { id: 456 };
        expectedResult = service.addTypeSolToCollectionIfMissing([], typeSol, typeSol2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(typeSol);
        expect(expectedResult).toContain(typeSol2);
      });

      it('should accept null and undefined values', () => {
        const typeSol: ITypeSol = { id: 123 };
        expectedResult = service.addTypeSolToCollectionIfMissing([], null, typeSol, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(typeSol);
      });

      it('should return initial array if no TypeSol is added', () => {
        const typeSolCollection: ITypeSol[] = [{ id: 123 }];
        expectedResult = service.addTypeSolToCollectionIfMissing(typeSolCollection, undefined, null);
        expect(expectedResult).toEqual(typeSolCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
