import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPlantation } from '../plantation.model';

@Component({
  selector: 'jhi-plantation-detail',
  templateUrl: './plantation-detail.component.html',
})
export class PlantationDetailComponent implements OnInit {
  plantation: IPlantation | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ plantation }) => {
      this.plantation = plantation;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
