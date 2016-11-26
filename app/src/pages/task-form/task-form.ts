import { Component, ElementRef } from '@angular/core';
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
  categories;
  action;

  constructor(public el: ElementRef, public navCtrl: NavController, private navParams: NavParams, public taskService: TaskService) {
    this.categories = taskService.categories;
    this.action = el.nativeElement.getAttribute('form-action');
    if(this.action == 'edit'){
      this.task = navParams.get('task');
    }else{
      this.task = new Task();
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
