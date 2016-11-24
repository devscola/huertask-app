import { Component } from '@angular/core';
import { NavParams, NavController, ToastController } from 'ionic-angular';
import { TaskService } from '../../providers/task.service';
import { Task } from '../../models/task';
import { Tasks } from '../tasks/tasks';

@Component({
  selector: 'create-task',
  templateUrl: 'create-task.html'
})

export class CreateTask {
  task;
  categories;
  edit = false;
  submited = false;
  constructor(public navParams: NavParams, public navCtrl: NavController, public toastCtrl: ToastController, private taskService: TaskService) {
    this.categories = taskService.categories
    if(navParams.get('task')){
      this.task = navParams.get('task')
      this.edit = true
    }else{
      this.task = new Task()
    }
  }

  onSubmit(){
    this.submited = true
  }

  createTask(task: Object){
    this.taskService.createTask(task).subscribe( data => {
      return data
    },
    err => console.log(err)
    )
    this.navCtrl.setRoot(Tasks);
  }

  editTask(task: Object){
    this.taskService.editTask(task).subscribe( data => {
      return data
    },
    err => console.log(err)
    )
    this.navCtrl.setRoot(Tasks);
  }


  presentToast(message: string, cssClass: string = '') {
    let toast = this.toastCtrl.create({
     message: message,
     duration: 3000,
     position: 'bottom',
     cssClass: cssClass
    });

    toast.present();
  }
}
