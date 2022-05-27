import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITypePlante, getTypePlanteIdentifier } from '../type-plante.model';

export type EntityResponseType = HttpResponse<ITypePlante>;
export type EntityArrayResponseType = HttpResponse<ITypePlante[]>;

@Injectable({ providedIn: 'root' })
export class TypePlanteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/type-plantes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(typePlante: ITypePlante): Observable<EntityResponseType> {
    return this.http.post<ITypePlante>(this.resourceUrl, typePlante, { observe: 'response' });
  }

  update(typePlante: ITypePlante): Observable<EntityResponseType> {
    return this.http.put<ITypePlante>(`${this.resourceUrl}/${getTypePlanteIdentifier(typePlante) as number}`, typePlante, {
      observe: 'response',
    });
  }

  partialUpdate(typePlante: ITypePlante): Observable<EntityResponseType> {
    return this.http.patch<ITypePlante>(`${this.resourceUrl}/${getTypePlanteIdentifier(typePlante) as number}`, typePlante, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITypePlante>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITypePlante[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTypePlanteToCollectionIfMissing(
    typePlanteCollection: ITypePlante[],
    ...typePlantesToCheck: (ITypePlante | null | undefined)[]
  ): ITypePlante[] {
    const typePlantes: ITypePlante[] = typePlantesToCheck.filter(isPresent);
    if (typePlantes.length > 0) {
      const typePlanteCollectionIdentifiers = typePlanteCollection.map(typePlanteItem => getTypePlanteIdentifier(typePlanteItem)!);
      const typePlantesToAdd = typePlantes.filter(typePlanteItem => {
        const typePlanteIdentifier = getTypePlanteIdentifier(typePlanteItem);
        if (typePlanteIdentifier == null || typePlanteCollectionIdentifiers.includes(typePlanteIdentifier)) {
          return false;
        }
        typePlanteCollectionIdentifiers.push(typePlanteIdentifier);
        return true;
      });
      return [...typePlantesToAdd, ...typePlanteCollection];
    }
    return typePlanteCollection;
  }
}
