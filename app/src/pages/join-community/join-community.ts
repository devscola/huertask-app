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

  constructor(public navCtrl: NavController, public personService: PersonService) {
    // this.communities = this.personService.person['communities'].map((community) => {
    //   console.log(community)
    //   return this.getCommunity(community['community_id'])
    // })
    console.log(this.personService.person['communities'][0])
    this.invitations = this.personService.person['invitations']
    console.log(this.communities)
  }

  getCommunity(id){
    this.personService.getCommunity(id).subscribe(
      community => {return community},
      err => console.log(err)
    )
  }
}
