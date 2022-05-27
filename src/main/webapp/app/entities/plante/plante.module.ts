import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

import { PlanteDetailComponent } from './detail/plante-detail.component';
import { PlanteUpdateComponent } from './update/plante-update.component';
import { PlanteDeleteDialogComponent } from './delete/plante-delete-dialog.component';
import { PlanteRoutingModule } from './route/plante-routing.module';

@NgModule({
  imports: [SharedModule, PlanteRoutingModule],
  declarations: [ PlanteDetailComponent, PlanteUpdateComponent, PlanteDeleteDialogComponent],
  entryComponents: [PlanteDeleteDialogComponent],
})
export class PlanteModule {}
