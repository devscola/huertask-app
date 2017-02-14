import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { PersonService } from '../../providers/person.service';

@Component({
  selector: 'page-join-community',
  templateUrl: 'join-community.html'
})
export class JoinCommunity {
  invitations;

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public personService: PersonService) {
    this.invitations = this.personService.person['invitations']
    console.log(this.personService.person['invitations'])
  }

  joinCommunity(invitation){
    this.personService.joinCommunity(invitation).subscribe(community => {
      this.presentToast('Te has unido!', 'success')
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
