import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CapteurComponent } from '../list/capteur.component';
import { CapteurDetailComponent } from '../detail/capteur-detail.component';
import { CapteurUpdateComponent } from '../update/capteur-update.component';
import { CapteurRoutingResolveService } from './capteur-routing-resolve.service';

const capteurRoute: Routes = [
  {
    path: '',
    component: CapteurComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CapteurDetailComponent,
    resolve: {
      capteur: CapteurRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CapteurUpdateComponent,
    resolve: {
      capteur: CapteurRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CapteurUpdateComponent,
    resolve: {
      capteur: CapteurRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(capteurRoute)],
  exports: [RouterModule],
})
export class CapteurRoutingModule {}
