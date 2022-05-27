import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ZoneService } from '../service/zone.service';

import { ZoneComponent } from './zone.component';

describe('Zone Management Component', () => {
  let comp: ZoneComponent;
  let fixture: ComponentFixture<ZoneComponent>;
  let service: ZoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ZoneComponent],
    })
      .overrideTemplate(ZoneComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ZoneComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ZoneService);

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
    expect(comp.zones?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
