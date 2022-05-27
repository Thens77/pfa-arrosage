import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IConnecte, Connecte } from '../connecte.model';
import { ConnecteService } from '../service/connecte.service';

@Injectable({ providedIn: 'root' })
export class ConnecteRoutingResolveService implements Resolve<IConnecte> {
  constructor(protected service: ConnecteService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IConnecte> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((connecte: HttpResponse<Connecte>) => {
          if (connecte.body) {
            return of(connecte.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Connecte());
  }
}
