import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Task } from '../../models/task';
import { Tasks } from '../tasks/tasks';
import { TaskService } from '../../providers/task.service';

@Component({
  selector: 'task-form',
  templateUrl: 'task-form.html'
})
export class TaskForm {

  task;
  edit;
  categories;

  constructor(public navCtrl: NavController, private navParams: NavParams, public taskService: TaskService) {
    this.categories = taskService.categories;
    if(navParams.get('task')){
      this.task = navParams.get('task');
      this.edit = true
    }else{
      this.task = new Task();
      this.edit = false
    }
  }

  editTask(task: Object){
    this.taskService.editTask(task).subscribe( data => {
      this.navCtrl.setRoot(Tasks);
    },
    err => console.log(err)
    )
  }

  createTask(task: Object){
    this.taskService.createTask(task).subscribe( data => {
      this.navCtrl.setRoot(Tasks);
    },
    err => console.log(err)
    )
  }

}
