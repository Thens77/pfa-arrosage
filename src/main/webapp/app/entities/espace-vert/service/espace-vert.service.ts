import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEspaceVert, getEspaceVertIdentifier } from '../espace-vert.model';

export type EntityResponseType = HttpResponse<IEspaceVert>;
export type EntityArrayResponseType = HttpResponse<IEspaceVert[]>;

@Injectable({ providedIn: 'root' })
export class EspaceVertService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/espace-verts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(espaceVert: IEspaceVert): Observable<EntityResponseType> {
    return this.http.post<IEspaceVert>(this.resourceUrl, espaceVert, { observe: 'response' });
  }

  update(espaceVert: IEspaceVert): Observable<EntityResponseType> {
    return this.http.put<IEspaceVert>(`${this.resourceUrl}/${getEspaceVertIdentifier(espaceVert) as number}`, espaceVert, {
      observe: 'response',
    });
  }

  partialUpdate(espaceVert: IEspaceVert): Observable<EntityResponseType> {
    return this.http.patch<IEspaceVert>(`${this.resourceUrl}/${getEspaceVertIdentifier(espaceVert) as number}`, espaceVert, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEspaceVert>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEspaceVert[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEspaceVertToCollectionIfMissing(
    espaceVertCollection: IEspaceVert[],
    ...espaceVertsToCheck: (IEspaceVert | null | undefined)[]
  ): IEspaceVert[] {
    const espaceVerts: IEspaceVert[] = espaceVertsToCheck.filter(isPresent);
    if (espaceVerts.length > 0) {
      const espaceVertCollectionIdentifiers = espaceVertCollection.map(espaceVertItem => getEspaceVertIdentifier(espaceVertItem)!);
      const espaceVertsToAdd = espaceVerts.filter(espaceVertItem => {
        const espaceVertIdentifier = getEspaceVertIdentifier(espaceVertItem);
        if (espaceVertIdentifier == null || espaceVertCollectionIdentifiers.includes(espaceVertIdentifier)) {
          return false;
        }
        espaceVertCollectionIdentifiers.push(espaceVertIdentifier);
        return true;
      });
      return [...espaceVertsToAdd, ...espaceVertCollection];
    }
    return espaceVertCollection;
  }
}
