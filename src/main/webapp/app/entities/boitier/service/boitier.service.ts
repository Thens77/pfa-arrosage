import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBoitier, getBoitierIdentifier } from '../boitier.model';

export type EntityResponseType = HttpResponse<IBoitier>;
export type EntityArrayResponseType = HttpResponse<IBoitier[]>;

@Injectable({ providedIn: 'root' })
export class BoitierService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/boitiers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(boitier: IBoitier): Observable<EntityResponseType> {
    return this.http.post<IBoitier>(this.resourceUrl, boitier, { observe: 'response' });
  }

  update(boitier: IBoitier): Observable<EntityResponseType> {
    return this.http.put<IBoitier>(`${this.resourceUrl}/${getBoitierIdentifier(boitier) as number}`, boitier, { observe: 'response' });
  }

  partialUpdate(boitier: IBoitier): Observable<EntityResponseType> {
    return this.http.patch<IBoitier>(`${this.resourceUrl}/${getBoitierIdentifier(boitier) as number}`, boitier, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBoitier>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
  query(id? : number): Observable<EntityArrayResponseType> {
    if(id === undefined){
      return this.http.get<IBoitier[]>(this.resourceUrl, {  observe: 'response' });
    }
    else{
      return this.http.get<IBoitier[]>(`${this.resourceUrl}/zone/${id}`, {  observe: 'response' });
    }
   
  }
  queryboitiers(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBoitier[]>(`${this.resourceUrl}/boitiersdispo`, { params: options, observe: 'response' });
  }
  query2(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBoitier[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBoitierToCollectionIfMissing(boitierCollection: IBoitier[], ...boitiersToCheck: (IBoitier | null | undefined)[]): IBoitier[] {
    const boitiers: IBoitier[] = boitiersToCheck.filter(isPresent);
    if (boitiers.length > 0) {
      const boitierCollectionIdentifiers = boitierCollection.map(boitierItem => getBoitierIdentifier(boitierItem)!);
      const boitiersToAdd = boitiers.filter(boitierItem => {
        const boitierIdentifier = getBoitierIdentifier(boitierItem);
        if (boitierIdentifier == null || boitierCollectionIdentifiers.includes(boitierIdentifier)) {
          return false;
        }
        boitierCollectionIdentifiers.push(boitierIdentifier);
        return true;
      });
      return [...boitiersToAdd, ...boitierCollection];
    }
    return boitierCollection;
  }
}
