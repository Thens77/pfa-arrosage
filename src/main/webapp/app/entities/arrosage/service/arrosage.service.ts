import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IArrosage, getArrosageIdentifier } from '../arrosage.model';

export type EntityResponseType = HttpResponse<IArrosage>;
export type EntityArrayResponseType = HttpResponse<IArrosage[]>;

@Injectable({ providedIn: 'root' })
export class ArrosageService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/arrosages');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(arrosage: IArrosage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(arrosage);
    return this.http
      .post<IArrosage>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(arrosage: IArrosage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(arrosage);
    return this.http
      .put<IArrosage>(`${this.resourceUrl}/${getArrosageIdentifier(arrosage) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(arrosage: IArrosage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(arrosage);
    return this.http
      .patch<IArrosage>(`${this.resourceUrl}/${getArrosageIdentifier(arrosage) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IArrosage>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IArrosage[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addArrosageToCollectionIfMissing(arrosageCollection: IArrosage[], ...arrosagesToCheck: (IArrosage | null | undefined)[]): IArrosage[] {
    const arrosages: IArrosage[] = arrosagesToCheck.filter(isPresent);
    if (arrosages.length > 0) {
      const arrosageCollectionIdentifiers = arrosageCollection.map(arrosageItem => getArrosageIdentifier(arrosageItem)!);
      const arrosagesToAdd = arrosages.filter(arrosageItem => {
        const arrosageIdentifier = getArrosageIdentifier(arrosageItem);
        if (arrosageIdentifier == null || arrosageCollectionIdentifiers.includes(arrosageIdentifier)) {
          return false;
        }
        arrosageCollectionIdentifiers.push(arrosageIdentifier);
        return true;
      });
      return [...arrosagesToAdd, ...arrosageCollection];
    }
    return arrosageCollection;
  }

  protected convertDateFromClient(arrosage: IArrosage): IArrosage {
    return Object.assign({}, arrosage, {
      date: arrosage.date?.isValid() ? arrosage.date.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((arrosage: IArrosage) => {
        arrosage.date = arrosage.date ? dayjs(arrosage.date) : undefined;
      });
    }
    return res;
  }
}
