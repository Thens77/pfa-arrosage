import { NgModule } from '@angular/core';
import { ChartZComponent } from './chart-z/chart-z.component';
import { NgChartsModule } from 'ng2-charts';
import { SharedModule } from 'app/shared/shared.module';
import { CRoutingModule } from './c/c-routing.module';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';


@NgModule({
  
  declarations: [
    ChartZComponent,
    
  ],
  imports: [
   
    SharedModule,
    NgChartsModule,
   
    SharedModule, 
    MatDialogModule,
    CRoutingModule
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    },
    
 ],
})
export class ChartModule { }
