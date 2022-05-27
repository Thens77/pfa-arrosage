import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IInstallation, Installation } from '../installation.model';
import { InstallationService } from '../service/installation.service';

@Injectable({ providedIn: 'root' })
export class InstallationRoutingResolveService implements Resolve<IInstallation> {
  constructor(protected service: InstallationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IInstallation> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((installation: HttpResponse<Installation>) => {
          if (installation.body) {
            return of(installation.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Installation());
  }
}
