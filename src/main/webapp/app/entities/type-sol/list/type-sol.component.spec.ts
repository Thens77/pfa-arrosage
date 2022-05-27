import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { TypeSolService } from '../service/type-sol.service';

import { TypeSolComponent } from './type-sol.component';

describe('TypeSol Management Component', () => {
  let comp: TypeSolComponent;
  let fixture: ComponentFixture<TypeSolComponent>;
  let service: TypeSolService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TypeSolComponent],
    })
      .overrideTemplate(TypeSolComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TypeSolComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TypeSolService);

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
    expect(comp.typeSols?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
