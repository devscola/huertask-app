import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PersonService } from '../../providers/person.service';

@Component({
  selector: 'page-points',
  templateUrl: 'points.html',
})
export class Points {
  list: any[];

  tabs = [
    {title: "POINTS.RESUME", active: true},
    {title: "POINTS.DONATE", active: false}
  ]

  constructor(public navCtrl: NavController, private personService: PersonService) {
    this.list = [{type: "taskPoints", points: 4}, {type: "userPoints", points: 2}];
  }

  selectTab(tabTitle) {
    this.tabs.forEach((tab) => {
      tab.active = false;
      if(tabTitle === tab.title) { tab.active = true };
    });
  }
}
