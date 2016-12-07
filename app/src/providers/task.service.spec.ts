import { async, inject, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { TaskService } from './task.service';

let mockResponse = [{
  "id":1,
  "created_at":"2016-11-23T13:38:32+01:00",
  "title":"Tarea numero 1",
  "status":0,
  "from_date":"2020-11-12T13:00:00+00:00",
  "to_date":null,
  "required_people":1,
  "category":"1",
  "note":"Esta es la nota de la tarea numero 1",
  "people_going":[
    {
      "id":3,
      "name":"Persona 3"
    }
  ],
  "people_not_going":[]
}];


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
        expect(JSON.stringify(res)).toEqual(JSON.stringify(service.instanciatedTasks(mockResponse)));
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
        expect(JSON.stringify(res)).toEqual(JSON.stringify(service.instanciatedTasks(mockResponse)));
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

  describe('deleteTask', () => {

    it('call correct url with correct http method', async(inject(
      [TaskService, MockBackend], (service, mockBackend) => {

      const task_id = 1;

      mockBackend.connections.subscribe(conn => {
        conn.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(mockResponse) })));
        expect(conn.request.url).toEqual(`${service.huertaskApiUrl}/tasks/${task_id}`);
        expect(conn.request.method).toEqual(RequestMethod.Delete);
      });

      const result = service.deleteTask(task_id);

      result.subscribe(res => {
        expect(res).toEqual(mockResponse);
      });
    })));

  });
});
