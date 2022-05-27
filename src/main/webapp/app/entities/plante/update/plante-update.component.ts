import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPlante, Plante } from '../plante.model';
import { PlanteService } from '../service/plante.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ITypePlante } from 'app/entities/type-plante/type-plante.model';
import { TypePlanteService } from 'app/entities/type-plante/service/type-plante.service';

@Component({
  selector: 'jhi-plante-update',
  templateUrl: './plante-update.component.html',
})
export class PlanteUpdateComponent implements OnInit {
  isSaving = false;

  typePlantesSharedCollection: ITypePlante[] = [];

  editForm = this.fb.group({
    id: [],
    libelle: [],
    photo: [],
    photoContentType: [],
    typeplante: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected planteService: PlanteService,
    protected typePlanteService: TypePlanteService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ plante }) => {
      this.updateForm(plante);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('angularApp.error', { message: err.message })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const plante = this.createFromForm();
    if (plante.id !== undefined) {
      this.subscribeToSaveResponse(this.planteService.update(plante));
    } else {
      this.subscribeToSaveResponse(this.planteService.create(plante));
    }
  }

  trackTypePlanteById(_index: number, item: ITypePlante): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPlante>>): void {
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

  protected updateForm(plante: IPlante): void {
    this.editForm.patchValue({
      id: plante.id,
      libelle: plante.libelle,
      photo: plante.photo,
      photoContentType: plante.photoContentType,
      typeplante: plante.typeplante,
    });

    this.typePlantesSharedCollection = this.typePlanteService.addTypePlanteToCollectionIfMissing(
      this.typePlantesSharedCollection,
      plante.typeplante
    );
  }

  protected loadRelationshipsOptions(): void {
    this.typePlanteService
      .query()
      .pipe(map((res: HttpResponse<ITypePlante[]>) => res.body ?? []))
      .pipe(
        map((typePlantes: ITypePlante[]) =>
          this.typePlanteService.addTypePlanteToCollectionIfMissing(typePlantes, this.editForm.get('typeplante')!.value)
        )
      )
      .subscribe((typePlantes: ITypePlante[]) => (this.typePlantesSharedCollection = typePlantes));
  }

  protected createFromForm(): IPlante {
    return {
      ...new Plante(),
      id: this.editForm.get(['id'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      photoContentType: this.editForm.get(['photoContentType'])!.value,
      photo: this.editForm.get(['photo'])!.value,
      typeplante: this.editForm.get(['typeplante'])!.value,
    };
  }
}
