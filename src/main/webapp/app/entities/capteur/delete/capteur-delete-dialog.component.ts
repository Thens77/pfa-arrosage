import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICapteur } from '../capteur.model';
import { CapteurService } from '../service/capteur.service';

@Component({
  templateUrl: './capteur-delete-dialog.component.html',
})
export class CapteurDeleteDialogComponent {
  capteur?: ICapteur;

  constructor(protected capteurService: CapteurService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.capteurService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
