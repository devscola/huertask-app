import { Component } from '@angular/core';
import { NavController, PopoverController } from 'ionic-angular';
import { PersonService } from '../../providers/person.service';
import { Person } from '../../models/person';
import { SimpleInvitationForm } from '../simple-invitation-form/simple-invitation-form';
import { QuickPeopleMenu } from './quick-people-menu'

@Component({
  selector: 'people',
  templateUrl: './people.html'
})
export class People {
  filteredList: Person[];
  list: Person[];
  joined: Person[];
  invited: Person[];
  searching = false;
  tabs = [
    {title: "PEOPLE.JOINED", active: true},
    {title: "PEOPLE.INVITED", active: false}
  ]

  constructor(
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    private personService: PersonService
  ) {
    personService.getCommunity().subscribe(community => {
      this.joined = community.joined;
      this.invited = community.invited;
      this.list = this.joined;
      this.filteredList = this.list
    });
  }

  showTasks(tabTitle){
    if(tabTitle === "PEOPLE.JOINED"){ this.list = this.joined }
    if(tabTitle === "PEOPLE.INVITED"){ this.list = this.invited }
    this.filteredList = this.list
  }

  selectTab(tabTitle) {
    this.tabs.forEach((tab) => {
      tab.active = false;
      if(tabTitle === tab.title) { tab.active = true };
    });
    this.showTasks(tabTitle)
  }

  presentPopover(event, person) {
    let popover = this.popoverCtrl.create(QuickPeopleMenu, {person: person});
    popover.present({
      ev: event
    });
  }

  search(){
    this.searching = true
  }

  getItems(ev) {
    this.filteredList = this.list
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.filteredList = this.list.filter((item) => {
        return (item.email.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  onClear(ev) {
   this.filteredList = this.list;
   this.searching = false;
   ev.target.value = '';
  }

  goToInvitePerson(){
    this.navCtrl.push(SimpleInvitationForm);
  }
}
