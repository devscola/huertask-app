import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the ResetPassword page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html'
})
export class ResetPassword {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello ResetPassword Page');
  }

  sendResetLink() {

  }

}
