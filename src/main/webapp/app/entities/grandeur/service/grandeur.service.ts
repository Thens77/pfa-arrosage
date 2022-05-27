import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGrandeur, getGrandeurIdentifier } from '../grandeur.model';

export type EntityResponseType = HttpResponse<IGrandeur>;
export type EntityArrayResponseType = HttpResponse<IGrandeur[]>;

@Injectable({ providedIn: 'root' })
export class GrandeurService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/grandeurs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(grandeur: IGrandeur): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(grandeur);
    return this.http
      .post<IGrandeur>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(grandeur: IGrandeur): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(grandeur);
    return this.http
      .put<IGrandeur>(`${this.resourceUrl}/${getGrandeurIdentifier(grandeur) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(grandeur: IGrandeur): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(grandeur);
    return this.http
      .patch<IGrandeur>(`${this.resourceUrl}/${getGrandeurIdentifier(grandeur) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IGrandeur>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }
  query(id? : number): Observable<EntityArrayResponseType> {
    if(id === undefined){
      return this.http.get<IGrandeur[]>(this.resourceUrl, {  observe: 'response' });
    }
    else{
      return this.http.get<IGrandeur[]>(`${this.resourceUrl}/zone/${id}`, {  observe: 'response' });
    }
   
  }
  query2(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IGrandeur[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addGrandeurToCollectionIfMissing(grandeurCollection: IGrandeur[], ...grandeursToCheck: (IGrandeur | null | undefined)[]): IGrandeur[] {
    const grandeurs: IGrandeur[] = grandeursToCheck.filter(isPresent);
    if (grandeurs.length > 0) {
      const grandeurCollectionIdentifiers = grandeurCollection.map(grandeurItem => getGrandeurIdentifier(grandeurItem)!);
      const grandeursToAdd = grandeurs.filter(grandeurItem => {
        const grandeurIdentifier = getGrandeurIdentifier(grandeurItem);
        if (grandeurIdentifier == null || grandeurCollectionIdentifiers.includes(grandeurIdentifier)) {
          return false;
        }
        grandeurCollectionIdentifiers.push(grandeurIdentifier);
        return true;
      });
      return [...grandeursToAdd, ...grandeurCollection];
    }
    return grandeurCollection;
  }

  protected convertDateFromClient(grandeur: IGrandeur): IGrandeur {
    return Object.assign({}, grandeur, {
      date: grandeur.date?.isValid() ? grandeur.date.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((grandeur: IGrandeur) => {
        grandeur.date = grandeur.date ? dayjs(grandeur.date) : undefined;
      });
    }
    return res;
  }
}
