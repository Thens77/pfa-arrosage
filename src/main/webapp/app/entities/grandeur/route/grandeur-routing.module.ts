import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { GrandeurComponent } from '../list/grandeur.component';
import { GrandeurDetailComponent } from '../detail/grandeur-detail.component';
import { GrandeurUpdateComponent } from '../update/grandeur-update.component';
import { GrandeurRoutingResolveService } from './grandeur-routing-resolve.service';

const grandeurRoute: Routes = [
  {
    path: '',
    component: GrandeurComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GrandeurDetailComponent,
    resolve: {
      grandeur: GrandeurRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GrandeurUpdateComponent,
    resolve: {
      grandeur: GrandeurRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GrandeurUpdateComponent,
    resolve: {
      grandeur: GrandeurRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(grandeurRoute)],
  exports: [RouterModule],
})
export class GrandeurRoutingModule {}
