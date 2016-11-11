import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TaskService } from '../../providers/task.service';
import { Task } from '../../models/task';
import { Tasks } from '../tasks/tasks';

@Component({
  selector: 'create-task',
  templateUrl: 'create-task.html'
})

export class CreateTask {
  today: any = new Date();
  task = new Task();
  categories;
  submited = false;
  constructor(public navCtrl: NavController, private taskService: TaskService) {
    this.categories = taskService.categories
  }

  onSubmit(){
    this.submited = true
  }

  createTask(task: Object){
    this.taskService.createTask(task).subscribe( data => {
      console.log(data);
      return data
    },
    err => console.log(err)
    )
    this.navCtrl.setRoot(Tasks);
  }
}
