import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IArrosage, Arrosage } from '../arrosage.model';
import { ArrosageService } from '../service/arrosage.service';

@Injectable({ providedIn: 'root' })
export class ArrosageRoutingResolveService implements Resolve<IArrosage> {
  constructor(protected service: ArrosageService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IArrosage> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((arrosage: HttpResponse<Arrosage>) => {
          if (arrosage.body) {
            return of(arrosage.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Arrosage());
  }
}
