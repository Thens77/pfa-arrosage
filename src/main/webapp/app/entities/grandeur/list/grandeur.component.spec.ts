import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { GrandeurService } from '../service/grandeur.service';

import { GrandeurComponent } from './grandeur.component';

describe('Grandeur Management Component', () => {
  let comp: GrandeurComponent;
  let fixture: ComponentFixture<GrandeurComponent>;
  let service: GrandeurService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [GrandeurComponent],
    })
      .overrideTemplate(GrandeurComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GrandeurComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(GrandeurService);

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
    expect(comp.grandeurs?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
