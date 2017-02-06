import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-points-help',
  templateUrl: 'points-help.html'
})
export class PointsHelp {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello PointsHelp Page');
  }

}
