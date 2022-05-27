import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

import { TypeSolDetailComponent } from './detail/type-sol-detail.component';
import { TypeSolUpdateComponent } from './update/type-sol-update.component';
import { TypeSolDeleteDialogComponent } from './delete/type-sol-delete-dialog.component';
import { TypeSolRoutingModule } from './route/type-sol-routing.module';

@NgModule({
  imports: [SharedModule, TypeSolRoutingModule],
  declarations: [ TypeSolDetailComponent, TypeSolUpdateComponent, TypeSolDeleteDialogComponent],
  entryComponents: [TypeSolDeleteDialogComponent],
})
export class TypeSolModule {}
