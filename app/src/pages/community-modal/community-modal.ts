import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { InvitationForm } from '../invitation-form/invitation-form';
import { Tasks } from '../tasks/tasks';

@Component({
  selector: 'community-modal',
  templateUrl: 'community-modal.html'
})
export class CommunityModal {

  constructor(public navCtrl: NavController) {}

  goToInvitationForm(){
    this.navCtrl.push(InvitationForm);
  }

  goToTasks(){
    this.navCtrl.setRoot(Tasks);

  }

}
