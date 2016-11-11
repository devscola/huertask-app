import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { Task } from '../models/task';

@Injectable()
export class TaskService {
  taskApiUrl = 'http://huertask-dev.herokuapp.com/api';

  constructor(public http: Http) { }

  getFutureTasks(): Observable<Task[]> {
    return this.http.get(`${this.taskApiUrl}/tasks/`)
      .map(res => <Task[]>res.json());
  }

  getPastTasks(): Observable<Task[]> {
    return this.http.get(`${this.taskApiUrl}/tasks/?filter=past`)
      .map(res => <Task[]>res.json());
  }
}
