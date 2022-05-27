import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBoitier } from '../boitier.model';
import { BoitierService } from '../service/boitier.service';

@Component({
  templateUrl: './boitier-delete-dialog.component.html',
})
export class BoitierDeleteDialogComponent {
  boitier?: IBoitier;

  constructor(protected boitierService: BoitierService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.boitierService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
