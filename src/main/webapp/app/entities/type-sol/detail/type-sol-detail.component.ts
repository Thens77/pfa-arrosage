import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITypeSol } from '../type-sol.model';

@Component({
  selector: 'jhi-type-sol-detail',
  templateUrl: './type-sol-detail.component.html',
})
export class TypeSolDetailComponent implements OnInit {
  typeSol: ITypeSol | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typeSol }) => {
      this.typeSol = typeSol;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
