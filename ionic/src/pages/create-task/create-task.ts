import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { Task }    from '../../models/task';

@Component({
  selector: 'create-task',
  templateUrl: 'create-task.html'
})

export class CreateTask {
  public today: any = new Date();
  task = new Task();
  submited = false;
  constructor(public navCtrl: NavController, public http: Http) {}

  onSubmit(){
    this.submited = true
  }

  newTask(body: Object): Observable<Task[]> {
    this.task.date = "2016-12-19 00:00:00"
    let headers    = new Headers({ 'Content-Type': 'application/json' });
    let options    = new RequestOptions({ headers: headers });

    return this.http.post("http://huertask-dev.herokuapp.com/api/tasks/", body, options)
                    .map((res:Response) => <Task[]>res.json())
                    .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  createTask(task: Object){
    this.newTask(task).subscribe( data => {
      return data;
    })
  }


}
