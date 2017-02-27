import { Component } from '@angular/core';
import { NavController, ModalController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TermsAndConditions } from '../terms-and-conditions/terms-and-conditions';
import { PersonService } from '../../providers/person.service';
import { LogIn } from '../log-in/log-in';
import { Tasks } from '../tasks/tasks';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class Register {

  form;
  submited = false;

  constructor(
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public personService: PersonService,
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
      password_confirmation: ['', Validators.required],
      terms: [null, Validators.required]
    }, {validator: this.matchingPasswords('password', 'password_confirmation')});
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

  goToLogIn(){
    this.navCtrl.setRoot(LogIn)
  }

  hasValidationError(property){
    return !this.form.controls[property].valid && this.submited
  }

  hasThisError(property, error){
    return this.form.controls[property].hasError(error)
  }

  submit(){
    this.submited = true;
    let person = this.form.value
    if ( !this.form.value.terms)
    {
        this.form.patchValue({ terms: null });
    }
    if (this.form.valid){
      this.personService.signUp(person).subscribe(person => {
        this.personService.person = person
        this.presentToast(("Hola " + person.name), "success")
        this.navCtrl.setRoot(Tasks)
      }, err => {
        console.log(person)
      })
    }
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
