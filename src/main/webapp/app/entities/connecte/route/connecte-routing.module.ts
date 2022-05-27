import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ConnecteComponent } from '../list/connecte.component';
import { ConnecteDetailComponent } from '../detail/connecte-detail.component';
import { ConnecteUpdateComponent } from '../update/connecte-update.component';
import { ConnecteRoutingResolveService } from './connecte-routing-resolve.service';

const connecteRoute: Routes = [
  {
    path: '',
    component: ConnecteComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ConnecteDetailComponent,
    resolve: {
      connecte: ConnecteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ConnecteUpdateComponent,
    resolve: {
      connecte: ConnecteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ConnecteUpdateComponent,
    resolve: {
      connecte: ConnecteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(connecteRoute)],
  exports: [RouterModule],
})
export class ConnecteRoutingModule {}
