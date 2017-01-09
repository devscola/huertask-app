import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonService } from '../../providers/person.service';
import { Tasks } from '../tasks/tasks';
import { Register } from '../register/register';

@Component({
  selector: 'log-in',
  templateUrl: './log-in.html'
})

export class LogIn {
  form;
  remember: boolean = false;

  constructor(
   public toastCtrl: ToastController,
   public navCtrl: NavController,
   public formBuilder: FormBuilder,
   public personService: PersonService
  ){
    var emailRegex =  '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$'
    this.form = this.formBuilder.group({
      email: ["", Validators.compose([
         Validators.required,
         Validators.pattern(emailRegex)])],
      password: ["", Validators.required],
      remember: [true]
    });
  }

  ionViewWillEnter(){
    this.checkIfLogged()
  }

  checkIfLogged(){
    this.personService.storage.get('person')
      .then(
        data => {
          if(data != null){
            this.navCtrl.setRoot(Tasks)
          }
        }
      )
  }

  logIn(){
    let person = this.form.value
    this.personService.logIn(person).subscribe(person => {
      this.personService.person = person
      if(this.form.value['remember']){
        this.personService.savePerson()
      }
      this.presentToast(("Hola " + person.name), "success")
      this.navCtrl.setRoot(Tasks)
    }, err => {
      this.presentToast("incorrecto", "danger")
      console.log(err)
    })
  }

  goToRegister(){
    this.navCtrl.setRoot(Register)
  }

  hasValidationError(property){
    return !this.form.controls[property].valid && this.personService.logged
  }

  hasThisError(property, error){
    return this.form.controls[property].hasError(error)
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
