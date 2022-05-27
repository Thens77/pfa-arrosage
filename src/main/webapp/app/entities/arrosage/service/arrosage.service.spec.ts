import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IArrosage, Arrosage } from '../arrosage.model';

import { ArrosageService } from './arrosage.service';

describe('Arrosage Service', () => {
  let service: ArrosageService;
  let httpMock: HttpTestingController;
  let elemDefault: IArrosage;
  let expectedResult: IArrosage | IArrosage[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ArrosageService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      date: currentDate,
      duree: 0,
      quantiteEau: 0,
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

    it('should create a Arrosage', () => {
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

      service.create(new Arrosage()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Arrosage', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          date: currentDate.format(DATE_FORMAT),
          duree: 1,
          quantiteEau: 1,
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

    it('should partial update a Arrosage', () => {
      const patchObject = Object.assign(
        {
          duree: 1,
        },
        new Arrosage()
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

    it('should return a list of Arrosage', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          date: currentDate.format(DATE_FORMAT),
          duree: 1,
          quantiteEau: 1,
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

    it('should delete a Arrosage', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addArrosageToCollectionIfMissing', () => {
      it('should add a Arrosage to an empty array', () => {
        const arrosage: IArrosage = { id: 123 };
        expectedResult = service.addArrosageToCollectionIfMissing([], arrosage);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(arrosage);
      });

      it('should not add a Arrosage to an array that contains it', () => {
        const arrosage: IArrosage = { id: 123 };
        const arrosageCollection: IArrosage[] = [
          {
            ...arrosage,
          },
          { id: 456 },
        ];
        expectedResult = service.addArrosageToCollectionIfMissing(arrosageCollection, arrosage);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Arrosage to an array that doesn't contain it", () => {
        const arrosage: IArrosage = { id: 123 };
        const arrosageCollection: IArrosage[] = [{ id: 456 }];
        expectedResult = service.addArrosageToCollectionIfMissing(arrosageCollection, arrosage);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(arrosage);
      });

      it('should add only unique Arrosage to an array', () => {
        const arrosageArray: IArrosage[] = [{ id: 123 }, { id: 456 }, { id: 4433 }];
        const arrosageCollection: IArrosage[] = [{ id: 123 }];
        expectedResult = service.addArrosageToCollectionIfMissing(arrosageCollection, ...arrosageArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const arrosage: IArrosage = { id: 123 };
        const arrosage2: IArrosage = { id: 456 };
        expectedResult = service.addArrosageToCollectionIfMissing([], arrosage, arrosage2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(arrosage);
        expect(expectedResult).toContain(arrosage2);
      });

      it('should accept null and undefined values', () => {
        const arrosage: IArrosage = { id: 123 };
        expectedResult = service.addArrosageToCollectionIfMissing([], null, arrosage, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(arrosage);
      });

      it('should return initial array if no Arrosage is added', () => {
        const arrosageCollection: IArrosage[] = [{ id: 123 }];
        expectedResult = service.addArrosageToCollectionIfMissing(arrosageCollection, undefined, null);
        expect(expectedResult).toEqual(arrosageCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
