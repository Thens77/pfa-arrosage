import { Component, Input, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router'
import { IGrandeur } from '../grandeur.model';
import { GrandeurService } from '../service/grandeur.service';
import { GrandeurDeleteDialogComponent } from '../delete/grandeur-delete-dialog.component';

@Component({
  selector: 'jhi-grandeur',
  templateUrl: './grandeur.component.html',
})
export class GrandeurComponent implements OnInit {
  grandeurs?: IGrandeur[];
  isLoading = false;
  @Input() idz? : number | undefined ;
  constructor(protected router : Router , protected grandeurService: GrandeurService, protected modalService: NgbModal) {}
  reloadComponent() : void {
    const currentUrl = this.router.url;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([currentUrl]);
    }
  loadAll(): void {
    this.isLoading = true;

    this.grandeurService.query(this.idz).subscribe({
      next: (res: HttpResponse<IGrandeur[]>) => {
        this.isLoading = false;
        this.grandeurs = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
   
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IGrandeur): number {
    return item.id!;
  }

  delete(grandeur: IGrandeur): void {
    const modalRef = this.modalService.open(GrandeurDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.grandeur = grandeur;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
