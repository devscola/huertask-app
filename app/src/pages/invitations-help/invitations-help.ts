import { Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import { CommunityForm } from '../community-form/community-form'

@Component({
  selector: 'page-invitations-help',
  templateUrl: 'invitations-help.html'
})
export class InvitationsHelp {

  constructor(public navCtrl: NavController, public appCtrl: App) {}

  goToInvitations(){
    this.navCtrl.pop()
  }

  goToCreateCommunity(){
    this.navCtrl.pop()
    this.appCtrl.getRootNav().setRoot(CommunityForm)
  }
}
