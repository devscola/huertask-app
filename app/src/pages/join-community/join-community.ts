import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PersonService } from '../../providers/person.service';

@Component({
  selector: 'page-join-community',
  templateUrl: 'join-community.html'
})
export class JoinCommunity {
  invitations;
  communities;
  invitation;
  constructor(public navCtrl: NavController, public personService: PersonService) {
    this.communities = this.personService.person['communities']
    this.invitations = this.personService.person['invitations'][0]
    if(this.invitations){
      this.getCommunity(this.invitation['community_id'])
    }
  }

  getCommunity(id){
    this.personService.getCommunity(id).subscribe(
      community => {this.invitation['community_name'] = community['name']},
      err => console.log(err)
    )
  }

  joinCommunity(){
    this.personService.joinCommunity(this.invitation).subscribe(community => {
      console.log(community);
    })
  }
}
