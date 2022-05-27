import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IArrosage, Arrosage } from '../arrosage.model';
import { ArrosageService } from '../service/arrosage.service';
import { IZone } from 'app/entities/zone/zone.model';
import { ZoneService } from 'app/entities/zone/service/zone.service';

@Component({
  selector: 'jhi-arrosage-update',
  templateUrl: './arrosage-update.component.html',
})
export class ArrosageUpdateComponent implements OnInit {
  isSaving = false;

  zonesSharedCollection: IZone[] = [];

  editForm = this.fb.group({
    id: [],
    date: [],
    duree: [],
    quantiteEau: [],
    zone: [],
  });

  constructor(
    protected arrosageService: ArrosageService,
    protected zoneService: ZoneService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ arrosage }) => {
      this.updateForm(arrosage);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const arrosage = this.createFromForm();
    if (arrosage.id !== undefined) {
      this.subscribeToSaveResponse(this.arrosageService.update(arrosage));
    } else {
      this.subscribeToSaveResponse(this.arrosageService.create(arrosage));
    }
  }

  trackZoneById(_index: number, item: IZone): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IArrosage>>): void {
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

  protected updateForm(arrosage: IArrosage): void {
    this.editForm.patchValue({
      id: arrosage.id,
      date: arrosage.date,
      duree: arrosage.duree,
      quantiteEau: arrosage.quantiteEau,
      zone: arrosage.zone,
    });

    this.zonesSharedCollection = this.zoneService.addZoneToCollectionIfMissing(this.zonesSharedCollection, arrosage.zone);
  }

  protected loadRelationshipsOptions(): void {
    this.zoneService
      .query()
      .pipe(map((res: HttpResponse<IZone[]>) => res.body ?? []))
      .pipe(map((zones: IZone[]) => this.zoneService.addZoneToCollectionIfMissing(zones, this.editForm.get('zone')!.value)))
      .subscribe((zones: IZone[]) => (this.zonesSharedCollection = zones));
  }

  protected createFromForm(): IArrosage {
    return {
      ...new Arrosage(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value,
      duree: this.editForm.get(['duree'])!.value,
      quantiteEau: this.editForm.get(['quantiteEau'])!.value,
      zone: this.editForm.get(['zone'])!.value,
    };
  }
}
