import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BoitierComponent } from '../list/boitier.component';
import { BoitierDetailComponent } from '../detail/boitier-detail.component';
import { BoitierUpdateComponent } from '../update/boitier-update.component';
import { BoitierRoutingResolveService } from './boitier-routing-resolve.service';

const boitierRoute: Routes = [
  {
    path: '',
    component: BoitierComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BoitierDetailComponent,
    resolve: {
      boitier: BoitierRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BoitierUpdateComponent,
    resolve: {
      boitier: BoitierRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BoitierUpdateComponent,
    resolve: {
      boitier: BoitierRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(boitierRoute)],
  exports: [RouterModule],
})
export class BoitierRoutingModule {}
