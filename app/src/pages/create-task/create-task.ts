import { Component } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'create-task',
  templateUrl: './create-task.html'
})

export class CreateTask {

  constructor(public toastCtrl: ToastController) { }

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
