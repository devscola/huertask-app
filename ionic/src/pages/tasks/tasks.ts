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

  public list: Task[];
  tasks;

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
    this.load().subscribe(tasks => {
      this.tasks = tasks;
      this.list = tasks;
    });
    // this.sortByDate();
    // this.showFutureTasks();
	}

  goToCreateTask(){
    console.log('he entrado');
    this.navCtrl.push(CreateTask);
  }

  load(): Observable<Task[]> {
    return this.http.get("http://huertask-dev.herokuapp.com/api/tasks/")
      .map(res => <Task[]>res.json());
  }

	sortByDate(){
    this.list = this.tasks.sort(function(a,b){
			let date = Date.parse(a.date);
			let secondDate = Date.parse(b.date);
			return date - secondDate;
	  });
	}

	showFutureTasks(){
    let fromDate = Date.now();
		this.list = this.tasks.filter(function(task) { return Date.parse(task.date) >= fromDate });
	}

  showPastTasks(){
    let fromDate = Date.now();
    this.list = this.tasks.filter(function(task) { return Date.parse(task.date) <= fromDate });
  }

  showTasks(tabTitle){
    if(tabTitle === "Próximas"){ return this.showFutureTasks() }
    if(tabTitle === "Pasadas"){ this.showPastTasks() }
  }

  selectTab(tabTitle) {
    this.tabs.forEach((tab) => {
      tab.active = false;
      if(tabTitle === tab.title) { tab.active = true };
    });
    this.showTasks(tabTitle)
  }
}
