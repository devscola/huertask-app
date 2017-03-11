import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TaskService } from '../../providers/task.service';
import { PersonService } from '../../providers/person.service';
import { Task } from '../../models/task';
import { CreateTask } from '../create-task/create-task';
import { TaskDetail } from '../task-detail/task-detail';

@Component({
  selector: 'tasks',
  templateUrl: './tasks.html'
})
export class Tasks {
  list: Task[];
  pastTasks: Task[];
  tasks: Task[];

  tabs = [
    {title: "TASKS.NEXT", active: true},
    {title: "TASKS.PREVIOUS", active: false}
  ]

	constructor(public navCtrl: NavController, private taskService: TaskService, private personService: PersonService) {
    this.loadTasksData()
	}

  ionViewWillEnter() {
    this.loadTasksData()
    this.selectTab("TASKS.NEXT")
  }

  loadTasksData(){
    let user_id = this.personService.person['id'];
    this.taskService.getFutureTasks(user_id).subscribe(tasks => {
      this.tasks = tasks;
      this.list = tasks;
    });

    this.taskService.getPastTasks(user_id).subscribe(tasks => {
      this.pastTasks = tasks;
    });
  }

  peopleLeft(task){
    let people_left = task.required_people - task.people_going.length;
    if (people_left < 0){ people_left = 0; }
    return people_left
  }

  isFinalized(task){
    return Date.parse(task['to_date']) < Date.now() && task['status'] == 0
  }

  peopleMessage(task){
    switch (this.peopleLeft(task)) {
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

  showTask(task){
    this.navCtrl.push(TaskDetail, {task: task});
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
