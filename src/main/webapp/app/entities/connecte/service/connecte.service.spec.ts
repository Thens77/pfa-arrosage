import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IConnecte, Connecte } from '../connecte.model';

import { ConnecteService } from './connecte.service';

describe('Connecte Service', () => {
  let service: ConnecteService;
  let httpMock: HttpTestingController;
  let elemDefault: IConnecte;
  let expectedResult: IConnecte | IConnecte[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ConnecteService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      fonctionnel: false,
      branche: 'AAAAAAA',
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

    it('should create a Connecte', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Connecte()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Connecte', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          fonctionnel: true,
          branche: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Connecte', () => {
      const patchObject = Object.assign({}, new Connecte());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Connecte', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          fonctionnel: true,
          branche: 'BBBBBB',
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

    it('should delete a Connecte', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addConnecteToCollectionIfMissing', () => {
      it('should add a Connecte to an empty array', () => {
        const connecte: IConnecte = { id: 123 };
        expectedResult = service.addConnecteToCollectionIfMissing([], connecte);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(connecte);
      });

      it('should not add a Connecte to an array that contains it', () => {
        const connecte: IConnecte = { id: 123 };
        const connecteCollection: IConnecte[] = [
          {
            ...connecte,
          },
          { id: 456 },
        ];
        expectedResult = service.addConnecteToCollectionIfMissing(connecteCollection, connecte);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Connecte to an array that doesn't contain it", () => {
        const connecte: IConnecte = { id: 123 };
        const connecteCollection: IConnecte[] = [{ id: 456 }];
        expectedResult = service.addConnecteToCollectionIfMissing(connecteCollection, connecte);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(connecte);
      });

      it('should add only unique Connecte to an array', () => {
        const connecteArray: IConnecte[] = [{ id: 123 }, { id: 456 }, { id: 2837 }];
        const connecteCollection: IConnecte[] = [{ id: 123 }];
        expectedResult = service.addConnecteToCollectionIfMissing(connecteCollection, ...connecteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const connecte: IConnecte = { id: 123 };
        const connecte2: IConnecte = { id: 456 };
        expectedResult = service.addConnecteToCollectionIfMissing([], connecte, connecte2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(connecte);
        expect(expectedResult).toContain(connecte2);
      });

      it('should accept null and undefined values', () => {
        const connecte: IConnecte = { id: 123 };
        expectedResult = service.addConnecteToCollectionIfMissing([], null, connecte, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(connecte);
      });

      it('should return initial array if no Connecte is added', () => {
        const connecteCollection: IConnecte[] = [{ id: 123 }];
        expectedResult = service.addConnecteToCollectionIfMissing(connecteCollection, undefined, null);
        expect(expectedResult).toEqual(connecteCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
