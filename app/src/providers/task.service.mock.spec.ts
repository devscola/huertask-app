import { async, inject, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { TaskService } from './task.service';

describe('TaskService (Mocked)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskService,

        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ],
      imports: [
        HttpModule
      ]
    });
  });

  it('should construct', async(inject(
    [TaskService, MockBackend], (service, mockBackend) => {

    expect(service).toBeDefined();
  })));

  describe('getFutureTasks', () => {
    const mockResponse = [{
        "id":6,
        "created_at":"2016-11-16T19:09:45+01:00",
        "title":"Tarea numero 6",
        "from_date":"2020-11-12T13:00:00+00:00",
        "to_date":null,
        "people":6,
        "category":"6",
        "note":null
      },
      {
        "id":5,
        "created_at":"2016-11-16T19:09:45+01:00",
        "title":"Tarea numero 5",
        "from_date":"2020-11-12T13:00:00+00:00",
        "to_date":null,
        "people":5,
        "category":"5",
        "note":null
      }
    ];

    it('should get a list of future tasks', async(inject(
      [TaskService, MockBackend], (service, mockBackend) => {

      mockBackend.connections.subscribe(conn => {
        conn.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(mockResponse) })));
      });

      const result = service.getFutureTasks();

      result.subscribe(res => {
        expect(res).toEqual(mockResponse);
      });
    })));

  });
});
