import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TypePlanteComponent } from './list/type-plante.component';
import { TypePlanteDetailComponent } from './detail/type-plante-detail.component';
import { TypePlanteUpdateComponent } from './update/type-plante-update.component';
import { TypePlanteDeleteDialogComponent } from './delete/type-plante-delete-dialog.component';
import { TypePlanteRoutingModule } from './route/type-plante-routing.module';

@NgModule({
  imports: [SharedModule, TypePlanteRoutingModule],
  declarations: [TypePlanteComponent, TypePlanteDetailComponent, TypePlanteUpdateComponent, TypePlanteDeleteDialogComponent],
  entryComponents: [TypePlanteDeleteDialogComponent],
})
export class TypePlanteModule {}
