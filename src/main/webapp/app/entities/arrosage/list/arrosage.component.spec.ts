import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ArrosageService } from '../service/arrosage.service';

import { ArrosageComponent } from './arrosage.component';

describe('Arrosage Management Component', () => {
  let comp: ArrosageComponent;
  let fixture: ComponentFixture<ArrosageComponent>;
  let service: ArrosageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ArrosageComponent],
    })
      .overrideTemplate(ArrosageComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ArrosageComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ArrosageService);

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
    expect(comp.arrosages?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
