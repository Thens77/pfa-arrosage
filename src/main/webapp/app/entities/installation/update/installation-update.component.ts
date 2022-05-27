import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IInstallation, Installation } from '../installation.model';
import { InstallationService } from '../service/installation.service';

@Component({
  selector: 'jhi-installation-update',
  templateUrl: './installation-update.component.html',
})
export class InstallationUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    dateDebut: [],
    dateFin: [],
  });

  constructor(protected installationService: InstallationService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ installation }) => {
      this.updateForm(installation);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const installation = this.createFromForm();
    if (installation.id !== undefined) {
      this.subscribeToSaveResponse(this.installationService.update(installation));
    } else {
      this.subscribeToSaveResponse(this.installationService.create(installation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInstallation>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(installation: IInstallation): void {
    this.editForm.patchValue({
      id: installation.id,
      dateDebut: installation.dateDebut,
      dateFin: installation.dateFin,
    });
  }

  protected createFromForm(): IInstallation {
    return {
      ...new Installation(),
      id: this.editForm.get(['id'])!.value,
      dateDebut: this.editForm.get(['dateDebut'])!.value,
      dateFin: this.editForm.get(['dateFin'])!.value,
    };
  }
}
