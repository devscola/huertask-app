import { Component } from '@angular/core';
import { NavController, AlertController, ToastController, ModalController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import { PersonService } from '../../providers/person.service';
import { SettingsHelp } from '../settings-help/settings-help';

@Component({
  selector: 'page-points-settings',
  templateUrl: 'points-settings.html'
})
export class PointsSettings {
  community: any = {
    "task_points_enabled":false,
    "task_points_duration":'',
    "plot_points_enabled":false,
    "plot_points_duration":'',
    "person_points_enabled":false,
    "person_points_amount":'',
    "person_points_reload":'',
    "person_points_duration":''
  };
  monthsQty = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  messages = {
    task_points_duration: 'POINTS.TASKPOINTS.DURATION.ALERT',
    plot_points_duration: 'POINTS.PLOTPOINTS.DURATION.ALERT',
    person_points_amount: 'POINTS.PERSONPOINTS.AMOUNT.ALERT',
    person_points_reload: 'POINTS.PERSONPOINTS.RELOAD.ALERT',
    person_points_duration: 'POINTS.PERSONPOINTS.DURATION.ALERT'
  }


  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    private translate: TranslateService,
    private personService: PersonService
  ) {
    personService.getCommunity().subscribe(community => {
      this.community = community;
    });
  }

  showAlert(property) {
    let translation = this.messages[property];
    this.translate.get(translation).subscribe((res: Object) => {
      this.doRadio(res, property)
    });
  }

  showModal(){
    let modal = this.modalCtrl.create(SettingsHelp);
    modal.present();
  }

  doRadio(messages: Object, property) {
    let alert = this.alertCtrl.create();
    alert.setTitle(messages['TITLE']);
    alert.setSubTitle(messages['SUBTITLE']);

    for(let i of this.monthsQty){
      alert.addInput({
        type: 'radio',
        label: String(i),
        value: String(i),
        checked: i == this.community[property]
      });
    }

    alert.addButton(messages['BUTTONS']['CANCEL']);
    alert.addButton({
      text: messages['BUTTONS']['SUBMIT'],
      handler: data => {
        this.editCommunity({[property] : data})
      }
    });

    alert.present().then(() => {
    });
  }

  presentToast(message: string, cssClass: string = '') {
    let toast = this.toastCtrl.create({
     message: message,
     duration: 2000,
     position: 'bottom',
     cssClass: cssClass
    });

    toast.present();
  }

  toggle(property){
    this.editCommunity({[property]: this.community[property]})
  }

  editCommunity(community: Object){
    this.personService.editCommunity(community).subscribe(
      data => {this.community = data},
      err => this.presentToast('Ha habido un error', 'danger')
    )
  }

}
