import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    // TODO send data to API via service
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
