import { Component, Input, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBoitier } from '../boitier.model';
import { BoitierService } from '../service/boitier.service';
import { BoitierDeleteDialogComponent } from '../delete/boitier-delete-dialog.component';

@Component({
  selector: 'jhi-boitier',
  templateUrl: './boitier.component.html',
})
export class BoitierComponent implements OnInit {
  boitiers?: IBoitier[];
  isLoading = false;
  @Input() idz? : number | undefined ;
  constructor(protected boitierService: BoitierService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.boitierService.query(this.idz).subscribe({
      next: (res: HttpResponse<IBoitier[]>) => {
        this.isLoading = false;
        this.boitiers = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IBoitier): number {
    return item.id!;
  }

  delete(boitier: IBoitier): void {
    const modalRef = this.modalService.open(BoitierDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.boitier = boitier;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
