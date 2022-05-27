import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PlanteService } from '../service/plante.service';

import { PlanteComponent } from './plante.component';

describe('Plante Management Component', () => {
  let comp: PlanteComponent;
  let fixture: ComponentFixture<PlanteComponent>;
  let service: PlanteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PlanteComponent],
    })
      .overrideTemplate(PlanteComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PlanteComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PlanteService);

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
    expect(comp.plantes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
