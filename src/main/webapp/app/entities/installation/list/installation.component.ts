import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IInstallation } from '../installation.model';
import { InstallationService } from '../service/installation.service';
import { InstallationDeleteDialogComponent } from '../delete/installation-delete-dialog.component';

@Component({
  selector: 'jhi-installation',
  templateUrl: './installation.component.html',
})
export class InstallationComponent implements OnInit {
  installations?: IInstallation[];
  isLoading = false;

  constructor(protected installationService: InstallationService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.installationService.query().subscribe({
      next: (res: HttpResponse<IInstallation[]>) => {
        this.isLoading = false;
        this.installations = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IInstallation): number {
    return item.id!;
  }

  delete(installation: IInstallation): void {
    const modalRef = this.modalService.open(InstallationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.installation = installation;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
