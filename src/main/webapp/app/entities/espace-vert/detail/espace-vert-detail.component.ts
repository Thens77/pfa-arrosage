import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IEspaceVert } from '../espace-vert.model';
import { DataUtils } from 'app/core/util/data-util.service';
import { MatDialog } from '@angular/material/dialog';
import { ZoneUpdateComponent } from 'app/entities/zone/update/zone-update.component';


@Component({
  selector: 'jhi-espace-vert-detail',
  templateUrl: './espace-vert-detail.component.html',
})
export class EspaceVertDetailComponent implements OnInit {
  espaceVert: IEspaceVert | null = null;
  
  constructor( public dialog: MatDialog  ,protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ espaceVert }) => {
      this.espaceVert = espaceVert;
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
      const dialogRef = this.dialog.open(ZoneUpdateComponent ,{
        width: '650px',
        backdropClass: 'custom-dialog-backdrop-class',
        panelClass: 'custom-dialog-panel-class',
        data: { e: this.espaceVert }
      });
  
    
    }
  
}


