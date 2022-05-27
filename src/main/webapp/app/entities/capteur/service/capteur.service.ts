import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICapteur, getCapteurIdentifier } from '../capteur.model';

export type EntityResponseType = HttpResponse<ICapteur>;
export type EntityArrayResponseType = HttpResponse<ICapteur[]>;

@Injectable({ providedIn: 'root' })
export class CapteurService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/capteurs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(capteur: ICapteur): Observable<EntityResponseType> {
    return this.http.post<ICapteur>(this.resourceUrl, capteur, { observe: 'response' });
  }

  update(capteur: ICapteur): Observable<EntityResponseType> {
    return this.http.put<ICapteur>(`${this.resourceUrl}/${getCapteurIdentifier(capteur) as number}`, capteur, { observe: 'response' });
  }

  partialUpdate(capteur: ICapteur): Observable<EntityResponseType> {
    return this.http.patch<ICapteur>(`${this.resourceUrl}/${getCapteurIdentifier(capteur) as number}`, capteur, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICapteur>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(id? : number): Observable<EntityArrayResponseType> {
    if(id === undefined){
      return this.http.get<ICapteur[]>(this.resourceUrl, {  observe: 'response' });
    }
    else{
      return this.http.get<ICapteur[]>(`${this.resourceUrl}/boitier/${id}`, {  observe: 'response' });
    }
   
  }

  query2(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICapteur[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCapteurToCollectionIfMissing(capteurCollection: ICapteur[], ...capteursToCheck: (ICapteur | null | undefined)[]): ICapteur[] {
    const capteurs: ICapteur[] = capteursToCheck.filter(isPresent);
    if (capteurs.length > 0) {
      const capteurCollectionIdentifiers = capteurCollection.map(capteurItem => getCapteurIdentifier(capteurItem)!);
      const capteursToAdd = capteurs.filter(capteurItem => {
        const capteurIdentifier = getCapteurIdentifier(capteurItem);
        if (capteurIdentifier == null || capteurCollectionIdentifiers.includes(capteurIdentifier)) {
          return false;
        }
        capteurCollectionIdentifiers.push(capteurIdentifier);
        return true;
      });
      return [...capteursToAdd, ...capteurCollection];
    }
    return capteurCollection;
  }
}
