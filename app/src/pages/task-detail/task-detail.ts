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

  isUserConfirmed(): boolean {
    return !!this.task.positive_replies.find(person => person.id == 1)
  }
}
