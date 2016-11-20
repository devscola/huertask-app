import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { Task } from '../models/task';

@Injectable()
export class TaskService {
  huertaskApiUrl = 'http://localhost:9292/api';

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
