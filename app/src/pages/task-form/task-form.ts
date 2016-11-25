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

  task = new Task();
  categories;
  constructor(public navCtrl: NavController, private navParams: NavParams, public taskService: TaskService) {
    this.categories = taskService.categories;
    this.task = navParams.get('task');
  }

  ionViewDidLoad() {
    console.log('Hello TaskForm Page');
  }

  editTask(task: Object){
    this.taskService.editTask(task).subscribe( data => {
      this.navCtrl.setRoot(Tasks);
    },
    err => console.log(err)
    )
  }

}
