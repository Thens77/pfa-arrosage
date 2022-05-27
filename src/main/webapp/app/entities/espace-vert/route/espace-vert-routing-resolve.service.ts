import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEspaceVert, EspaceVert } from '../espace-vert.model';
import { EspaceVertService } from '../service/espace-vert.service';

@Injectable({ providedIn: 'root' })
export class EspaceVertRoutingResolveService implements Resolve<IEspaceVert> {
  constructor(protected service: EspaceVertService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEspaceVert> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((espaceVert: HttpResponse<EspaceVert>) => {
          if (espaceVert.body) {
            return of(espaceVert.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new EspaceVert());
  }
}
