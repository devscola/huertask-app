import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { Task } from '../models/task';
import { Category } from '../models/category';

@Injectable()
export class TaskService {
  huertaskApiUrl = 'http://huertask-dev.herokuapp.com/api';

  isAdmin: boolean = false;

  constructor(public http: Http) { }

  instanciatedTasks(json): Task[]{
    let tasks = []
    for(let object in json){
      tasks.push(this.instanciatedTask(json[object]))
    }
    return tasks
  }

  instanciatedTask(object): Task{
    let task = new Task();
    for(let param in object){
      task[param] = object[param]
    }
    return task
  }

  getFutureTasks(user_id = null): Observable<Task[]> {
    return this.getTasks(user_id);
  }

  getPastTasks(user_id = null): Observable<Task[]> {
    return this.getTasks(user_id, 'past');
  }

  getTasks(user_id = null, filter = null): Observable<Task[]> {
    let params = this.getTasksUrlParams(user_id, filter)
    return this.http.get(`${this.huertaskApiUrl}/tasks/${params}`)
      .map(res => <Task[]>this.instanciatedTasks(res.json()));
  }

  getTasksUrlParams(user_id = null, filter = null): String {
    let params = filter  ? `?filter=${filter}&`  : "?";
    params += user_id ? `user_id=${user_id}&` : "";
    params = params.substring(0,params.length - 1);
    if (params == "?") params = "";

    return params
  }

