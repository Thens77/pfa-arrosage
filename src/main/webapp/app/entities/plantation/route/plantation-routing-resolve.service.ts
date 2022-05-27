import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPlantation, Plantation } from '../plantation.model';
import { PlantationService } from '../service/plantation.service';

@Injectable({ providedIn: 'root' })
export class PlantationRoutingResolveService implements Resolve<IPlantation> {
  constructor(protected service: PlantationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPlantation> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((plantation: HttpResponse<Plantation>) => {
          if (plantation.body) {
            return of(plantation.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Plantation());
  }
}
