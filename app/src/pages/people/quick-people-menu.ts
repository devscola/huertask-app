import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import { PersonService } from '../../providers/person.service';

@Component({
  selector: 'quick-people-menu',
  template: `
    <ion-list>
      <button ion-item (click)="tryToggleAdmin(person)">Marcar como cordinador</button>
      <button ion-item (click)="tryDelete(person)">{{ 'BUTTONS.DELETE' | translate }}</button>
    </ion-list>
  `
})
export class QuickPeopleMenu {

  person;

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private translate: TranslateService,
    public personService: PersonService
  ) {
    this.person = this.navParams.data.person;
  }

  tryDelete(person){
    this.showConfirm(person);
    this.close();
  }

  showConfirm(person) {
    this.translate.get('PEOPLE.DELETE_CONFIRM').subscribe((res: Object) => {
      this.presentDeleteConfirm(res, person)
    });
  }

  presentDeleteConfirm(messages: Object, person) {
    let alert = this.alertCtrl.create({
      title: messages['TITLE'],
      message: messages['SUBTITLE'],
      buttons: [
        {
          text: messages['BUTTONS']['CANCEL'],
          role: 'cancel',
          handler: () => {
            alert.dismiss();
          }
        },
        {
          text: messages['BUTTONS']['DELETE'],
          handler: () => {
            this.deletePerson(person['id']);
            alert.dismiss();
          }
        }
      ]
    });
    alert.present();
  }

  deletePerson(person_id){
    this.personService.unjoinCommunity(person_id).subscribe(community => {
    })
  }

  tryToggleAdmin(person){
    this.showAdminConfirmation(person)
    this.close()
  }

  showAdminConfirmation(person) {
    this.translate.get('PEOPLE.TOGGLE_ADMIN_CONFIRM').subscribe((res: Object) => {
      this.presentAdminConfirm(res, person)
    });
  }

  presentAdminConfirm(messages: Object, person) {
    let alert = this.alertCtrl.create({
      title: messages['TITLE'],
      message: messages['SUBTITLE'],
      buttons: [
        {
          text: messages['BUTTONS']['CANCEL'],
          role: 'cancel',
          handler: () => {
            alert.dismiss();
          }
        },
        {
          text: messages['BUTTONS']['SUBMIT'],
          handler: () => {
            this.toggleAdmin(person['id']);
            alert.dismiss();
          }
        }
      ]
    });
    alert.present();
  }

  toggleAdmin(person_id){
    this.personService.toggleAdmin(person_id).subscribe(community => {
    })
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
