import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonService } from '../../providers/person.service';
import { Tasks } from '../tasks/tasks';

@Component({
  selector: 'log-in',
  templateUrl: './log-in.html'
})

export class LogIn {
  form;

  constructor(
   public toastCtrl: ToastController,
   public navCtrl: NavController,
   public formBuilder: FormBuilder,
   public personService: PersonService
  ){
    this.form = this.formBuilder.group({
      email: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  logIn(){
    let person = this.form.value

    this.personService.logIn(person).subscribe(person => {
      console.log(person)
      this.presentToast(("Hola " + person.name), "success")
      this.navCtrl.setRoot(Tasks)
    }, err => {
      this.presentToast("incorrecto", "danger")
      console.log(err)
    })

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
