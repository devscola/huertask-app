import { Component } from '@angular/core';
import { Task } from '../../models/task';
import { TaskService } from '../../providers/task.service';
import { EditTask } from '../edit-task/edit-task';

import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';

@Component({
  selector: 'task-detail',
  templateUrl: 'task-detail.html'
})

export class TaskDetail {
  task = new Task();
  constructor(public navCtrl: NavController, private navParams: NavParams, public taskService: TaskService) {
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

  goToEditTask(){
    this.navCtrl.push(EditTask, {task: this.task});
  }

  isUserConfirmedPositive(): boolean {
    return !!this.task.people_going.find(person => person.id == 1)
  }

  isUserConfirmedNegative(): boolean {
    return !!this.task.people_not_going.find(person => person.id == 1)
  }
}
