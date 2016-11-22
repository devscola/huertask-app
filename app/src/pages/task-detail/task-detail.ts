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
    console.log(this.taskService.getCategory(id));
    return this.taskService.getCategory(id).name;
  }
}