  createTask(body: Object): Observable<Task> {
    let headers    = new Headers({ 'Content-Type': 'application/json' });
    let options    = new RequestOptions({ headers: headers });
    headers.append('Authorization', 'admin: ' + this.isAdmin);

    return this.http.post(`${this.huertaskApiUrl}/tasks/`, body, options)
                    .map((res:Response) => <Task[]>res.json())
                    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  editTask(body: Object): Observable<Task> {
    let headers    = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'admin: ' + this.isAdmin);

    let options    = new RequestOptions({ headers: headers });
    let id         = body['id']

    return this.http.put(`${this.huertaskApiUrl}/tasks/${id}`, body, options)
                    .map((res:Response) => <Task>this.instanciatedTask(res.json()))
                    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  deleteTask(task_id): Observable<Task> {
    let headers    = new Headers({ 'Content-Type': 'application/json' });
    let options    = new RequestOptions({ headers: headers });
    headers.append('Authorization', 'admin: ' + this.isAdmin);

    return this.http.delete(`${this.huertaskApiUrl}/tasks/${task_id}`)
                    .map((res:Response) => res.json())
                    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  going(task_id, person_id): Observable<Task> {
    let headers    = new Headers({ 'Content-Type': 'application/json' });
    let options    = new RequestOptions({ headers: headers });
    let body       = {'person_id': person_id};

    return this.http.put(`${this.huertaskApiUrl}/tasks/${task_id}/going/`, body, options)
      .map(res => <Task>this.instanciatedTask(res.json()))
      .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  notGoing(task_id, person_id): Observable<Task> {
    let headers    = new Headers({ 'Content-Type': 'application/json' });
    let options    = new RequestOptions({ headers: headers });
    let body       = {'person_id': person_id};

    return this.http.put(`${this.huertaskApiUrl}/tasks/${task_id}/notgoing/`, body, options)
      .map(res => <Task>this.instanciatedTask(res.json()))
      .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  getCategories(): Observable<Category[]> {
    return this.http.get(`${this.huertaskApiUrl}/categories/`)
      .map(res => <Category[]>this.instanciatedCategories(res.json()));
  }

  instanciatedCategories(json): Category[]{
    let categories = []
    for(let object in json){
      categories.push(this.instanciatedCategory(json[object]))
    }
    return categories
  }

  instanciatedCategory(object): Category{
    let category = new Category();
    for(let param in object){
      category[param] = object[param]
    }
    return category
  }

  createCategory(body: Object): Observable<Task> {
    let headers    = new Headers({ 'Content-Type': 'application/json' });
    let options    = new RequestOptions({ headers: headers });
    headers.append('Authorization', 'admin: ' + this.isAdmin);

    return this.http.post(`${this.huertaskApiUrl}/categories/`, body, options)
                    .map((res:Response) => <Category>res.json())
                    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  editCategory(body: Object): Observable<Category> {
    let headers    = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'admin: ' + this.isAdmin);
    let options    = new RequestOptions({ headers: headers });
    let id         = body['id']

    return this.http.put(`${this.huertaskApiUrl}/categories/${id}`, body, options)
                    .map((res:Response) => <Category>this.instanciatedCategory(res.json()))
                    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }

  deleteCategory(category_id): Observable<Task> {
    let headers    = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'admin: ' + this.isAdmin);
    let options    = new RequestOptions({ headers: headers });

    return this.http.delete(`${this.huertaskApiUrl}/categories/${category_id}`, options)
                    .map((res:Response) => res.json())
                    .catch((error:any) => Observable.throw(error.json() || 'Server error'));
  }
}

@Injectable()
export class TaskServiceMock {
  categories = [
    {
      "id": 1,
      "name": "mantenimiento",
      "description": "",
      "mandatory": false
    },
    {
      "id": 2,
      "name": "riego",
      "description": "Descripción...",
      "mandatory": true
    },
    {
      "id": 3,
      "name": "carpinteria",
      "description": "Descripción...",
      "mandatory": false
    }
  ];

  tasks;
  json = [
    {
      "id":1,
      "created_at":"2016-11-23T13:38:32+01:00",
      "title":"Tarea numero 1",
      "status":0,
      "from_date":"2020-11-12T13:00:00+00:00",
      "to_date":null,
      "required_people":1,
      "categories":[this.categories[0]],
      "note":"Esta es la nota de la tarea numero 1",
      "people_going":[
        {
          "id":3,
          "name":"Persona 3"
        }
      ],
      "people_not_going":[]
    },
    {
      "id":140,
      "created_at":"2016-11-21T09:02:40+00:00",
      "title":"Tarea numero 2",
      "status":0,
      "from_date":"2020-11-12T13:00:00+00:00",
      "to_date":null,
      "required_people":2,
      "categories":[this.categories[0]],
      "note":null,
      "people_going":[
        {
          "id":3,
          "name":"Persona 3"
        }
      ],
      "people_not_going":[]
    },
    {
      "id":139,
      "created_at":"2016-11-21T09:02:40+00:00",
      "title":"Tarea numero 1",
      "status":0,
      "from_date":"2020-11-12T13:00:00+00:00",
      "to_date":null,
      "required_people":1,
      "categories":[this.categories[0]],
      "note":null,
      "people_going":[
        {
          "id":3,
          "name":"Persona 3"
        }
      ],
      "people_not_going":[]
    }
  ];


  constructor(){
    this.tasks = this.instanciatedTasks(this.json);
  }

  instanciatedTasks(json): Task[]{
    let tasks = []
    for(let object in json){
      tasks.push(this.instanciatedTask(json[object]))
    }
    return tasks
  }

  instanciatedTask(object): Task{
    let task = new Task();
    for(let param in object){
      task[param] = object[param]
    }
    return task
  }

  getFutureTasks(): Observable<Task[]> {
    return Observable.of(this.tasks);
  }

  getPastTasks(): Observable<Task[]> {
    return Observable.of(this.tasks);
  }

  getCategories(): Observable<Category[]> {
    return Observable.of(this.categories);
  }


  createTask(body: Object): Observable<Task> {
    return Observable.of(this.tasks[0])
  }

  going(task_id, person_id): Observable<Task> {
    let task = this.tasks[0];
    task.people_going.push({
      "id":1,
      "name":"Persona 1"
    });
    return Observable.of(task)
  }

  notGoing(task_id, person_id): Observable<Task> {
    let task = this.tasks[1];
    task.people_not_going.push({
      "id":1,
      "name":"Persona 1"
    });
    return Observable.of(task)
  }
}

