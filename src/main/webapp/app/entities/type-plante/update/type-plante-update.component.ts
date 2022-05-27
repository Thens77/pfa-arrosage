import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ITypePlante, TypePlante } from '../type-plante.model';
import { TypePlanteService } from '../service/type-plante.service';

@Component({
  selector: 'jhi-type-plante-update',
  templateUrl: './type-plante-update.component.html',
})
export class TypePlanteUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    humiditeMin: [],
    humiditeMax: [],
    temperatureMin: [],
    temperatureMax: [],
    limunosite: [],
    libelle: [],
  });

  constructor(protected typePlanteService: TypePlanteService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typePlante }) => {
      this.updateForm(typePlante);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const typePlante = this.createFromForm();
    if (typePlante.id !== undefined) {
      this.subscribeToSaveResponse(this.typePlanteService.update(typePlante));
    } else {
      this.subscribeToSaveResponse(this.typePlanteService.create(typePlante));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITypePlante>>): void {
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

  protected updateForm(typePlante: ITypePlante): void {
    this.editForm.patchValue({
      id: typePlante.id,
      humiditeMin: typePlante.humiditeMin,
      humiditeMax: typePlante.humiditeMax,
      temperatureMin: typePlante.temperatureMin,
      temperatureMax: typePlante.temperatureMax,
      limunosite: typePlante.limunosite,
      libelle: typePlante.libelle,
    });
  }

  protected createFromForm(): ITypePlante {
    return {
      ...new TypePlante(),
      id: this.editForm.get(['id'])!.value,
      humiditeMin: this.editForm.get(['humiditeMin'])!.value,
      humiditeMax: this.editForm.get(['humiditeMax'])!.value,
      temperatureMin: this.editForm.get(['temperatureMin'])!.value,
      temperatureMax: this.editForm.get(['temperatureMax'])!.value,
      limunosite: this.editForm.get(['limunosite'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
    };
  }
}
