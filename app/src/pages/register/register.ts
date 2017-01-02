import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TermsAndConditions } from '../terms-and-conditions/terms-and-conditions';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class Register {

  form;
  submited = false;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public formBuilder: FormBuilder
  ) {
    var emailRegex =  '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$'
    this.form = this.formBuilder.group({
      name: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(100)
      ])],
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern(emailRegex)
      ])],
      password: ['', Validators.required],
      password2: ['', Validators.required],
      terms: [null, Validators.required]
    }, {validator: this.matchingPasswords('password', 'password2')});
  }

  matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey];
      let passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({notEquivalent: true})
      }
    }
  }

  goToTermsAndConditions(){
    let termsModal = this.modalCtrl.create(TermsAndConditions);
    termsModal.present();
  }

  hasValidationError(property){
    return !this.form.controls[property].valid && this.submited
  }

  hasThisError(property, error){
    return this.form.controls[property].hasError(error)
  }

  submit(){
    this.submited = true;
    if ( !this.form.value.terms)
    {
        this.form.patchValue({ terms: null });
    }
  }

}
