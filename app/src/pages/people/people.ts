import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PersonService } from '../../providers/person.service';
import { Person } from '../../models/person';

@Component({
  selector: 'people',
  templateUrl: './people.html'
})
export class People {
  list: Person[];
  joined: Person[];
  invited: Person[];

  tabs = [
    {title: "PEOPLE.JOINED", active: true},
    {title: "PEOPLE.INVITED", active: false}
  ]

  constructor(
    public navCtrl: NavController,
    private personService: PersonService
  ) {
    personService.getCommunity(personService.communityId).subscribe(community => {
      this.joined = community.joined;
      this.invited = community.invited;
      this.list = this.joined;
    });
  }

  showTasks(tabTitle){
    if(tabTitle === "PEOPLE.JOINED"){ this.list = this.joined }
    if(tabTitle === "PEOPLE.INVITED"){ this.list = this.invited }
  }

  selectTab(tabTitle) {
    this.tabs.forEach((tab) => {
      tab.active = false;
      if(tabTitle === tab.title) { tab.active = true };
    });
    this.showTasks(tabTitle)
  }

  goToInvitePerson(){
    console.log("Ir a la página de invitar a usuario");
  }
}
