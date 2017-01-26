import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import { PersonService } from '../../providers/person.service';

@Component({
  selector: 'quick-people-menu',
  template: `
    <ion-list>
      <button ion-item>Marcar como cordinador</button>
      <button ion-item>{{ 'BUTTONS.DELETE' | translate }}</button>
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

}
