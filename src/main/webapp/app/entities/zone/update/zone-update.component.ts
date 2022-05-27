import { Component, OnInit, ElementRef, Optional, Inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IZone, Zone } from '../zone.model';
import { ZoneService } from '../service/zone.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ITypeSol } from 'app/entities/type-sol/type-sol.model';
import { TypeSolService } from 'app/entities/type-sol/service/type-sol.service';
import { IEspaceVert } from 'app/entities/espace-vert/espace-vert.model';
import { EspaceVertService } from 'app/entities/espace-vert/service/espace-vert.service';
import { IBoitier } from 'app/entities/boitier/boitier.model';
import { BoitierService } from 'app/entities/boitier/service/boitier.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'jhi-zone-update',
  templateUrl: './zone-update.component.html',
})
export class ZoneUpdateComponent implements OnInit {
  isSaving = false;
  ide : number | undefined ;
  typeSolsSharedCollection: ITypeSol[] = [];
  espaceVertsSharedCollection: IEspaceVert[] = [];
  boitiersSharedCollection: IBoitier[] = [];
   es? : IEspaceVert | undefined ;
   editable = true ;
  

  editForm = this.fb.group({
    id: [],
    libelle: [],
    superficie: [],
    nbrMaxPlante: [],
    photo: [],
    photoContentType: [],
    typesol: [],
    espaceVert: [] ,
    boitier: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected zoneService: ZoneService,
    protected typeSolService: TypeSolService,
    protected espaceVertService: EspaceVertService,
    protected boitierService: BoitierService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    @Optional() public dialogRef: MatDialogRef<ZoneUpdateComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any |undefined  
  ) {
  
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ zone }) => {
      
      if(this.data === undefined || this.data === null){
        
        this.updateForm(zone);
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
      espaceVert : this.data.e 
    })
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
    history.back();
  }

  save(): void {
    this.isSaving = true;
    
    const zone = this.createFromForm();
    if (zone.id !== undefined && typeof(zone.id)==="number") {
      this.subscribeToSaveResponse(this.zoneService.update(zone));
    } else {
      this.subscribeToSaveResponse(this.zoneService.create(zone));
    }
  }

  trackTypeSolById(_index: number, item: ITypeSol): number {
    return item.id!;
  }

  trackEspaceVertById(_index: number, item: IEspaceVert): number {
    return item.id!;
  }

  trackBoitierById(_index: number, item: IBoitier): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IZone>>): void {
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

  protected updateForm(zone: IZone): void {
    this.editForm.patchValue({
      id: zone.id,
      libelle: zone.libelle,
      superficie: zone.superficie,
      nbrMaxPlante: zone.nbrMaxPlante,
      photo: zone.photo,
      photoContentType: zone.photoContentType,
      typesol: zone.typesol,
      espaceVert: zone.espaceVert,
      boitier: zone.boitier,
    });

    this.typeSolsSharedCollection = this.typeSolService.addTypeSolToCollectionIfMissing(this.typeSolsSharedCollection, zone.typesol);
    this.espaceVertsSharedCollection = this.espaceVertService.addEspaceVertToCollectionIfMissing(
      this.espaceVertsSharedCollection,
      zone.espaceVert
    );
    this.boitiersSharedCollection = this.boitierService.addBoitierToCollectionIfMissing(this.boitiersSharedCollection, zone.boitier);
  }

  protected loadRelationshipsOptions(): void {
    this.typeSolService
      .query()
      .pipe(map((res: HttpResponse<ITypeSol[]>) => res.body ?? []))
      .pipe(
        map((typeSols: ITypeSol[]) => this.typeSolService.addTypeSolToCollectionIfMissing(typeSols, this.editForm.get('typesol')!.value))
      )
      .subscribe((typeSols: ITypeSol[]) => (this.typeSolsSharedCollection = typeSols));

    this.espaceVertService
      .query()
      .pipe(map((res: HttpResponse<IEspaceVert[]>) => res.body ?? []))
      .pipe(
        map((espaceVerts: IEspaceVert[]) =>
          this.espaceVertService.addEspaceVertToCollectionIfMissing(espaceVerts, this.editForm.get('espaceVert')!.value)
        )
      )
      .subscribe((espaceVerts: IEspaceVert[]) => (this.espaceVertsSharedCollection = espaceVerts));

    this.boitierService
      .queryboitiers()
      .pipe(map((res: HttpResponse<IBoitier[]>) => res.body ?? []))
      .pipe(
        map((boitiers: IBoitier[]) => this.boitierService.addBoitierToCollectionIfMissing(boitiers, this.editForm.get('boitier')!.value))
      )
      .subscribe((boitiers: IBoitier[]) => (this.boitiersSharedCollection = boitiers));
  }

  protected createFromForm(): IZone {
    return {
      ...new Zone(),
      id: this.editForm.get(['id'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      superficie: this.editForm.get(['superficie'])!.value,
      nbrMaxPlante: this.editForm.get(['nbrMaxPlante'])!.value,
      photoContentType: this.editForm.get(['photoContentType'])!.value,
      photo: this.editForm.get(['photo'])!.value,
      typesol: this.editForm.get(['typesol'])!.value,
      espaceVert: this.editForm.get(['espaceVert'])!.value,
      boitier: this.editForm.get(['boitier'])!.value,
    };
  }
}
