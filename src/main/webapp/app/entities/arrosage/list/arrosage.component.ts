import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IArrosage } from '../arrosage.model';
import { ArrosageService } from '../service/arrosage.service';
import { ArrosageDeleteDialogComponent } from '../delete/arrosage-delete-dialog.component';

@Component({
  selector: 'jhi-arrosage',
  templateUrl: './arrosage.component.html',
})
export class ArrosageComponent implements OnInit {
  arrosages?: IArrosage[];
  isLoading = false;

  constructor(protected arrosageService: ArrosageService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.arrosageService.query().subscribe({
      next: (res: HttpResponse<IArrosage[]>) => {
        this.isLoading = false;
        this.arrosages = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IArrosage): number {
    return item.id!;
  }

  delete(arrosage: IArrosage): void {
    const modalRef = this.modalService.open(ArrosageDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.arrosage = arrosage;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
