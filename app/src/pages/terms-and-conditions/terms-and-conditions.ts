import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the TermsAndConditions page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-terms-and-conditions',
  templateUrl: 'terms-and-conditions.html'
})
export class TermsAndConditions {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello TermsAndConditions Page');
  }

}
