import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IBoitier, Boitier } from '../boitier.model';
import { BoitierService } from '../service/boitier.service';
import { IInstallation } from 'app/entities/installation/installation.model';
import { InstallationService } from 'app/entities/installation/service/installation.service';

@Component({
  selector: 'jhi-boitier-update',
  templateUrl: './boitier-update.component.html',
})
export class BoitierUpdateComponent implements OnInit {
  isSaving = false;

  installationsSharedCollection: IInstallation[] = [];

  editForm = this.fb.group({
    id: [],
    refrence: [],
    nbrBranche: [],
    installation: [],
  });

  constructor(
    protected boitierService: BoitierService,
    protected installationService: InstallationService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ boitier }) => {
      this.updateForm(boitier);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const boitier = this.createFromForm();
    if (boitier.id !== undefined) {
      this.subscribeToSaveResponse(this.boitierService.update(boitier));
    } else {
      this.subscribeToSaveResponse(this.boitierService.create(boitier));
    }
  }

  trackInstallationById(_index: number, item: IInstallation): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBoitier>>): void {
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

  protected updateForm(boitier: IBoitier): void {
    this.editForm.patchValue({
      id: boitier.id,
      refrence: boitier.refrence,
      nbrBranche: boitier.nbrBranche,
      installation: boitier.installation,
    });

    this.installationsSharedCollection = this.installationService.addInstallationToCollectionIfMissing(
      this.installationsSharedCollection,
      boitier.installation
    );
  }

  protected loadRelationshipsOptions(): void {
    this.installationService
      .query()
      .pipe(map((res: HttpResponse<IInstallation[]>) => res.body ?? []))
      .pipe(
        map((installations: IInstallation[]) =>
          this.installationService.addInstallationToCollectionIfMissing(installations, this.editForm.get('installation')!.value)
        )
      )
      .subscribe((installations: IInstallation[]) => (this.installationsSharedCollection = installations));
  }

  protected createFromForm(): IBoitier {
    return {
      ...new Boitier(),
      id: this.editForm.get(['id'])!.value,
      refrence: this.editForm.get(['refrence'])!.value,
      nbrBranche: this.editForm.get(['nbrBranche'])!.value,
      installation: this.editForm.get(['installation'])!.value,
    };
  }
}
