import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IInstallation } from '../installation.model';

@Component({
  selector: 'jhi-installation-detail',
  templateUrl: './installation-detail.component.html',
})
export class InstallationDetailComponent implements OnInit {
  installation: IInstallation | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ installation }) => {
      this.installation = installation;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
