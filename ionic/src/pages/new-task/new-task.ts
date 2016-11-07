import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the NewTask page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-new-task',
  templateUrl: 'new-task.html'
})
export class NewTask {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello NewTask Page');
  }

}
