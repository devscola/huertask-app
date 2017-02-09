import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import { PersonService } from '../../providers/person.service';
import { Plots } from './plots'


@Component({
  selector: 'quick-plots-menu',
  template: `
    <ion-list>
      <button ion-item (click)="edit(plot)">{{ 'BUTTONS.EDIT' | translate }}</button>
      <button ion-item (click)="tryDelete(plot)">{{ 'BUTTONS.DELETE' | translate }}</button>
    </ion-list>
  `
})
export class QuickPlotsMenu {

  plot;

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private translate: TranslateService,
    public personService: PersonService
  ) {
    this.plot = this.navParams.data.plot;
  }

  tryDelete(plot){
    this.showConfirm(plot);
    this.close();
  }

  edit(plot){
    // this.navCtrl.push();
  }

  showConfirm(plot) {
    this.translate.get('PLOT.DELETE_CONFIRM').subscribe((res: Object) => {
      this.presentDeleteConfirm(res, plot)
    });
  }

  presentDeleteConfirm(messages: Object, plot) {
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
            this.deletePlot(plot['id']);
            alert.dismiss();
          }
        }
      ]
    });
    alert.present();
  }

  deletePlot(plot_id){
    // this.personService.deletePlot(plot_id).subscribe(plots => {
    // })
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
