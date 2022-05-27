import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IGrandeur } from '../grandeur.model';
import { GrandeurService } from '../service/grandeur.service';

@Component({
  templateUrl: './grandeur-delete-dialog.component.html',
})
export class GrandeurDeleteDialogComponent {
  grandeur?: IGrandeur;

  constructor(protected grandeurService: GrandeurService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.grandeurService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
