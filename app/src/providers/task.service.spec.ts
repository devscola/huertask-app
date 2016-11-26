import { async, inject, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { TaskService } from './task.service';

let mockResponse = {
  "id":0,
  "title":"Fake title"
};

describe('TaskService', () => {
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

    it('call correct url with correct http method', async(inject(
      [TaskService, MockBackend], (service, mockBackend) => {

      mockBackend.connections.subscribe(conn => {
        conn.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(mockResponse) })));
        expect(conn.request.url).toEqual(`${service.huertaskApiUrl}/tasks/`);
        expect(conn.request.method).toEqual(RequestMethod.Get);
      });

      const result = service.getFutureTasks();

      result.subscribe(res => {
        expect(res).toEqual(mockResponse);
      });
    })));

  });

  describe('getPastTasks', () => {

    it('call correct url with correct http method', async(inject(
      [TaskService, MockBackend], (service, mockBackend) => {

      mockBackend.connections.subscribe(conn => {
        conn.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(mockResponse) })));
        expect(conn.request.url).toEqual(`${service.huertaskApiUrl}/tasks/?filter=past`);
        expect(conn.request.method).toEqual(RequestMethod.Get);
      });

      const result = service.getPastTasks();

      result.subscribe(res => {
        expect(res).toEqual(mockResponse);
      });
    })));

  });

  describe('createTask', () => {

    it('call correct url with correct http method', async(inject(
      [TaskService, MockBackend], (service, mockBackend) => {

      mockBackend.connections.subscribe(conn => {
        conn.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(mockResponse) })));
        expect(conn.request.url).toEqual(`${service.huertaskApiUrl}/tasks/`);
        expect(conn.request.method).toEqual(RequestMethod.Post);
      });

      const result = service.createTask();

      result.subscribe(res => {
        expect(res).toEqual(mockResponse);
      });
    })));

  });

  describe('editTask', () => {
    let task_id = 1

    it('call correct url with correct http method', async(inject(
      [TaskService, MockBackend], (service, mockBackend) => {

      mockBackend.connections.subscribe(conn => {
        conn.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(mockResponse) })));
        expect(conn.request.url).toEqual(`${service.huertaskApiUrl}/tasks/${task_id}`);
        expect(conn.request.method).toEqual(RequestMethod.Put);
      });

      const result = service.editTask({'id': task_id});

      result.subscribe(res => {
        expect(res).toEqual(mockResponse);
      });
    })));

  });
});
