import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'create-task',
  templateUrl: 'create-task.html'
})

export class CreateTask {
  public today: any = new Date();

  constructor(public navCtrl: NavController) {}
}
