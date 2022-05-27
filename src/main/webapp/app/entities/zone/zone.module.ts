import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

import { ZoneDetailComponent } from './detail/zone-detail.component';
import { ZoneUpdateComponent } from './update/zone-update.component';
import { ZoneDeleteDialogComponent } from './delete/zone-delete-dialog.component';
import { ZoneRoutingModule } from './route/zone-routing.module';
import { BoitierComponent } from '../boitier/list/boitier.component';
import { TypeSolComponent } from '../type-sol/list/type-sol.component';
import { PlanteComponent } from '../plante/list/plante.component';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { PlantationService } from '../plantation/service/plantation.service';
import { PlantationUpdateComponent } from '../plantation/update/plantation-update.component';
import { GrandeurComponent } from '../grandeur/list/grandeur.component';

@NgModule({
  imports: [MatDialogModule , SharedModule, ZoneRoutingModule],
  declarations: [GrandeurComponent , PlantationUpdateComponent, PlanteComponent, TypeSolComponent ,BoitierComponent,ZoneDetailComponent, ZoneUpdateComponent, ZoneDeleteDialogComponent],
  entryComponents: [ZoneDeleteDialogComponent],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    },
    PlantationService
 ],
    

})
export class ZoneModule {}
