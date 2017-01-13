import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { PersonService } from '../../providers/person.service';
import { Tasks } from '../tasks/tasks';

@Component({
  selector: 'page-invitation-form',
  templateUrl: 'invitation-form.html'
})
export class InvitationForm {
  form;
  submited = false;

  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public personService: PersonService,
    public toastCtrl: ToastController
  ) {
    this.form = this.generateForm();
  }

  generateForm(){
    return this.formBuilder.group({
      simple_users: [""],
      admin_users: [""],
    });
  }

  submit(){
    this.submited = true;
    let invitations = this.form.value;
    invitations = {
      "simple_users": invitations['simple_users'].replace(/ /g,'').split(','),
      "admin_users": invitations['admin_users'].replace(/ /g,'').split(',')
    }
    this.personService.invitePeople(invitations).subscribe( data => {
        this.presentToast('Personas invitadas', 'success')
        this.navCtrl.setRoot(Tasks);
      },
      err => this.presentToast('Ha habido un error', 'danger')
    )
  }

  presentToast(message: string, cssClass: string = '') {
    let toast = this.toastCtrl.create({
     message: message,
     duration: 5000,
     position: 'bottom',
     cssClass: cssClass
    });

    toast.present();
  }

}
