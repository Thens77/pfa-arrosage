import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITypePlante, TypePlante } from '../type-plante.model';
import { TypePlanteService } from '../service/type-plante.service';

@Injectable({ providedIn: 'root' })
export class TypePlanteRoutingResolveService implements Resolve<ITypePlante> {
  constructor(protected service: TypePlanteService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITypePlante> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((typePlante: HttpResponse<TypePlante>) => {
          if (typePlante.body) {
            return of(typePlante.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new TypePlante());
  }
}
