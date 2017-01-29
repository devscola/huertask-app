import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'page-points-settings',
  templateUrl: 'points-settings.html'
})
export class PointsSettings {
  settings;
  monthsQty = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];


  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    private translate: TranslateService
  ) {
    this.settings = {
      'taskPoints' : {
        'active' : true,
        'months' : 4
      },
      'personPoints' : {
        'active' : false,
        'amount' : 3,
        'reload' : 1,
        'months' : 4
      }
    }
  }

  showAlert(category, property) {
    let translation = ('points.' + category + '.' + property + '.alert').toUpperCase();
    this.translate.get(translation).subscribe((res: Object) => {
      this.doRadio(res, category, property)
    });
  }

  doRadio(messages: Object, category, property) {
    let alert = this.alertCtrl.create();
    alert.setTitle(messages['TITLE']);
    alert.setSubTitle(messages['SUBTITLE']);

    for(let i in this.monthsQty){
      alert.addInput({
        type: 'radio',
        label: i,
        value: i,
        checked: i == this.settings[category][property]
      });
    }

    alert.addButton(messages['BUTTONS']['CANCEL']);
    alert.addButton({
      text: messages['BUTTONS']['SUBMIT'],
      handler: data => {
        console.log('Radio data:', data);
        this.settings[category][property] = data
      }
    });

    alert.present().then(() => {
    });
  }

}
