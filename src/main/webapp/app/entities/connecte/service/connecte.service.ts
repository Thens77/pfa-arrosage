import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IConnecte, getConnecteIdentifier } from '../connecte.model';
import { ICapteur } from 'app/entities/capteur/capteur.model';

export type EntityResponseType = HttpResponse<IConnecte>;
export type EntityArrayResponseType = HttpResponse<IConnecte[]>;

@Injectable({ providedIn: 'root' })
export class ConnecteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/connectes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(connecte: IConnecte): Observable<EntityResponseType> {
    return this.http.post<IConnecte>(this.resourceUrl, connecte, { observe: 'response' });
  }

  update(connecte: IConnecte): Observable<EntityResponseType> {
    return this.http.put<IConnecte>(`${this.resourceUrl}/${getConnecteIdentifier(connecte) as number}`, connecte, { observe: 'response' });
  }
  Available(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICapteur[]>(`${this.resourceUrl}/Available`, { params: options, observe: 'response' });
  }

  partialUpdate(connecte: IConnecte): Observable<EntityResponseType> {
    return this.http.patch<IConnecte>(`${this.resourceUrl}/${getConnecteIdentifier(connecte) as number}`, connecte, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IConnecte>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IConnecte[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addConnecteToCollectionIfMissing(connecteCollection: IConnecte[], ...connectesToCheck: (IConnecte | null | undefined)[]): IConnecte[] {
    const connectes: IConnecte[] = connectesToCheck.filter(isPresent);
    if (connectes.length > 0) {
      const connecteCollectionIdentifiers = connecteCollection.map(connecteItem => getConnecteIdentifier(connecteItem)!);
      const connectesToAdd = connectes.filter(connecteItem => {
        const connecteIdentifier = getConnecteIdentifier(connecteItem);
        if (connecteIdentifier == null || connecteCollectionIdentifiers.includes(connecteIdentifier)) {
          return false;
        }
        connecteCollectionIdentifiers.push(connecteIdentifier);
        return true;
      });
      return [...connectesToAdd, ...connecteCollection];
    }
    return connecteCollection;
  }
}
