import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TaskService } from '../../providers/task.service';

@Component({
  selector: 'page-edit-task',
  templateUrl: 'edit-task.html'
})
export class EditTask {
  action;
  constructor(public navCtrl: NavController, public taskService: TaskService) {
    this.action = 'edit';
    console.log(this.action);
    console.log(this.action === 'edit')
  }

  ionViewDidLoad() {
    console.log('Hello EditTask Page');
  }
}
