import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGrandeur, Grandeur } from '../grandeur.model';
import { GrandeurService } from '../service/grandeur.service';

@Injectable({ providedIn: 'root' })
export class GrandeurRoutingResolveService implements Resolve<IGrandeur> {
  constructor(protected service: GrandeurService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGrandeur> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((grandeur: HttpResponse<Grandeur>) => {
          if (grandeur.body) {
            return of(grandeur.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Grandeur());
  }
}
