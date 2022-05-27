import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IEspaceVert } from 'app/entities/espace-vert/espace-vert.model';
import { EspaceVertService } from 'app/entities/espace-vert/service/espace-vert.service';
import { ZoneService } from 'app/entities/zone/service/zone.service';
import { IZone } from 'app/entities/zone/zone.model';
import { Chart, ChartData, ChartOptions } from 'chart.js';
import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'jhi-chart-z',
  templateUrl: './chart-z.component.html',
  styleUrls: ['./chart-z.component.scss']
})

export class ChartZComponent implements OnInit {
  c=0 ;
 
  data : number[] = [] ;
  zones: IZone[] = [];
  chartDatasets : any[] = [] ;
  chartLabels :string[] = [];
  espaceVertsSharedCollection: IEspaceVert[] = [];
  isLoading=false ;
  chartColors = [
    {
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 2,
    }
  ];
  salesData: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      { label: 'Mobiles', data: [1000, 1200, 1050, 2000, 500], tension: 0.5 },
      { label: 'Laptop', data: [200, 100, 400, 50, 90], tension: 0.5 },
      { label: 'AC', data: [500, 400, 350, 450, 650], tension: 0.5 },
      { label: 'Headset', data: [1200, 1500, 1020, 1600, 900], tension: 0.5 },
    ],
  };

  chartOptions: ChartOptions = {
    responsive: false,
    plugins: {
      title: {
        display: true,
        text: 'Monthly Sales Data',
      },
    },
  };
  chart: Chart<"line", number[], string> | undefined;
  constructor(private httpClient: HttpClient,protected zoneService: ZoneService , protected espaceVertService: EspaceVertService,) {}
  
  
  loadAll(e? : number): number {
    this.isLoading = true;

    this.zoneService.query(e).subscribe({
      next: (res: HttpResponse<IZone[]>) => {
        this.isLoading = false;
        this.zones = res.body ?? [];
        console.log(this.zones);
        this.c = this.zones.length ;
      },
      error: () => {
        this.isLoading = false;
        this.c=0;
      },
    });
    return this.c ;
  }

  ngOnInit(): void {
    this.loadRelationshipsOptions() ;
    console.log(this.espaceVertsSharedCollection);

  }
  
 
  protected loadRelationshipsOptions(): void {
   
    this.espaceVertService
      .query()
      .pipe(map((res: HttpResponse<IEspaceVert[]>) => this.espaceVertsSharedCollection=res.body ?? []))
      .subscribe((espaceVerts: IEspaceVert[]) => (
        this.espaceVertsSharedCollection = espaceVerts ,
        this.espaceVertsSharedCollection.forEach(element => {
          this.c=0;
          console.log(element.id);
          this.zoneService.query(element.id).subscribe({
            next: (res: HttpResponse<IZone[]>) => {
              this.isLoading = false;
              this.zones = res.body ?? [];
              console.log(this.zones);
              this.c = this.zones.length ;
              this.chartLabels.push("espace")
              ;
          this.data.push(this.c);
          console.log(this.data)
          console.log(this.c);
            },
            error: () => {
              this.isLoading = false;
            },
          });
          
          
        })
        
     
        ))
        ;    
        this.chart = new Chart('canvas',{
          type : 'line',
          data: {
            labels: this.chartLabels ,
            datasets: [{
                label: 'coin price',
                data: this.data,
                borderWidth: 3,
                fill :false,
                backgroundColor : 'rgba(93, 175, 89, 0.1)',
                borderColor : '#3e95cd'
            }]
        },
  });
}}
