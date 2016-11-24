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

  participate(){
    return this.taskService.participate(this.task.id, 1).subscribe( data => {
      this.task = data
    },
    err => console.log(err)
    )
  }

  unparticipate(){
    return this.taskService.unparticipate(this.task.id, 1).subscribe( data => {
      this.task = data
    },
    err => console.log(err)
    )
  }

  isUserConfirmedPositive(): boolean {
    return !!this.task.people_going.find(person => person.id == 1)
  }

  isUserConfirmedNegative(): boolean {
    return !!this.task.people_not_going.find(person => person.id == 1)
  }
}
