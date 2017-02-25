import { Component } from '@angular/core';
import { NavController, ToastController, ModalController } from 'ionic-angular';
import { Splashscreen } from 'ionic-native';
import { PersonService } from '../../providers/person.service';
import { InvitationsHelp } from '../invitations-help/invitations-help';
import { CommunityForm } from '../community-form/community-form';

@Component({
  selector: 'page-join-community',
  templateUrl: 'join-community.html'
})
export class JoinCommunity {
  invitations;

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public modalCtrl: ModalController,
              public personService: PersonService) {
    this.invitations = this.personService.person['invitations']
  }

  showModal(){
    let modal = this.modalCtrl.create(InvitationsHelp);
    modal.present();
  }

  goToCreateCommunity(){
    this.navCtrl.setRoot(CommunityForm)
  }

  joinCommunity(invitation){
    this.personService.joinCommunity(invitation).subscribe(community => {
      this.presentToast('Te has unido!', 'success')
      Splashscreen.show();
      window.location.reload()
    })
  }

  presentToast(message: string, cssClass: string = '') {
    let toast = this.toastCtrl.create({
     message: message,
     duration: 2000,
     position: 'bottom',
     cssClass: cssClass
    });

    toast.present();
  }
}
