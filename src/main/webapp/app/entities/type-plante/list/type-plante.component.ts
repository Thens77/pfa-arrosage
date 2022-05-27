import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITypePlante } from '../type-plante.model';
import { TypePlanteService } from '../service/type-plante.service';
import { TypePlanteDeleteDialogComponent } from '../delete/type-plante-delete-dialog.component';

@Component({
  selector: 'jhi-type-plante',
  templateUrl: './type-plante.component.html',
})
export class TypePlanteComponent implements OnInit {
  typePlantes?: ITypePlante[];
  isLoading = false;

  constructor(protected typePlanteService: TypePlanteService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.typePlanteService.query().subscribe({
      next: (res: HttpResponse<ITypePlante[]>) => {
        this.isLoading = false;
        this.typePlantes = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ITypePlante): number {
    return item.id!;
  }

  delete(typePlante: ITypePlante): void {
    const modalRef = this.modalService.open(TypePlanteDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.typePlante = typePlante;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
