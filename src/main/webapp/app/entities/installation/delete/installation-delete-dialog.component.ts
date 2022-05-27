import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IInstallation } from '../installation.model';
import { InstallationService } from '../service/installation.service';

@Component({
  templateUrl: './installation-delete-dialog.component.html',
})
export class InstallationDeleteDialogComponent {
  installation?: IInstallation;

  constructor(protected installationService: InstallationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.installationService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
