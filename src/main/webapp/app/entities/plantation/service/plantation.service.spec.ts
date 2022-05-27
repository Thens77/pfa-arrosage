import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IPlantation, Plantation } from '../plantation.model';

import { PlantationService } from './plantation.service';

describe('Plantation Service', () => {
  let service: PlantationService;
  let httpMock: HttpTestingController;
  let elemDefault: IPlantation;
  let expectedResult: IPlantation | IPlantation[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PlantationService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      date: currentDate,
      nbrPlante: 0,
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

    it('should create a Plantation', () => {
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

      service.create(new Plantation()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Plantation', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          date: currentDate.format(DATE_FORMAT),
          nbrPlante: 1,
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

    it('should partial update a Plantation', () => {
      const patchObject = Object.assign({}, new Plantation());

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

    it('should return a list of Plantation', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          date: currentDate.format(DATE_FORMAT),
          nbrPlante: 1,
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

    it('should delete a Plantation', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPlantationToCollectionIfMissing', () => {
      it('should add a Plantation to an empty array', () => {
        const plantation: IPlantation = { id: 123 };
        expectedResult = service.addPlantationToCollectionIfMissing([], plantation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(plantation);
      });

      it('should not add a Plantation to an array that contains it', () => {
        const plantation: IPlantation = { id: 123 };
        const plantationCollection: IPlantation[] = [
          {
            ...plantation,
          },
          { id: 456 },
        ];
        expectedResult = service.addPlantationToCollectionIfMissing(plantationCollection, plantation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Plantation to an array that doesn't contain it", () => {
        const plantation: IPlantation = { id: 123 };
        const plantationCollection: IPlantation[] = [{ id: 456 }];
        expectedResult = service.addPlantationToCollectionIfMissing(plantationCollection, plantation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(plantation);
      });

      it('should add only unique Plantation to an array', () => {
        const plantationArray: IPlantation[] = [{ id: 123 }, { id: 456 }, { id: 45150 }];
        const plantationCollection: IPlantation[] = [{ id: 123 }];
        expectedResult = service.addPlantationToCollectionIfMissing(plantationCollection, ...plantationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const plantation: IPlantation = { id: 123 };
        const plantation2: IPlantation = { id: 456 };
        expectedResult = service.addPlantationToCollectionIfMissing([], plantation, plantation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(plantation);
        expect(expectedResult).toContain(plantation2);
      });

      it('should accept null and undefined values', () => {
        const plantation: IPlantation = { id: 123 };
        expectedResult = service.addPlantationToCollectionIfMissing([], null, plantation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(plantation);
      });

      it('should return initial array if no Plantation is added', () => {
        const plantationCollection: IPlantation[] = [{ id: 123 }];
        expectedResult = service.addPlantationToCollectionIfMissing(plantationCollection, undefined, null);
        expect(expectedResult).toEqual(plantationCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
