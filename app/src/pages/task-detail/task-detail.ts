import { Component } from '@angular/core';
import { Task } from '../../models/task';
import { TaskService } from '../../providers/task.service';

import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';

@Component({
  selector: 'task-detail',
  templateUrl: 'task-detail.html'
})

export class TaskDetail {
  task = new Task();
  constructor(private navParams: NavParams, public taskService: TaskService) {
    this.task = navParams.get('task');
  }

  getCategoryName(id){
    return this.taskService.getCategory(id).name;
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

  isUserGoing(): boolean {
    return !!this.task.people_going.find(person => person.id == 1)
  }

  isUserNotGoing(): boolean {
    return !!this.task.people_not_going.find(person => person.id == 1)
  }
}
