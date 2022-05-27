import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IConnecte } from '../connecte.model';

@Component({
  selector: 'jhi-connecte-detail',
  templateUrl: './connecte-detail.component.html',
})
export class ConnecteDetailComponent implements OnInit {
  connecte: IConnecte | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ connecte }) => {
      this.connecte = connecte;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
