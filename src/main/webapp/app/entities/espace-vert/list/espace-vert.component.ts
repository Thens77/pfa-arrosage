import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEspaceVert } from '../espace-vert.model';
import { EspaceVertService } from '../service/espace-vert.service';
import { EspaceVertDeleteDialogComponent } from '../delete/espace-vert-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';


@Component({
  selector: 'jhi-espace-vert',
  templateUrl: './espace-vert.component.html',
})
export class EspaceVertComponent implements OnInit {
  espaceVerts?: IEspaceVert[];
  isLoading = false;

  constructor(protected espaceVertService: EspaceVertService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.espaceVertService.query().subscribe({
      next: (res: HttpResponse<IEspaceVert[]>) => {
        this.isLoading = false;
        this.espaceVerts = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IEspaceVert): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(espaceVert: IEspaceVert): void {
    const modalRef = this.modalService.open(EspaceVertDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.espaceVert = espaceVert;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
