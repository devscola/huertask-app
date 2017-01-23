import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-join-community',
  templateUrl: 'join-community.html'
})
export class JoinCommunity {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello JoinCommunity Page');
  }

}
