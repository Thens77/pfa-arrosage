import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { TypePlanteService } from '../service/type-plante.service';

import { TypePlanteComponent } from './type-plante.component';

describe('TypePlante Management Component', () => {
  let comp: TypePlanteComponent;
  let fixture: ComponentFixture<TypePlanteComponent>;
  let service: TypePlanteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TypePlanteComponent],
    })
      .overrideTemplate(TypePlanteComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TypePlanteComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TypePlanteService);

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
    expect(comp.typePlantes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
