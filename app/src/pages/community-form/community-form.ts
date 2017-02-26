import { Component } from '@angular/core';
import { NavController, ToastController, PopoverController, AlertController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import { FormBuilder, Validators } from '@angular/forms';
import { Community } from '../../models/community';
import { PersonService } from '../../providers/person.service';
import { Tasks } from '../tasks/tasks';
import { PlotForm } from '../plot-form/plot-form';
import { CommunityModal } from '../community-modal/community-modal';
import { InvitationForm } from '../invitation-form/invitation-form';

@Component({
  selector: 'page-community-form',
  templateUrl: 'community-form.html'
})
export class CommunityForm {
  form;
  submited = false;

  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public personService: PersonService,
    public translate: TranslateService,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController
  ) {
    this.form = this.generateForm(new Community());
  }

  generateForm(community){
    return this.formBuilder.group({
      name: [community.name, Validators.compose([
        Validators.required,
        Validators.maxLength(100)
      ])],
      description: [community.description, Validators.maxLength(200)],
    });
  }

  hasValidationError(property){
    return !this.form.controls[property].valid && this.submited
  }

  hasThisError(property, error){
    return this.form.controls[property].hasError(error)
  }

  submit(){
    this.submited = true;
    let community = this.form.value;
    community = this.personService.instanciatedCommunity(community)
    this.personService.createCommunity(community).subscribe( community => {
      this.personService.setCommunity(community, community['joined'][0]['type'])
      this.presentConfirm()
    }, err => this.presentToast('Ha habido un error', 'danger'))
  }

  goToCreatePlots(){
    this.navCtrl.setRoot(PlotForm)
  }

  goToInvitations(){
    this.navCtrl.setRoot(InvitationForm)
  }

  presentConfirm() {
    let messages;
    this.translate.get('COMMUNITY.CREATED_ALERT').subscribe((res: Object) => {
      messages = res
    });
    let alert = this.alertCtrl.create({
      title: messages['TITLE'],
      message: messages['MESSAGE'],
      buttons: [
        {
          text: messages['CANCEL'],
          role: 'cancel',
          handler: () => {
            this.goToInvitations()
          }
        },
        {
          text: messages['OK'],
          handler: () => {
            this.goToCreatePlots()
          }
        }
      ]
    });
    alert.present();
  }

  presentPopover() {
    let popover = this.popoverCtrl.create(CommunityModal, {}, {cssClass: 'full', enableBackdropDismiss: false});
    popover.present();
  }

  presentToast(message: string, cssClass: string = '') {
    let toast = this.toastCtrl.create({
     message: message,
     duration: 5000,
     position: 'bottom',
     cssClass: cssClass
    });

    toast.present();
  }
}
