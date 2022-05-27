import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITypePlante, TypePlante } from '../type-plante.model';

import { TypePlanteService } from './type-plante.service';

describe('TypePlante Service', () => {
  let service: TypePlanteService;
  let httpMock: HttpTestingController;
  let elemDefault: ITypePlante;
  let expectedResult: ITypePlante | ITypePlante[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TypePlanteService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      humiditeMin: 0,
      humiditeMax: 0,
      temperatureMin: 0,
      temperatureMax: 0,
      limunosite: 0,
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

    it('should create a TypePlante', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new TypePlante()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TypePlante', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          humiditeMin: 1,
          humiditeMax: 1,
          temperatureMin: 1,
          temperatureMax: 1,
          limunosite: 1,
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

    it('should partial update a TypePlante', () => {
      const patchObject = Object.assign(
        {
          humiditeMin: 1,
          humiditeMax: 1,
          temperatureMin: 1,
        },
        new TypePlante()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TypePlante', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          humiditeMin: 1,
          humiditeMax: 1,
          temperatureMin: 1,
          temperatureMax: 1,
          limunosite: 1,
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

    it('should delete a TypePlante', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTypePlanteToCollectionIfMissing', () => {
      it('should add a TypePlante to an empty array', () => {
        const typePlante: ITypePlante = { id: 123 };
        expectedResult = service.addTypePlanteToCollectionIfMissing([], typePlante);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(typePlante);
      });

      it('should not add a TypePlante to an array that contains it', () => {
        const typePlante: ITypePlante = { id: 123 };
        const typePlanteCollection: ITypePlante[] = [
          {
            ...typePlante,
          },
          { id: 456 },
        ];
        expectedResult = service.addTypePlanteToCollectionIfMissing(typePlanteCollection, typePlante);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TypePlante to an array that doesn't contain it", () => {
        const typePlante: ITypePlante = { id: 123 };
        const typePlanteCollection: ITypePlante[] = [{ id: 456 }];
        expectedResult = service.addTypePlanteToCollectionIfMissing(typePlanteCollection, typePlante);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(typePlante);
      });

      it('should add only unique TypePlante to an array', () => {
        const typePlanteArray: ITypePlante[] = [{ id: 123 }, { id: 456 }, { id: 63786 }];
        const typePlanteCollection: ITypePlante[] = [{ id: 123 }];
        expectedResult = service.addTypePlanteToCollectionIfMissing(typePlanteCollection, ...typePlanteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const typePlante: ITypePlante = { id: 123 };
        const typePlante2: ITypePlante = { id: 456 };
        expectedResult = service.addTypePlanteToCollectionIfMissing([], typePlante, typePlante2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(typePlante);
        expect(expectedResult).toContain(typePlante2);
      });

      it('should accept null and undefined values', () => {
        const typePlante: ITypePlante = { id: 123 };
        expectedResult = service.addTypePlanteToCollectionIfMissing([], null, typePlante, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(typePlante);
      });

      it('should return initial array if no TypePlante is added', () => {
        const typePlanteCollection: ITypePlante[] = [{ id: 123 }];
        expectedResult = service.addTypePlanteToCollectionIfMissing(typePlanteCollection, undefined, null);
        expect(expectedResult).toEqual(typePlanteCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
