import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { Task } from '../models/task';

@Injectable()
export class TaskService {
  huertaskApiUrl = 'http://huertask-dev.herokuapp.com/api';


  constructor(public http: Http) { }

  getFutureTasks(): Observable<Task[]> {
    return this.http.get(`${this.huertaskApiUrl}/tasks/`)
      .map(res => <Task[]>res.json());
  }

  getPastTasks(): Observable<Task[]> {
    return this.http.get(`${this.huertaskApiUrl}/tasks/?filter=past`)
      .map(res => <Task[]>res.json());
  }

  createTask(body: Object): Observable<Task[]> {
    let headers    = new Headers({ 'Content-Type': 'application/json' });
    let options    = new RequestOptions({ headers: headers });

    return this.http.post(`${this.huertaskApiUrl}/tasks/`, body, options)
                    .map((res:Response) => <Task[]>res.json())
                    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  participate(task_id, person_id): Observable<Task> {
    let headers    = new Headers({ 'Content-Type': 'application/json' });
    let options    = new RequestOptions({ headers: headers });
    let body       = {'person_id': person_id};

    return this.http.put(`${this.huertaskApiUrl}/tasks/${task_id}/participate/`, body, options)
      .map(res => <Task>res.json())
      .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  unparticipate(task_id, person_id): Observable<Task> {
    let headers    = new Headers({ 'Content-Type': 'application/json' });
    let options    = new RequestOptions({ headers: headers });
    let body       = {'person_id': person_id};

    return this.http.put(`${this.huertaskApiUrl}/tasks/${task_id}/unparticipate/`, body, options)
      .map(res => <Task>res.json())
      .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  getCategory(id){
    return this.categories.find(cat => cat.id == id);
  }

  categories = [
    {
      id: 1,
      name: "mantenimiento"
    },
    {
      id: 2,
      name: "riego"
    },
    {
      id: 3,
      name: "carpinteria"
    },
    {
      id: 4,
      name: "jardineria"
    },
    {
      id: 5,
      name: "cultivo"
    },
    {
      id: 6,
      name: "cultura"
    }
  ];
}

@Injectable()
export class TaskServiceMock {
  tasks = [
    {
      "id":1,
      "created_at":"2016-11-23T13:38:32+01:00",
      "title":"Tarea numero 1",
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
      "negative_replies":[]
    },
    {
      "id":140,
      "created_at":"2016-11-21T09:02:40+00:00",
      "title":"Tarea numero 2",
      "from_date":"2020-11-12T13:00:00+00:00",
      "to_date":null,
      "required_people":2,
      "category":"2",
      "note":null,
      "people_going":[
        {
          "id":3,
          "name":"Persona 3"
        }
      ],
      "negative_replies":[]
    },
    {
      "id":139,
      "created_at":"2016-11-21T09:02:40+00:00",
      "title":"Tarea numero 1",
      "from_date":"2020-11-12T13:00:00+00:00",
      "to_date":null,
      "required_people":1,
      "category":"1",
      "note":null,
      "people_going":[
        {
          "id":3,
          "name":"Persona 3"
        }
      ],
      "negative_replies":[]
    }
  ];

  getFutureTasks(): Observable<Task[]> {
    return Observable.of(this.tasks);
  }

  getPastTasks(): Observable<Task[]> {
    return Observable.of(this.tasks);
  }

  getCategory(id){
    return this.categories.find(cat => cat.id == id);
  }

  createTask(body: Object): Observable<Task> {
    return Observable.of(this.tasks[0])
  }

  participate(task_id, person_id): Observable<Task> {
    let task = this.tasks[0];
    task.people_going.push({
      "id":1,
      "name":"Persona 1"
    });
    return Observable.of(task)
  }

  unparticipate(task_id, person_id): Observable<Task> {
    let task = this.tasks[1];
    task.negative_replies.push({
      "id":1,
      "name":"Persona 1"
    });
    return Observable.of(task)
  }

  categories = [
    {
      id: 1,
      name: "mantenimiento"
    },
    {
      id: 2,
      name: "riego"
    },
    {
      id: 3,
      name: "carpinteria"
    }
  ];
}
