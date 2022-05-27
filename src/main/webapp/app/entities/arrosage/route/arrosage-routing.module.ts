import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ArrosageComponent } from '../list/arrosage.component';
import { ArrosageDetailComponent } from '../detail/arrosage-detail.component';
import { ArrosageUpdateComponent } from '../update/arrosage-update.component';
import { ArrosageRoutingResolveService } from './arrosage-routing-resolve.service';

const arrosageRoute: Routes = [
  {
    path: '',
    component: ArrosageComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ArrosageDetailComponent,
    resolve: {
      arrosage: ArrosageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ArrosageUpdateComponent,
    resolve: {
      arrosage: ArrosageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ArrosageUpdateComponent,
    resolve: {
      arrosage: ArrosageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(arrosageRoute)],
  exports: [RouterModule],
})
export class ArrosageRoutingModule {}
