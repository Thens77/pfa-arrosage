import { Component, Input, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICapteur } from '../capteur.model';
import { CapteurService } from '../service/capteur.service';
import { CapteurDeleteDialogComponent } from '../delete/capteur-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-capteur',
  templateUrl: './capteur.component.html',
})
export class CapteurComponent implements OnInit {
  capteurs?: ICapteur[];
  isLoading = false;
  @Input() idb? : number | undefined ;

  constructor(protected capteurService: CapteurService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.capteurService.query(this.idb).subscribe({
      next: (res: HttpResponse<ICapteur[]>) => {
        this.isLoading = false;
        this.capteurs = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ICapteur): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(capteur: ICapteur): void {
    const modalRef = this.modalService.open(CapteurDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.capteur = capteur;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
