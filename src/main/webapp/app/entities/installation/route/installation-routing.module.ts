import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { InstallationComponent } from '../list/installation.component';
import { InstallationDetailComponent } from '../detail/installation-detail.component';
import { InstallationUpdateComponent } from '../update/installation-update.component';
import { InstallationRoutingResolveService } from './installation-routing-resolve.service';

const installationRoute: Routes = [
  {
    path: '',
    component: InstallationComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InstallationDetailComponent,
    resolve: {
      installation: InstallationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InstallationUpdateComponent,
    resolve: {
      installation: InstallationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InstallationUpdateComponent,
    resolve: {
      installation: InstallationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(installationRoute)],
  exports: [RouterModule],
})
export class InstallationRoutingModule {}
