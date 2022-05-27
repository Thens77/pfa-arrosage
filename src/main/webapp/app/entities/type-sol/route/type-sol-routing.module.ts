import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TypeSolComponent } from '../list/type-sol.component';
import { TypeSolDetailComponent } from '../detail/type-sol-detail.component';
import { TypeSolUpdateComponent } from '../update/type-sol-update.component';
import { TypeSolRoutingResolveService } from './type-sol-routing-resolve.service';

const typeSolRoute: Routes = [
  {
    path: '',
    component: TypeSolComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TypeSolDetailComponent,
    resolve: {
      typeSol: TypeSolRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TypeSolUpdateComponent,
    resolve: {
      typeSol: TypeSolRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TypeSolUpdateComponent,
    resolve: {
      typeSol: TypeSolRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(typeSolRoute)],
  exports: [RouterModule],
})
export class TypeSolRoutingModule {}
