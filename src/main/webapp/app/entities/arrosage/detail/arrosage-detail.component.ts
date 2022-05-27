import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IArrosage } from '../arrosage.model';

@Component({
  selector: 'jhi-arrosage-detail',
  templateUrl: './arrosage-detail.component.html',
})
export class ArrosageDetailComponent implements OnInit {
  arrosage: IArrosage | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ arrosage }) => {
      this.arrosage = arrosage;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
