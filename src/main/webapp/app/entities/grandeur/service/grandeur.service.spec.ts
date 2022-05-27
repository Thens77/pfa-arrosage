import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IGrandeur, Grandeur } from '../grandeur.model';

import { GrandeurService } from './grandeur.service';

describe('Grandeur Service', () => {
  let service: GrandeurService;
  let httpMock: HttpTestingController;
  let elemDefault: IGrandeur;
  let expectedResult: IGrandeur | IGrandeur[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(GrandeurService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      type: 'AAAAAAA',
      valeur: 'AAAAAAA',
      date: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          date: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Grandeur', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          date: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.create(new Grandeur()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Grandeur', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          type: 'BBBBBB',
          valeur: 'BBBBBB',
          date: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Grandeur', () => {
      const patchObject = Object.assign(
        {
          valeur: 'BBBBBB',
        },
        new Grandeur()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Grandeur', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          type: 'BBBBBB',
          valeur: 'BBBBBB',
          date: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Grandeur', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addGrandeurToCollectionIfMissing', () => {
      it('should add a Grandeur to an empty array', () => {
        const grandeur: IGrandeur = { id: 123 };
        expectedResult = service.addGrandeurToCollectionIfMissing([], grandeur);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(grandeur);
      });

      it('should not add a Grandeur to an array that contains it', () => {
        const grandeur: IGrandeur = { id: 123 };
        const grandeurCollection: IGrandeur[] = [
          {
            ...grandeur,
          },
          { id: 456 },
        ];
        expectedResult = service.addGrandeurToCollectionIfMissing(grandeurCollection, grandeur);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Grandeur to an array that doesn't contain it", () => {
        const grandeur: IGrandeur = { id: 123 };
        const grandeurCollection: IGrandeur[] = [{ id: 456 }];
        expectedResult = service.addGrandeurToCollectionIfMissing(grandeurCollection, grandeur);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(grandeur);
      });

      it('should add only unique Grandeur to an array', () => {
        const grandeurArray: IGrandeur[] = [{ id: 123 }, { id: 456 }, { id: 5296 }];
        const grandeurCollection: IGrandeur[] = [{ id: 123 }];
        expectedResult = service.addGrandeurToCollectionIfMissing(grandeurCollection, ...grandeurArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const grandeur: IGrandeur = { id: 123 };
        const grandeur2: IGrandeur = { id: 456 };
        expectedResult = service.addGrandeurToCollectionIfMissing([], grandeur, grandeur2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(grandeur);
        expect(expectedResult).toContain(grandeur2);
      });

      it('should accept null and undefined values', () => {
        const grandeur: IGrandeur = { id: 123 };
        expectedResult = service.addGrandeurToCollectionIfMissing([], null, grandeur, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(grandeur);
      });

      it('should return initial array if no Grandeur is added', () => {
        const grandeurCollection: IGrandeur[] = [{ id: 123 }];
        expectedResult = service.addGrandeurToCollectionIfMissing(grandeurCollection, undefined, null);
        expect(expectedResult).toEqual(grandeurCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
