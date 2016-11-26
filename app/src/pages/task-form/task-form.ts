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
    }
    else if (this.action == 'create'){
      this.task = new Task();
    }
    else if (this.action == 'duplicate'){
      delete navParams.get('task')['id'];
      navParams.get('task')['from_date'] = '';
      this.task = navParams.get('task');
    }
  }

  submitTask(task: Object){
    if(this.action == 'edit'){
      this.editTask(task);
    }
    else if (this.action == 'create'){
      this.createTask(task);
    }
    else if (this.action == 'duplicate'){
      this.duplicateTask(task);
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

  duplicateTask(task: Object){
    console.log('duplicando')
  }

}
