import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { NavController } from 'ionic-angular';

import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { Tasks } from '../tasks/tasks';

import { Task }    from '../../models/task';

@Component({
  selector: 'create-task',
  templateUrl: 'create-task.html'
})

export class CreateTask {
  public today: any = new Date();
  public categories = [
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
  task = new Task();
  submited = false;
  constructor(public navCtrl: NavController, public http: Http) {}

  onSubmit(){
    this.submited = true
  }

  newTask(body: Object): Observable<Task[]> {
    let headers    = new Headers({ 'Content-Type': 'application/json' });
    let options    = new RequestOptions({ headers: headers });

    return this.http.post("http://huertask-dev.herokuapp.com/api/tasks/", body, options)
                    .map((res:Response) => <Task[]>res.json())
                    .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  createTask(task: Object){
    this.newTask(task).subscribe( data => {
      console.log(data);
      return data
    },
    err => console.log(err)
    )
    this.navCtrl.setRoot(Tasks);
  }


}
