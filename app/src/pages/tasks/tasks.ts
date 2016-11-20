import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TaskService } from '../../providers/task.service';
import { Task } from '../../models/task';
import { CreateTask } from '../create-task/create-task';

@Component({
  selector: 'tasks',
  templateUrl: 'tasks.html'
})
export class Tasks {
  list: Task[];
  pastTasks: Task[];
  tasks: Task[];

  tabs = [
    {title: "TASKS.NEXT", active: true},
    {title: "TASKS.OWN", active: false},
    {title: "TASKS.PREVIOUS", active: false}
  ]

	constructor(public navCtrl: NavController, private taskService: TaskService) {
    taskService.getFutureTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.list = tasks;
    });

    taskService.getPastTasks().subscribe(tasks => {
      this.pastTasks = tasks;
    });
	}

  peopleMessage(task){
    switch (task.people) {
       case 0:
         return "TASK.PEOPLE_LEFT.MSG.ZERO";
       case 1:
         return "TASK.PEOPLE_LEFT.MSG.ONE";
       default:
         return "TASK.PEOPLE_LEFT.MSG.PLURAL";
    }
  }

  fromDateMessage(task){
    return task.from_date.substring(0, 10)
  }

  goToCreateTask(){
    this.navCtrl.push(CreateTask);
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
