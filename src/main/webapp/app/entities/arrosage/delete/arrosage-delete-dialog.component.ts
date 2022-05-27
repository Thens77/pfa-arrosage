import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IArrosage } from '../arrosage.model';
import { ArrosageService } from '../service/arrosage.service';

@Component({
  templateUrl: './arrosage-delete-dialog.component.html',
})
export class ArrosageDeleteDialogComponent {
  arrosage?: IArrosage;

  constructor(protected arrosageService: ArrosageService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.arrosageService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
