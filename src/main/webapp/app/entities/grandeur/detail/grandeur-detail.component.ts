import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGrandeur } from '../grandeur.model';

@Component({
  selector: 'jhi-grandeur-detail',
  templateUrl: './grandeur-detail.component.html',
})
export class GrandeurDetailComponent implements OnInit {
  grandeur: IGrandeur | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ grandeur }) => {
      this.grandeur = grandeur;
    });
    setInterval(() => {
      window.location.reload();
    }, 5000);
  }

  previousState(): void {
    window.history.back();
  }
}
