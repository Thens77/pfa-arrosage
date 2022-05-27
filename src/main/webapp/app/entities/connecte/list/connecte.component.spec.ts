import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ConnecteService } from '../service/connecte.service';

import { ConnecteComponent } from './connecte.component';

describe('Connecte Management Component', () => {
  let comp: ConnecteComponent;
  let fixture: ComponentFixture<ConnecteComponent>;
  let service: ConnecteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ConnecteComponent],
    })
      .overrideTemplate(ConnecteComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ConnecteComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ConnecteService);

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
    expect(comp.connectes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
