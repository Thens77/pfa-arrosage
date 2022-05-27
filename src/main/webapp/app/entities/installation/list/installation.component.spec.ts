import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { InstallationService } from '../service/installation.service';

import { InstallationComponent } from './installation.component';

describe('Installation Management Component', () => {
  let comp: InstallationComponent;
  let fixture: ComponentFixture<InstallationComponent>;
  let service: InstallationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [InstallationComponent],
    })
      .overrideTemplate(InstallationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InstallationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(InstallationService);

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
    expect(comp.installations?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
