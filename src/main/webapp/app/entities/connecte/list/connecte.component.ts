import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IConnecte } from '../connecte.model';
import { ConnecteService } from '../service/connecte.service';
import { ConnecteDeleteDialogComponent } from '../delete/connecte-delete-dialog.component';

@Component({
  selector: 'jhi-connecte',
  templateUrl: './connecte.component.html',
})
export class ConnecteComponent implements OnInit {
  connectes?: IConnecte[];
  isLoading = false;

  constructor(protected connecteService: ConnecteService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.connecteService.query().subscribe({
      next: (res: HttpResponse<IConnecte[]>) => {
        this.isLoading = false;
        this.connectes = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IConnecte): number {
    return item.id!;
  }

  delete(connecte: IConnecte): void {
    const modalRef = this.modalService.open(ConnecteDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.connecte = connecte;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
