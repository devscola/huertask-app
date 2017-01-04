import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'page-fav-categories-menu',
  template: `
    <ion-list>
      <button ion-item (click)="close()">{{ 'BUTTONS.EDIT' | translate }}</button>
      <button ion-item (click)="showConfirm()">{{ 'BUTTONS.DELETE' | translate }}</button>
    </ion-list>
  `
})
export class FavCategoriesMenu {

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private translate: TranslateService
  ) {}

  showConfirm() {
    this.translate.get('CATEGORIES.DELETE_ALERT').subscribe((res: Object) => {
      this.presentConfirm(res)
    });
  }

  presentConfirm(messages: Object) {
    let alert = this.alertCtrl.create({
      title: messages['TITLE'],
      message: messages['SUBTITLE'],
      buttons: [
        {
          text: messages['BUTTONS']['CANCEL'],
          role: 'cancel',
          handler: () => {
            console.log('Cancela');
          }
        },
        {
          text: messages['BUTTONS']['DELETE'],
          handler: () => {
            console.log('Borra');
          }
        }
      ]
    });
    alert.present();
  }

}
