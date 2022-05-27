import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPlante } from '../plante.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-plante-detail',
  templateUrl: './plante-detail.component.html',
})
export class PlanteDetailComponent implements OnInit {
  plante: IPlante | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ plante }) => {
      this.plante = plante;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
