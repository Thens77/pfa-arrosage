import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EspaceVertComponent } from './list/espace-vert.component';
import { EspaceVertDetailComponent } from './detail/espace-vert-detail.component';
import { EspaceVertUpdateComponent } from './update/espace-vert-update.component';
import { EspaceVertDeleteDialogComponent } from './delete/espace-vert-delete-dialog.component';
import { EspaceVertRoutingModule } from './route/espace-vert-routing.module';
import { ZoneComponent } from '../zone/list/zone.component';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ZoneService } from '../zone/service/zone.service';





@NgModule({
  imports: [MatFormFieldModule,MatDialogModule,MatCardModule,SharedModule, EspaceVertRoutingModule],
  declarations: [ZoneComponent , EspaceVertComponent, EspaceVertDetailComponent, EspaceVertUpdateComponent, EspaceVertDeleteDialogComponent],
  entryComponents: [EspaceVertDeleteDialogComponent],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    },
    ZoneService
 ],
})
export class EspaceVertModule {}
