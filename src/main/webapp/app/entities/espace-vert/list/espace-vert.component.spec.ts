import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { EspaceVertService } from '../service/espace-vert.service';

import { EspaceVertComponent } from './espace-vert.component';

describe('EspaceVert Management Component', () => {
  let comp: EspaceVertComponent;
  let fixture: ComponentFixture<EspaceVertComponent>;
  let service: EspaceVertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EspaceVertComponent],
    })
      .overrideTemplate(EspaceVertComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EspaceVertComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EspaceVertService);

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
    expect(comp.espaceVerts?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
