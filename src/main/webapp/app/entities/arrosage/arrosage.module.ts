import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ArrosageComponent } from './list/arrosage.component';
import { ArrosageDetailComponent } from './detail/arrosage-detail.component';
import { ArrosageUpdateComponent } from './update/arrosage-update.component';
import { ArrosageDeleteDialogComponent } from './delete/arrosage-delete-dialog.component';
import { ArrosageRoutingModule } from './route/arrosage-routing.module';

@NgModule({
  imports: [SharedModule, ArrosageRoutingModule],
  declarations: [ArrosageComponent, ArrosageDetailComponent, ArrosageUpdateComponent, ArrosageDeleteDialogComponent],
  entryComponents: [ArrosageDeleteDialogComponent],
})
export class ArrosageModule {}
