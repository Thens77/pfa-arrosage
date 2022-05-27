import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IConnecte } from '../connecte.model';
import { ConnecteService } from '../service/connecte.service';

@Component({
  templateUrl: './connecte-delete-dialog.component.html',
})
export class ConnecteDeleteDialogComponent {
  connecte?: IConnecte;

  constructor(protected connecteService: ConnecteService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.connecteService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
