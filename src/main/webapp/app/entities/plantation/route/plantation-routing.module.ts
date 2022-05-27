import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PlantationComponent } from '../list/plantation.component';
import { PlantationDetailComponent } from '../detail/plantation-detail.component';
import { PlantationUpdateComponent } from '../update/plantation-update.component';
import { PlantationRoutingResolveService } from './plantation-routing-resolve.service';

const plantationRoute: Routes = [
  {
    path: '',
    component: PlantationComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PlantationDetailComponent,
    resolve: {
      plantation: PlantationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PlantationUpdateComponent,
    resolve: {
      plantation: PlantationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PlantationUpdateComponent,
    resolve: {
      plantation: PlantationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(plantationRoute)],
  exports: [RouterModule],
})
export class PlantationRoutingModule {}
