import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ITypeSol, TypeSol } from '../type-sol.model';
import { TypeSolService } from '../service/type-sol.service';

@Component({
  selector: 'jhi-type-sol-update',
  templateUrl: './type-sol-update.component.html',
})
export class TypeSolUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    libelle: [],
  });

  constructor(protected typeSolService: TypeSolService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typeSol }) => {
      this.updateForm(typeSol);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const typeSol = this.createFromForm();
    if (typeSol.id !== undefined) {
      this.subscribeToSaveResponse(this.typeSolService.update(typeSol));
    } else {
      this.subscribeToSaveResponse(this.typeSolService.create(typeSol));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITypeSol>>): void {
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

  protected updateForm(typeSol: ITypeSol): void {
    this.editForm.patchValue({
      id: typeSol.id,
      libelle: typeSol.libelle,
    });
  }

  protected createFromForm(): ITypeSol {
    return {
      ...new TypeSol(),
      id: this.editForm.get(['id'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
    };
  }
}
