import { Component } from '@angular/core';
import { NavController, ToastController, PopoverController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Community } from '../../models/community';
import { PersonService } from '../../providers/person.service';
import { Tasks } from '../tasks/tasks';
import { CommunityModal } from '../community-modal/community-modal';

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
    public popoverCtrl: PopoverController,
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
      this.personService.createCommunity(community).subscribe( data => {
        this.presentPopover();
      },
      err => this.presentToast('Ha habido un error', 'danger')
    )
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
