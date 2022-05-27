import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TypePlanteComponent } from '../list/type-plante.component';
import { TypePlanteDetailComponent } from '../detail/type-plante-detail.component';
import { TypePlanteUpdateComponent } from '../update/type-plante-update.component';
import { TypePlanteRoutingResolveService } from './type-plante-routing-resolve.service';

const typePlanteRoute: Routes = [
  {
    path: '',
    component: TypePlanteComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TypePlanteDetailComponent,
    resolve: {
      typePlante: TypePlanteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TypePlanteUpdateComponent,
    resolve: {
      typePlante: TypePlanteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TypePlanteUpdateComponent,
    resolve: {
      typePlante: TypePlanteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(typePlanteRoute)],
  exports: [RouterModule],
})
export class TypePlanteRoutingModule {}
