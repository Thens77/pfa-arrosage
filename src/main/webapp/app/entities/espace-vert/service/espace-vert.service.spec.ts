import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEspaceVert, EspaceVert } from '../espace-vert.model';

import { EspaceVertService } from './espace-vert.service';

describe('EspaceVert Service', () => {
  let service: EspaceVertService;
  let httpMock: HttpTestingController;
  let elemDefault: IEspaceVert;
  let expectedResult: IEspaceVert | IEspaceVert[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EspaceVertService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      libelle: 'AAAAAAA',
      photoContentType: 'image/png',
      photo: 'AAAAAAA',
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

    it('should create a EspaceVert', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new EspaceVert()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EspaceVert', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          libelle: 'BBBBBB',
          photo: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EspaceVert', () => {
      const patchObject = Object.assign(
        {
          libelle: 'BBBBBB',
        },
        new EspaceVert()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EspaceVert', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          libelle: 'BBBBBB',
          photo: 'BBBBBB',
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

    it('should delete a EspaceVert', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEspaceVertToCollectionIfMissing', () => {
      it('should add a EspaceVert to an empty array', () => {
        const espaceVert: IEspaceVert = { id: 123 };
        expectedResult = service.addEspaceVertToCollectionIfMissing([], espaceVert);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(espaceVert);
      });

      it('should not add a EspaceVert to an array that contains it', () => {
        const espaceVert: IEspaceVert = { id: 123 };
        const espaceVertCollection: IEspaceVert[] = [
          {
            ...espaceVert,
          },
          { id: 456 },
        ];
        expectedResult = service.addEspaceVertToCollectionIfMissing(espaceVertCollection, espaceVert);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EspaceVert to an array that doesn't contain it", () => {
        const espaceVert: IEspaceVert = { id: 123 };
        const espaceVertCollection: IEspaceVert[] = [{ id: 456 }];
        expectedResult = service.addEspaceVertToCollectionIfMissing(espaceVertCollection, espaceVert);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(espaceVert);
      });

      it('should add only unique EspaceVert to an array', () => {
        const espaceVertArray: IEspaceVert[] = [{ id: 123 }, { id: 456 }, { id: 45278 }];
        const espaceVertCollection: IEspaceVert[] = [{ id: 123 }];
        expectedResult = service.addEspaceVertToCollectionIfMissing(espaceVertCollection, ...espaceVertArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const espaceVert: IEspaceVert = { id: 123 };
        const espaceVert2: IEspaceVert = { id: 456 };
        expectedResult = service.addEspaceVertToCollectionIfMissing([], espaceVert, espaceVert2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(espaceVert);
        expect(expectedResult).toContain(espaceVert2);
      });

      it('should accept null and undefined values', () => {
        const espaceVert: IEspaceVert = { id: 123 };
        expectedResult = service.addEspaceVertToCollectionIfMissing([], null, espaceVert, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(espaceVert);
      });

      it('should return initial array if no EspaceVert is added', () => {
        const espaceVertCollection: IEspaceVert[] = [{ id: 123 }];
        expectedResult = service.addEspaceVertToCollectionIfMissing(espaceVertCollection, undefined, null);
        expect(expectedResult).toEqual(espaceVertCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
