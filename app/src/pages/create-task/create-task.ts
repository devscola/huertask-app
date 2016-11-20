import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { TaskService } from '../../providers/task.service';
import { Task } from '../../models/task';
import { Tasks } from '../tasks/tasks';

@Component({
  selector: 'create-task',
  templateUrl: 'create-task.html'
})

export class CreateTask {
  task = new Task();
  categories;
  submited = false;
  constructor(public navCtrl: NavController, public toastCtrl: ToastController, private taskService: TaskService) {
    this.categories = taskService.categories
  }

  onSubmit(){
    this.submited = true
  }

  createTask(task: Object){
    this.taskService.createTask(task).subscribe( data => {
      console.log(data);
      if(data.id !== null){
        this.presentToast('¡Tarea guardada!', 'success')
      }else{
        this.presentToast('No se pudo guardar la tarea', 'danger')
      }
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
