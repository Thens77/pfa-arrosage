import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITypePlante } from '../type-plante.model';

@Component({
  selector: 'jhi-type-plante-detail',
  templateUrl: './type-plante-detail.component.html',
})
export class TypePlanteDetailComponent implements OnInit {
  typePlante: ITypePlante | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typePlante }) => {
      this.typePlante = typePlante;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
