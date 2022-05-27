import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBoitier, Boitier } from '../boitier.model';
import { BoitierService } from '../service/boitier.service';

@Injectable({ providedIn: 'root' })
export class BoitierRoutingResolveService implements Resolve<IBoitier> {
  constructor(protected service: BoitierService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBoitier> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((boitier: HttpResponse<Boitier>) => {
          if (boitier.body) {
            return of(boitier.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Boitier());
  }
}
