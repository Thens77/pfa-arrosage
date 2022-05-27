import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEspaceVert } from '../espace-vert.model';
import { EspaceVertService } from '../service/espace-vert.service';

@Component({
  templateUrl: './espace-vert-delete-dialog.component.html',
})
export class EspaceVertDeleteDialogComponent {
  espaceVert?: IEspaceVert;

  constructor(protected espaceVertService: EspaceVertService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.espaceVertService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
