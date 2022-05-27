import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITypeSol } from '../type-sol.model';
import { TypeSolService } from '../service/type-sol.service';

@Component({
  templateUrl: './type-sol-delete-dialog.component.html',
})
export class TypeSolDeleteDialogComponent {
  typeSol?: ITypeSol;

  constructor(protected typeSolService: TypeSolService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.typeSolService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
