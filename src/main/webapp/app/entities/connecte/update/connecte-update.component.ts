import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IConnecte, Connecte } from '../connecte.model';
import { ConnecteService } from '../service/connecte.service';
import { ICapteur } from 'app/entities/capteur/capteur.model';
import { CapteurService } from 'app/entities/capteur/service/capteur.service';
import { IBoitier } from 'app/entities/boitier/boitier.model';
import { BoitierService } from 'app/entities/boitier/service/boitier.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'jhi-connecte-update',
  templateUrl: './connecte-update.component.html',
})
export class ConnecteUpdateComponent implements OnInit {
  isSaving = false;
  capteursSharedCollection: ICapteur[] = [];
  boitiersSharedCollection: IBoitier[] = [];
  dropdownList :any = [];
  selectedItems :any = [];
  dropdownSettings :IDropdownSettings={};
  capteurs: ICapteur[] = []
  capteursB: ICapteur[] = []
  editForm = this.fb.group({
    id: [],
    fonctionnel: [],
    branche: [],
    capteur: [],
    boitier: [],
  });
  isLoading=false;
  nbr= 0;
 

  constructor(
    protected connecteService: ConnecteService,
    protected capteurService: CapteurService,
    protected boitierService: BoitierService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}
  loadCapforBoitier(): void {
    this.isLoading = true;

    this.capteurService.query(this.editForm.get(['boitier'])!.value.id).subscribe({
      next: (res: HttpResponse<ICapteur[]>) => {
        this.isLoading = false;
        this.capteursB = res.body ?? [];
        this.nbr=this.capteursB.length;
        
        console.log(this.nbr);
      },
      error: () => {
        this.isLoading = false;
      },
    });
   
  }
  loadAvailable(): void {
   

    this.connecteService.Available().subscribe({
      next: (res: HttpResponse<ICapteur[]>) => {
        
        this.capteurs = res.body ?? [];
        this.dropdownList = this.capteurs ;
        
        
   
      },
            
    });
   
  }
  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ connecte }) => {
      this.updateForm(connecte);

      this.loadRelationshipsOptions();
    });
    this.activatedRoute.data.subscribe(({ connecte }) => {
      this.updateForm(connecte);
      this.loadRelationshipsOptions();
      this.loadAvailable();});
      
      this.dropdownSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'type',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
        allowSearchFilter: true
      };
  }

  previousState(): void {
    console.log("yes");
  }

  save(): void {
    this.isSaving = true;
    for(const c of this.editForm.get(['capteur'])!.value){
      const connecte = this.createFromForm(c);
       
      if (connecte.id !== undefined) {
        this.subscribeToSaveResponse(this.connecteService.update(connecte));
      } else {
        this.capteurService.query(this.editForm.get(['boitier'])!.value.id).subscribe({
          next: (res: HttpResponse<ICapteur[]>) => {
            this.isLoading = false;
            this.capteursB = res.body ?? [];
            this.nbr=this.capteursB.length;
            if(this.nbr<= this.editForm.get(['boitier'])!.value.nbrBranche-1){
              console.log(this.editForm.get(['boitier'])!.value.nbrBranche);
              console.log(this.nbr)
              this.subscribeToSaveResponse(this.connecteService.create(connecte));
            }
            
            console.log(this.nbr);
          },
          error: () => {
            this.isLoading = false;
          },
        });
        
       
      }
    }
    window.history.back();
    
  }

  trackCapteurById(_index: number, item: ICapteur): number {
    return item.id!;
  }

  trackBoitierById(_index: number, item: IBoitier): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IConnecte>>): void {
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

  protected updateForm(connecte: IConnecte): void {
    this.editForm.patchValue({
      id: connecte.id,
      fonctionnel: connecte.fonctionnel,
      branche: connecte.branche,
      capteur: connecte.capteur,
      boitier: connecte.boitier,
    });

    this.capteursSharedCollection = this.capteurService.addCapteurToCollectionIfMissing(this.capteursSharedCollection, connecte.capteur);
    this.boitiersSharedCollection = this.boitierService.addBoitierToCollectionIfMissing(this.boitiersSharedCollection, connecte.boitier);
  }

  protected loadRelationshipsOptions(): void {
    this.capteurService
      .query()
      .pipe(map((res: HttpResponse<ICapteur[]>) => res.body ?? []))
      .pipe(
        map((capteurs: ICapteur[]) => this.capteurService.addCapteurToCollectionIfMissing(capteurs, this.editForm.get('capteur')!.value))
      )
      .subscribe((capteurs: ICapteur[]) => (this.capteursSharedCollection = capteurs));

    this.boitierService
      .query()
      .pipe(map((res: HttpResponse<IBoitier[]>) => res.body ?? []))
      .pipe(
        map((boitiers: IBoitier[]) => this.boitierService.addBoitierToCollectionIfMissing(boitiers, this.editForm.get('boitier')!.value))
      )
      .subscribe((boitiers: IBoitier[]) => (this.boitiersSharedCollection = boitiers));
  }

  protected createFromForm(c : ICapteur): IConnecte {
    return {
      ...new Connecte(),
      id: this.editForm.get(['id'])!.value,
      fonctionnel: this.editForm.get(['fonctionnel'])!.value,
      branche: this.editForm.get(['branche'])!.value,
      capteur:  c,
      boitier: this.editForm.get(['boitier'])!.value,
    };
  }
}
