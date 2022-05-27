import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICapteur, Capteur } from '../capteur.model';

import { CapteurService } from './capteur.service';

describe('Capteur Service', () => {
  let service: CapteurService;
  let httpMock: HttpTestingController;
  let elemDefault: ICapteur;
  let expectedResult: ICapteur | ICapteur[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CapteurService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      type: 'AAAAAAA',
      reference: 'AAAAAAA',
      photoContentType: 'image/png',
      photo: 'AAAAAAA',
      frequence: 0,
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

    it('should create a Capteur', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Capteur()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Capteur', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          type: 'BBBBBB',
          reference: 'BBBBBB',
          photo: 'BBBBBB',
          frequence: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Capteur', () => {
      const patchObject = Object.assign(
        {
          type: 'BBBBBB',
          photo: 'BBBBBB',
        },
        new Capteur()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Capteur', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          type: 'BBBBBB',
          reference: 'BBBBBB',
          photo: 'BBBBBB',
          frequence: 1,
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

    it('should delete a Capteur', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCapteurToCollectionIfMissing', () => {
      it('should add a Capteur to an empty array', () => {
        const capteur: ICapteur = { id: 123 };
        expectedResult = service.addCapteurToCollectionIfMissing([], capteur);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(capteur);
      });

      it('should not add a Capteur to an array that contains it', () => {
        const capteur: ICapteur = { id: 123 };
        const capteurCollection: ICapteur[] = [
          {
            ...capteur,
          },
          { id: 456 },
        ];
        expectedResult = service.addCapteurToCollectionIfMissing(capteurCollection, capteur);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Capteur to an array that doesn't contain it", () => {
        const capteur: ICapteur = { id: 123 };
        const capteurCollection: ICapteur[] = [{ id: 456 }];
        expectedResult = service.addCapteurToCollectionIfMissing(capteurCollection, capteur);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(capteur);
      });

      it('should add only unique Capteur to an array', () => {
        const capteurArray: ICapteur[] = [{ id: 123 }, { id: 456 }, { id: 76500 }];
        const capteurCollection: ICapteur[] = [{ id: 123 }];
        expectedResult = service.addCapteurToCollectionIfMissing(capteurCollection, ...capteurArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const capteur: ICapteur = { id: 123 };
        const capteur2: ICapteur = { id: 456 };
        expectedResult = service.addCapteurToCollectionIfMissing([], capteur, capteur2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(capteur);
        expect(expectedResult).toContain(capteur2);
      });

      it('should accept null and undefined values', () => {
        const capteur: ICapteur = { id: 123 };
        expectedResult = service.addCapteurToCollectionIfMissing([], null, capteur, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(capteur);
      });

      it('should return initial array if no Capteur is added', () => {
        const capteurCollection: ICapteur[] = [{ id: 123 }];
        expectedResult = service.addCapteurToCollectionIfMissing(capteurCollection, undefined, null);
        expect(expectedResult).toEqual(capteurCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
