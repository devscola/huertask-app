import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the SettingsHelp page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-settings-help',
  templateUrl: 'settings-help.html'
})
export class SettingsHelp {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello SettingsHelp Page');
  }

}
