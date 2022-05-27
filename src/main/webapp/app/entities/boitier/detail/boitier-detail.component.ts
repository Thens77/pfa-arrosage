import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBoitier } from '../boitier.model';

@Component({
  selector: 'jhi-boitier-detail',
  templateUrl: './boitier-detail.component.html',
})
export class BoitierDetailComponent implements OnInit {
  boitier: IBoitier | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ boitier }) => {
      this.boitier = boitier;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
