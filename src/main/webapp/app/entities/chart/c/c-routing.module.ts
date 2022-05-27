import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ChartZComponent } from '../chart-z/chart-z.component';


const routes: Routes = [{
  path: '',
  component: ChartZComponent,
  canActivate: [UserRouteAccessService],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CRoutingModule { }
