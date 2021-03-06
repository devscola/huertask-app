import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { PersonService } from '../../providers/person.service';
import { Tasks } from '../tasks/tasks';
import { ResetPassword } from '../reset-password/reset-password';
import { Register } from '../register/register';
import { JoinCommunity } from '../join-community/join-community';

@Component({
  selector: 'log-in',
  templateUrl: './log-in.html'
})

export class LogIn {
  form;
  submited = false;

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
      password: ["", Validators.required]
    });
  }

  logIn(){
    this.submited = true;
    let person = this.form.value

    if (this.form.valid){
      this.personService.logIn(person).subscribe(person => {
          this.personService.setPerson(person)
          this.personService.setDefaultCommunity().then(community =>{
            this.personService.events.publish('user:login')
            this.presentToast(("Hola " + person.name), "success")
            if(person['invitations'].length > 0 || person['communities'].length < 1){
              this.navCtrl.setRoot(JoinCommunity)
            }else{
              this.navCtrl.setRoot(Tasks)
            }
          })
      }, err => {
        this.presentToast("incorrecto", "danger")
        console.log(err)
      })
    }
  }

  goToRegister(){
    this.navCtrl.setRoot(Register)
  }

  goToResetPassword(){
    this.navCtrl.push(ResetPassword)
  }

  hasValidationError(property){
    return !this.form.controls[property].valid && this.submited
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
