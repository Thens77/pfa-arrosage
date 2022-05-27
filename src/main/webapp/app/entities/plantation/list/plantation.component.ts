import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPlantation } from '../plantation.model';
import { PlantationService } from '../service/plantation.service';
import { PlantationDeleteDialogComponent } from '../delete/plantation-delete-dialog.component';

@Component({
  selector: 'jhi-plantation',
  templateUrl: './plantation.component.html',
})
export class PlantationComponent implements OnInit {
  plantations?: IPlantation[];
  isLoading = false;

  constructor(protected plantationService: PlantationService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.plantationService.query().subscribe({
      next: (res: HttpResponse<IPlantation[]>) => {
        this.isLoading = false;
        this.plantations = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IPlantation): number {
    return item.id!;
  }

  delete(plantation: IPlantation): void {
    const modalRef = this.modalService.open(PlantationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.plantation = plantation;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
