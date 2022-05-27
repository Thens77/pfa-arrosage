import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IInstallation, getInstallationIdentifier } from '../installation.model';

export type EntityResponseType = HttpResponse<IInstallation>;
export type EntityArrayResponseType = HttpResponse<IInstallation[]>;

@Injectable({ providedIn: 'root' })
export class InstallationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/installations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(installation: IInstallation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(installation);
    return this.http
      .post<IInstallation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(installation: IInstallation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(installation);
    return this.http
      .put<IInstallation>(`${this.resourceUrl}/${getInstallationIdentifier(installation) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(installation: IInstallation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(installation);
    return this.http
      .patch<IInstallation>(`${this.resourceUrl}/${getInstallationIdentifier(installation) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IInstallation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IInstallation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addInstallationToCollectionIfMissing(
    installationCollection: IInstallation[],
    ...installationsToCheck: (IInstallation | null | undefined)[]
  ): IInstallation[] {
    const installations: IInstallation[] = installationsToCheck.filter(isPresent);
    if (installations.length > 0) {
      const installationCollectionIdentifiers = installationCollection.map(
        installationItem => getInstallationIdentifier(installationItem)!
      );
      const installationsToAdd = installations.filter(installationItem => {
        const installationIdentifier = getInstallationIdentifier(installationItem);
        if (installationIdentifier == null || installationCollectionIdentifiers.includes(installationIdentifier)) {
          return false;
        }
        installationCollectionIdentifiers.push(installationIdentifier);
        return true;
      });
      return [...installationsToAdd, ...installationCollection];
    }
    return installationCollection;
  }

  protected convertDateFromClient(installation: IInstallation): IInstallation {
    return Object.assign({}, installation, {
      dateDebut: installation.dateDebut?.isValid() ? installation.dateDebut.format(DATE_FORMAT) : undefined,
      dateFin: installation.dateFin?.isValid() ? installation.dateFin.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateDebut = res.body.dateDebut ? dayjs(res.body.dateDebut) : undefined;
      res.body.dateFin = res.body.dateFin ? dayjs(res.body.dateFin) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((installation: IInstallation) => {
        installation.dateDebut = installation.dateDebut ? dayjs(installation.dateDebut) : undefined;
        installation.dateFin = installation.dateFin ? dayjs(installation.dateFin) : undefined;
      });
    }
    return res;
  }
}
