import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

import { BoitierDetailComponent } from './detail/boitier-detail.component';
import { BoitierUpdateComponent } from './update/boitier-update.component';
import { BoitierDeleteDialogComponent } from './delete/boitier-delete-dialog.component';
import { BoitierRoutingModule } from './route/boitier-routing.module';
import { CapteurComponent } from '../capteur/list/capteur.component';

@NgModule({
  imports: [SharedModule, BoitierRoutingModule],
  declarations: [ CapteurComponent ,BoitierDetailComponent, BoitierUpdateComponent, BoitierDeleteDialogComponent],
  entryComponents: [BoitierDeleteDialogComponent],
})
export class BoitierModule {}
