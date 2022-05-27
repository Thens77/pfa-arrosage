import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EspaceVertComponent } from '../list/espace-vert.component';
import { EspaceVertDetailComponent } from '../detail/espace-vert-detail.component';
import { EspaceVertUpdateComponent } from '../update/espace-vert-update.component';
import { EspaceVertRoutingResolveService } from './espace-vert-routing-resolve.service';

const espaceVertRoute: Routes = [
  {
    path: '',
    component: EspaceVertComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EspaceVertDetailComponent,
    resolve: {
      espaceVert: EspaceVertRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EspaceVertUpdateComponent,
    resolve: {
      espaceVert: EspaceVertRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EspaceVertUpdateComponent,
    resolve: {
      espaceVert: EspaceVertRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(espaceVertRoute)],
  exports: [RouterModule],
})
export class EspaceVertRoutingModule {}
