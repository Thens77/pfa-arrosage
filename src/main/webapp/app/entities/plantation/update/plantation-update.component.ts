import { Component, Inject, OnInit, Optional } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPlantation, Plantation } from '../plantation.model';
import { PlantationService } from '../service/plantation.service';
import { IPlante } from 'app/entities/plante/plante.model';
import { PlanteService } from 'app/entities/plante/service/plante.service';
import { IZone } from 'app/entities/zone/zone.model';
import { ZoneService } from 'app/entities/zone/service/zone.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'jhi-plantation-update',
  templateUrl: './plantation-update.component.html',
})
export class PlantationUpdateComponent implements OnInit {
  isSaving = false;
  editable = true ;
  plantesSharedCollection: IPlante[] = [];
  zonesSharedCollection: IZone[] = [];

  editForm = this.fb.group({
    id: [],
    date: [],
    nbrPlante: [],
    plante: [],
    zone: [],
  });

  constructor(
    protected plantationService: PlantationService,
    protected planteService: PlanteService,
    protected zoneService: ZoneService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    @Optional() public dialogRef: MatDialogRef<PlantationUpdateComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any |undefined  
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ plantation }) => {
      if(this.data === undefined || this.data === null){
        
        this.updateForm(plantation);
      }
      else{
        this.editable = false ;
        this.setDefaultValue();
      }

      this.loadRelationshipsOptions();
    });
  }
  setDefaultValue():void{
    this.editForm.patchValue({
      zone : this.data.z 
    })
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const plantation = this.createFromForm();
    if (plantation.id !== undefined && typeof(plantation.id)==="number" ) {
      this.subscribeToSaveResponse(this.plantationService.update(plantation));
    } else {
      this.subscribeToSaveResponse(this.plantationService.create(plantation));
    }
  }

  trackPlanteById(_index: number, item: IPlante): number {
    return item.id!;
  }

  trackZoneById(_index: number, item: IZone): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPlantation>>): void {
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

  protected updateForm(plantation: IPlantation): void {
    this.editForm.patchValue({
      id: plantation.id,
      date: plantation.date,
      nbrPlante: plantation.nbrPlante,
      plante: plantation.plante,
      zone: plantation.zone,
    });

    this.plantesSharedCollection = this.planteService.addPlanteToCollectionIfMissing(this.plantesSharedCollection, plantation.plante);
    this.zonesSharedCollection = this.zoneService.addZoneToCollectionIfMissing(this.zonesSharedCollection, plantation.zone);
  }

  protected loadRelationshipsOptions(): void {
    this.planteService
      .query()
      .pipe(map((res: HttpResponse<IPlante[]>) => res.body ?? []))
      .pipe(map((plantes: IPlante[]) => this.planteService.addPlanteToCollectionIfMissing(plantes, this.editForm.get('plante')!.value)))
      .subscribe((plantes: IPlante[]) => (this.plantesSharedCollection = plantes));

    this.zoneService
      .query()
      .pipe(map((res: HttpResponse<IZone[]>) => res.body ?? []))
      .pipe(map((zones: IZone[]) => this.zoneService.addZoneToCollectionIfMissing(zones, this.editForm.get('zone')!.value)))
      .subscribe((zones: IZone[]) => (this.zonesSharedCollection = zones));
  }

  protected createFromForm(): IPlantation {
    return {
      ...new Plantation(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value,
      nbrPlante: this.editForm.get(['nbrPlante'])!.value,
      plante: this.editForm.get(['plante'])!.value,
      zone: this.editForm.get(['zone'])!.value,
    };
  }
}
