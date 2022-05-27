import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { IZone } from '../zone.model';
import { DataUtils } from 'app/core/util/data-util.service';
import { PlantationUpdateComponent } from 'app/entities/plantation/update/plantation-update.component';

@Component({
  selector: 'jhi-zone-detail',
  templateUrl: './zone-detail.component.html',
})
export class ZoneDetailComponent implements OnInit {
  zone: IZone | null = null;


  constructor( public dialog: MatDialog  ,protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ zone }) => {
      this.zone = zone;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
  openDialog() :void {
    const dialogRef = this.dialog.open(PlantationUpdateComponent ,{
      width: '650px',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: 'custom-dialog-panel-class',
      data: { z: this.zone }
    });

  
  }
}
