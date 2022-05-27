import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PlantationService } from '../service/plantation.service';

import { PlantationComponent } from './plantation.component';

describe('Plantation Management Component', () => {
  let comp: PlantationComponent;
  let fixture: ComponentFixture<PlantationComponent>;
  let service: PlantationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PlantationComponent],
    })
      .overrideTemplate(PlantationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PlantationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PlantationService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.plantations?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
