import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PersonService } from '../../providers/person.service';

@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html'
})
export class ResetPassword {

  email: string = ""

  constructor(public navCtrl: NavController, public personService: PersonService) {}

  sendResetLink() {
    this.personService.resetPassword(this.email).subscribe(
      data => this.navCtrl.pop(),
      err => console.log(err)
    )
  }

}
