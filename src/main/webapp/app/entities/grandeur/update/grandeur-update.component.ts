import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IGrandeur, Grandeur } from '../grandeur.model';
import { GrandeurService } from '../service/grandeur.service';
import { IZone } from 'app/entities/zone/zone.model';
import { ZoneService } from 'app/entities/zone/service/zone.service';

@Component({
  selector: 'jhi-grandeur-update',
  templateUrl: './grandeur-update.component.html',
})
export class GrandeurUpdateComponent implements OnInit {
  isSaving = false;

  zonesSharedCollection: IZone[] = [];

  editForm = this.fb.group({
    id: [],
    type: [],
    valeur: [],
    date: [],
    zone: [],
  });

  constructor(
    protected grandeurService: GrandeurService,
    protected zoneService: ZoneService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ grandeur }) => {
      this.updateForm(grandeur);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const grandeur = this.createFromForm();
    if (grandeur.id !== undefined) {
      this.subscribeToSaveResponse(this.grandeurService.update(grandeur));
    } else {
      this.subscribeToSaveResponse(this.grandeurService.create(grandeur));
    }
  }

  trackZoneById(_index: number, item: IZone): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGrandeur>>): void {
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

  protected updateForm(grandeur: IGrandeur): void {
    this.editForm.patchValue({
      id: grandeur.id,
      type: grandeur.type,
      valeur: grandeur.valeur,
      date: grandeur.date,
      zone: grandeur.zone,
    });

    this.zonesSharedCollection = this.zoneService.addZoneToCollectionIfMissing(this.zonesSharedCollection, grandeur.zone);
  }

  protected loadRelationshipsOptions(): void {
    this.zoneService
      .query()
      .pipe(map((res: HttpResponse<IZone[]>) => res.body ?? []))
      .pipe(map((zones: IZone[]) => this.zoneService.addZoneToCollectionIfMissing(zones, this.editForm.get('zone')!.value)))
      .subscribe((zones: IZone[]) => (this.zonesSharedCollection = zones));
  }

  protected createFromForm(): IGrandeur {
    return {
      ...new Grandeur(),
      id: this.editForm.get(['id'])!.value,
      type: this.editForm.get(['type'])!.value,
      valeur: this.editForm.get(['valeur'])!.value,
      date: this.editForm.get(['date'])!.value,
      zone: this.editForm.get(['zone'])!.value,
    };
  }
}
