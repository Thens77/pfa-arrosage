import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IInstallation, Installation } from '../installation.model';

import { InstallationService } from './installation.service';

describe('Installation Service', () => {
  let service: InstallationService;
  let httpMock: HttpTestingController;
  let elemDefault: IInstallation;
  let expectedResult: IInstallation | IInstallation[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(InstallationService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      dateDebut: currentDate,
      dateFin: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          dateDebut: currentDate.format(DATE_FORMAT),
          dateFin: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Installation', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dateDebut: currentDate.format(DATE_FORMAT),
          dateFin: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateDebut: currentDate,
          dateFin: currentDate,
        },
        returnedFromService
      );

      service.create(new Installation()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Installation', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          dateDebut: currentDate.format(DATE_FORMAT),
          dateFin: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateDebut: currentDate,
          dateFin: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Installation', () => {
      const patchObject = Object.assign(
        {
          dateDebut: currentDate.format(DATE_FORMAT),
        },
        new Installation()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dateDebut: currentDate,
          dateFin: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Installation', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          dateDebut: currentDate.format(DATE_FORMAT),
          dateFin: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateDebut: currentDate,
          dateFin: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Installation', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addInstallationToCollectionIfMissing', () => {
      it('should add a Installation to an empty array', () => {
        const installation: IInstallation = { id: 123 };
        expectedResult = service.addInstallationToCollectionIfMissing([], installation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(installation);
      });

      it('should not add a Installation to an array that contains it', () => {
        const installation: IInstallation = { id: 123 };
        const installationCollection: IInstallation[] = [
          {
            ...installation,
          },
          { id: 456 },
        ];
        expectedResult = service.addInstallationToCollectionIfMissing(installationCollection, installation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Installation to an array that doesn't contain it", () => {
        const installation: IInstallation = { id: 123 };
        const installationCollection: IInstallation[] = [{ id: 456 }];
        expectedResult = service.addInstallationToCollectionIfMissing(installationCollection, installation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(installation);
      });

      it('should add only unique Installation to an array', () => {
        const installationArray: IInstallation[] = [{ id: 123 }, { id: 456 }, { id: 7587 }];
        const installationCollection: IInstallation[] = [{ id: 123 }];
        expectedResult = service.addInstallationToCollectionIfMissing(installationCollection, ...installationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const installation: IInstallation = { id: 123 };
        const installation2: IInstallation = { id: 456 };
        expectedResult = service.addInstallationToCollectionIfMissing([], installation, installation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(installation);
        expect(expectedResult).toContain(installation2);
      });

      it('should accept null and undefined values', () => {
        const installation: IInstallation = { id: 123 };
        expectedResult = service.addInstallationToCollectionIfMissing([], null, installation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(installation);
      });

      it('should return initial array if no Installation is added', () => {
        const installationCollection: IInstallation[] = [{ id: 123 }];
        expectedResult = service.addInstallationToCollectionIfMissing(installationCollection, undefined, null);
        expect(expectedResult).toEqual(installationCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
