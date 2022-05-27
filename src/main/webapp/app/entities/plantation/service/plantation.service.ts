import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPlantation, getPlantationIdentifier } from '../plantation.model';

export type EntityResponseType = HttpResponse<IPlantation>;
export type EntityArrayResponseType = HttpResponse<IPlantation[]>;

@Injectable({ providedIn: 'root' })
export class PlantationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/plantations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(plantation: IPlantation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(plantation);
    return this.http
      .post<IPlantation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(plantation: IPlantation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(plantation);
    return this.http
      .put<IPlantation>(`${this.resourceUrl}/${getPlantationIdentifier(plantation) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(plantation: IPlantation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(plantation);
    return this.http
      .patch<IPlantation>(`${this.resourceUrl}/${getPlantationIdentifier(plantation) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPlantation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPlantation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPlantationToCollectionIfMissing(
    plantationCollection: IPlantation[],
    ...plantationsToCheck: (IPlantation | null | undefined)[]
  ): IPlantation[] {
    const plantations: IPlantation[] = plantationsToCheck.filter(isPresent);
    if (plantations.length > 0) {
      const plantationCollectionIdentifiers = plantationCollection.map(plantationItem => getPlantationIdentifier(plantationItem)!);
      const plantationsToAdd = plantations.filter(plantationItem => {
        const plantationIdentifier = getPlantationIdentifier(plantationItem);
        if (plantationIdentifier == null || plantationCollectionIdentifiers.includes(plantationIdentifier)) {
          return false;
        }
        plantationCollectionIdentifiers.push(plantationIdentifier);
        return true;
      });
      return [...plantationsToAdd, ...plantationCollection];
    }
    return plantationCollection;
  }

  protected convertDateFromClient(plantation: IPlantation): IPlantation {
    return Object.assign({}, plantation, {
      date: plantation.date?.isValid() ? plantation.date.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((plantation: IPlantation) => {
        plantation.date = plantation.date ? dayjs(plantation.date) : undefined;
      });
    }
    return res;
  }
}
