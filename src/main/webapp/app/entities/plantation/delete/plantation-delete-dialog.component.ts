import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPlantation } from '../plantation.model';
import { PlantationService } from '../service/plantation.service';

@Component({
  templateUrl: './plantation-delete-dialog.component.html',
})
export class PlantationDeleteDialogComponent {
  plantation?: IPlantation;

  constructor(protected plantationService: PlantationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.plantationService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
