import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { PersonService } from '../../providers/person.service';
import { Tasks } from '../tasks/tasks';
import { InvitationForm } from '../invitation-form/invitation-form';

@Component({
  selector: 'page-simple-invitation-form',
  templateUrl: 'simple-invitation-form.html'
})
export class SimpleInvitationForm {
  form;
  submited = false;

  constructor(
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public personService: PersonService,
    public formBuilder: FormBuilder
  ) {
    var emailRegex =  '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$'
    this.form = this.formBuilder.group({
      email: ["", Validators.compose([
         Validators.required,
         Validators.pattern(emailRegex)])],
      admin: [null]
    });
  }

  hasValidationError(property){
    return !this.form.controls[property].valid && this.submited
  }

  hasThisError(property, error){
    return this.form.controls[property].hasError(error)
  }

  submit(){
    this.submited = true;
    let invitation = this.form.value
    if ( !this.form.value.admin)
    {
        this.form.patchValue({ admin: false });
    }
    let invitations = {}
    if(invitation.admin){
      invitations["admin_users"] = [invitation['email']]
      invitations["simple_users"] = []
    }
    else{
      invitations["simple_users"] = [invitation['email']]
      invitations["admin_users"] = []
    }
    this.personService.invitePeople(invitations).subscribe( data => {
        this.presentToast('Persona invitada', 'success')
        this.navCtrl.setRoot(Tasks);
      },
      err => this.presentToast('Ha habido un error', 'danger')
    )
  }

  goToInvitations(){
    this.navCtrl.setRoot(InvitationForm)
  }

  presentToast(message: string, cssClass: string = '') {
    let toast = this.toastCtrl.create({
     message: message,
     duration: 3000,
     position: 'bottom',
     cssClass: cssClass
    });

    toast.present();
  }
}
