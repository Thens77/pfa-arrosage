import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITypeSol, getTypeSolIdentifier } from '../type-sol.model';

export type EntityResponseType = HttpResponse<ITypeSol>;
export type EntityArrayResponseType = HttpResponse<ITypeSol[]>;

@Injectable({ providedIn: 'root' })
export class TypeSolService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/type-sols');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(typeSol: ITypeSol): Observable<EntityResponseType> {
    return this.http.post<ITypeSol>(this.resourceUrl, typeSol, { observe: 'response' });
  }

  update(typeSol: ITypeSol): Observable<EntityResponseType> {
    return this.http.put<ITypeSol>(`${this.resourceUrl}/${getTypeSolIdentifier(typeSol) as number}`, typeSol, { observe: 'response' });
  }

  partialUpdate(typeSol: ITypeSol): Observable<EntityResponseType> {
    return this.http.patch<ITypeSol>(`${this.resourceUrl}/${getTypeSolIdentifier(typeSol) as number}`, typeSol, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITypeSol>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
  query(id? : number): Observable<EntityArrayResponseType> {
    if(id === undefined){
      return this.http.get<ITypeSol[]>(this.resourceUrl, {  observe: 'response' });
    }
    else{
      return this.http.get<ITypeSol[]>(`${this.resourceUrl}/zone/${id}`, {  observe: 'response' });
    }
   
  }
  query2(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITypeSol[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTypeSolToCollectionIfMissing(typeSolCollection: ITypeSol[], ...typeSolsToCheck: (ITypeSol | null | undefined)[]): ITypeSol[] {
    const typeSols: ITypeSol[] = typeSolsToCheck.filter(isPresent);
    if (typeSols.length > 0) {
      const typeSolCollectionIdentifiers = typeSolCollection.map(typeSolItem => getTypeSolIdentifier(typeSolItem)!);
      const typeSolsToAdd = typeSols.filter(typeSolItem => {
        const typeSolIdentifier = getTypeSolIdentifier(typeSolItem);
        if (typeSolIdentifier == null || typeSolCollectionIdentifiers.includes(typeSolIdentifier)) {
          return false;
        }
        typeSolCollectionIdentifiers.push(typeSolIdentifier);
        return true;
      });
      return [...typeSolsToAdd, ...typeSolCollection];
    }
    return typeSolCollection;
  }
}
