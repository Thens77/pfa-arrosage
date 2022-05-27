import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IEspaceVert, EspaceVert } from '../espace-vert.model';
import { EspaceVertService } from '../service/espace-vert.service';

import { EspaceVertRoutingResolveService } from './espace-vert-routing-resolve.service';

describe('EspaceVert routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: EspaceVertRoutingResolveService;
  let service: EspaceVertService;
  let resultEspaceVert: IEspaceVert | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(EspaceVertRoutingResolveService);
    service = TestBed.inject(EspaceVertService);
    resultEspaceVert = undefined;
  });

  describe('resolve', () => {
    it('should return IEspaceVert returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEspaceVert = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEspaceVert).toEqual({ id: 123 });
    });

    it('should return new IEspaceVert if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEspaceVert = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultEspaceVert).toEqual(new EspaceVert());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as EspaceVert })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEspaceVert = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEspaceVert).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
