import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { PersonService } from '../../providers/person.service';

@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html'
})
export class ResetPassword {

  email: string = ""

  constructor(public navCtrl: NavController, public personService: PersonService, public toastCtrl: ToastController) {}

  sendResetLink() {
    this.personService.resetPassword(this.email).subscribe(
      data => {
        this.presentToast('Contraseña cambiada, mira tu mail', 'success')
        this.navCtrl.pop()
      },
      err => {
        this.presentToast('Ha habido un error', 'success')
      }
    )
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
