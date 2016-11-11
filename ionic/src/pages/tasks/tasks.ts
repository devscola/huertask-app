import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { CreateTask } from '../create-task/create-task';

interface Task {
	title: string,
	date: string,
	category: string,
	people_left: number
};

@Component({
  selector: 'tasks',
  templateUrl: 'tasks.html'
})
export class Tasks {

  list: Task[];
  pastTasks: Task[];
  tasks: Task[];

  messageMapping: {[k:string]: string} = {
    '=0': 'ZERO',
    '=1': 'ONE',
    'other': 'PLURAL'
  }

  tabs = [
    {title: "TASKS.NEXT", active: true},
    {title: "TASKS.OWN", active: false},
    {title: "TASKS.PREVIOUS", active: false}
  ]

	constructor(public navCtrl: NavController, public http: Http) {
    this.getFutureTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.list = tasks;
    });

    this.getPastTasks().subscribe(tasks => {
      this.pastTasks = tasks;
    });
	}

  goToCreateTask(){
    console.log('he entrado');
    this.navCtrl.push(CreateTask);
  }

  getFutureTasks(): Observable<Task[]> {
    return this.http.get("http://huertask-dev.herokuapp.com/api/tasks/")
      .map(res => <Task[]>res.json());
  }

  getPastTasks(): Observable<Task[]> {
    return this.http.get("http://huertask-dev.herokuapp.com/api/tasks/?filter=past")
      .map(res => <Task[]>res.json());
  }

  showTasks(tabTitle){
    if(tabTitle === "TASKS.NEXT"){ this.list = this.tasks }
    if(tabTitle === "TASKS.PREVIOUS"){ this.list = this.pastTasks }
  }

  selectTab(tabTitle) {
    this.tabs.forEach((tab) => {
      tab.active = false;
      if(tabTitle === tab.title) { tab.active = true };
    });
    this.showTasks(tabTitle)
  }
}
