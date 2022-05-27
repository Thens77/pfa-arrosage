import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBoitier, Boitier } from '../boitier.model';

import { BoitierService } from './boitier.service';

describe('Boitier Service', () => {
  let service: BoitierService;
  let httpMock: HttpTestingController;
  let elemDefault: IBoitier;
  let expectedResult: IBoitier | IBoitier[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BoitierService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      refrence: 'AAAAAAA',
      nbrBranche: 0,
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

    it('should create a Boitier', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Boitier()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Boitier', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          refrence: 'BBBBBB',
          nbrBranche: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Boitier', () => {
      const patchObject = Object.assign(
        {
          refrence: 'BBBBBB',
        },
        new Boitier()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Boitier', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          refrence: 'BBBBBB',
          nbrBranche: 1,
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

    it('should delete a Boitier', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addBoitierToCollectionIfMissing', () => {
      it('should add a Boitier to an empty array', () => {
        const boitier: IBoitier = { id: 123 };
        expectedResult = service.addBoitierToCollectionIfMissing([], boitier);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(boitier);
      });

      it('should not add a Boitier to an array that contains it', () => {
        const boitier: IBoitier = { id: 123 };
        const boitierCollection: IBoitier[] = [
          {
            ...boitier,
          },
          { id: 456 },
        ];
        expectedResult = service.addBoitierToCollectionIfMissing(boitierCollection, boitier);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Boitier to an array that doesn't contain it", () => {
        const boitier: IBoitier = { id: 123 };
        const boitierCollection: IBoitier[] = [{ id: 456 }];
        expectedResult = service.addBoitierToCollectionIfMissing(boitierCollection, boitier);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(boitier);
      });

      it('should add only unique Boitier to an array', () => {
        const boitierArray: IBoitier[] = [{ id: 123 }, { id: 456 }, { id: 20147 }];
        const boitierCollection: IBoitier[] = [{ id: 123 }];
        expectedResult = service.addBoitierToCollectionIfMissing(boitierCollection, ...boitierArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const boitier: IBoitier = { id: 123 };
        const boitier2: IBoitier = { id: 456 };
        expectedResult = service.addBoitierToCollectionIfMissing([], boitier, boitier2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(boitier);
        expect(expectedResult).toContain(boitier2);
      });

      it('should accept null and undefined values', () => {
        const boitier: IBoitier = { id: 123 };
        expectedResult = service.addBoitierToCollectionIfMissing([], null, boitier, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(boitier);
      });

      it('should return initial array if no Boitier is added', () => {
        const boitierCollection: IBoitier[] = [{ id: 123 }];
        expectedResult = service.addBoitierToCollectionIfMissing(boitierCollection, undefined, null);
        expect(expectedResult).toEqual(boitierCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
