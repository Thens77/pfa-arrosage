import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ConnecteComponent } from './list/connecte.component';
import { ConnecteDetailComponent } from './detail/connecte-detail.component';
import { ConnecteUpdateComponent } from './update/connecte-update.component';
import { ConnecteDeleteDialogComponent } from './delete/connecte-delete-dialog.component';
import { ConnecteRoutingModule } from './route/connecte-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown'

@NgModule({
  imports: [NgMultiSelectDropDownModule.forRoot() , SharedModule, ConnecteRoutingModule],
  declarations: [ConnecteComponent, ConnecteDetailComponent, ConnecteUpdateComponent, ConnecteDeleteDialogComponent],
  entryComponents: [ConnecteDeleteDialogComponent],
})
export class ConnecteModule {}
