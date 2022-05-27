import { Component, Input, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITypeSol } from '../type-sol.model';
import { TypeSolService } from '../service/type-sol.service';
import { TypeSolDeleteDialogComponent } from '../delete/type-sol-delete-dialog.component';

@Component({
  selector: 'jhi-type-sol',
  templateUrl: './type-sol.component.html',
})
export class TypeSolComponent implements OnInit {
  typeSols?: ITypeSol[];
  isLoading = false;
  @Input() idz? : number | undefined ;

  constructor(protected typeSolService: TypeSolService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.typeSolService.query(this.idz).subscribe({
      next: (res: HttpResponse<ITypeSol[]>) => {
        this.isLoading = false;
        this.typeSols = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ITypeSol): number {
    return item.id!;
  }

  delete(typeSol: ITypeSol): void {
    const modalRef = this.modalService.open(TypeSolDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.typeSol = typeSol;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
