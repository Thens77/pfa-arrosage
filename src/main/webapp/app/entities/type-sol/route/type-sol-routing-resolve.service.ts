import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITypeSol, TypeSol } from '../type-sol.model';
import { TypeSolService } from '../service/type-sol.service';

@Injectable({ providedIn: 'root' })
export class TypeSolRoutingResolveService implements Resolve<ITypeSol> {
  constructor(protected service: TypeSolService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITypeSol> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((typeSol: HttpResponse<TypeSol>) => {
          if (typeSol.body) {
            return of(typeSol.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new TypeSol());
  }
}
