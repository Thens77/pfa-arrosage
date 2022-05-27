import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITypePlante } from '../type-plante.model';
import { TypePlanteService } from '../service/type-plante.service';

@Component({
  templateUrl: './type-plante-delete-dialog.component.html',
})
export class TypePlanteDeleteDialogComponent {
  typePlante?: ITypePlante;

  constructor(protected typePlanteService: TypePlanteService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.typePlanteService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
