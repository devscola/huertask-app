import { Component } from '@angular/core';
import { Task } from '../../models/task';
import { Tasks } from '../tasks/tasks';
import { TaskService } from '../../providers/task.service';
import { EditTask } from '../edit-task/edit-task';
import { DuplicateTask } from '../duplicate-task/duplicate-task';

import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';

@Component({
  selector: 'task-detail',
  templateUrl: './task-detail.html'
})

export class TaskDetail {

  task = new Task();
  finalizeColor: string = 'dark'

  constructor(public navCtrl: NavController, private navParams: NavParams, public taskService: TaskService) {
    this.task = navParams.get('task');
    if(this.task.status == 1){
      this.finalizeColor = 'success'
    }
  }

  peopleLeft(task){
    let people_left = task.required_people - task.people_going.length;
    if (people_left < 0){ people_left = 0; }
    return people_left
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

  getCategoryName(id){
    return this.taskService.getCategory(id).name;
  }

  deleteTask(){
    return this.taskService.deleteTask(this.task.id).subscribe( data => {
      this.navCtrl.setRoot(Tasks);
    },
    err => console.log(err)
    )
  }

  going(){
    return this.taskService.going(this.task.id, 1).subscribe( data => {
      this.task = data
    },
    err => console.log(err)
    )
  }

  notGoing(){
    return this.taskService.notGoing(this.task.id, 1).subscribe( data => {
      this.task = data
    },
    err => console.log(err)
    )
  }

  markAsFinalized(task: Object){
    let status = 0
    if(task['status'] == status){
      status = 1;
      this.finalizeColor = 'success'
    }else{
      this.finalizeColor = 'dark'
    }
    task['status'] = status;
    return this.taskService.editTask(task).subscribe( data => {
      console.log(data)
    },
    err => console.log(err)
    )
  }

  goToEditTask(){
    this.navCtrl.push(EditTask, {task: this.task});
  }

  goToDuplicateTask(){
    this.navCtrl.push(DuplicateTask, {task: this.task});
  }

  isCovered(): boolean {
    return (this.task.required_people - this.task.people_going.length) == 0
  }

  isUserGoing(): boolean {
    return !!this.task.people_going.find(person => person.id == 1)
  }

  isUserNotGoing(): boolean {
    return !!this.task.people_not_going.find(person => person.id == 1)
  }
}
