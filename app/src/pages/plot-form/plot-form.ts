import { Component, ElementRef } from '@angular/core';
import { NavController, ViewController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { Plot } from '../../models/plot';
import { PersonService } from '../../providers/person.service';
import { People } from '../people/people';
import { InvitationForm } from '../invitation-form/invitation-form';

@Component({
  selector: 'plot-form',
  templateUrl: './plot-form.html'
})
export class PlotForm {

  plot;
  form;
  action = 'create';
  submited = false;
  title = 'PLOT.CREATE.TITLE';
  quantity = 1;
  people;
  list;
  showList = false;
  alertMessage = null;

  constructor(
    public el: ElementRef,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    private navParams: NavParams,
    public formBuilder: FormBuilder,
    public personService: PersonService,
    public translate: TranslateService,
    public toastCtrl: ToastController
  ) {
    this.plot = navParams.get('plot') || new Plot();
    if(navParams.get('plot')){
      this.title = 'PLOT.EDIT.TITLE';
      this.action = 'edit';
    }
    this.form = this.generateForm(this.plot);
    personService.getCommunity().subscribe(community => {
      this.people = community['joined']
      this.list = community['joined']
    })
  }

  generateForm(plot){
    return this.formBuilder.group({
      name: [plot.name || 'Parcela', Validators.compose([
        Validators.required,
        Validators.maxLength(35)
      ])],
      number: [plot.number || 1, Validators.required],
      quantity: [plot.quantity || 1, Validators.required],
      person: [plot.person]
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
    let form = this.form.controls
    let plot = {
      'id': this.plot.id,
      'name': form.name.value,
      'number': form.number.value,
      'quantity': form.quantity.value,
      'person_id': form.person.value && form.person.value.id || null
    }
    if (this.form.valid){
      if(this.action == 'edit'){
        this.personService.editPlot(plot).subscribe( data => {
          this.navCtrl.setRoot(People);
          this.presentToast('Se ha creado con exito', 'success')
        },
        err => this.presentToast('Ha habido un error', 'danger')
        )
      }else{
        if(plot.quantity != 1){ delete plot.person_id }
        this.personService.createPlot(plot).subscribe( data => {
          if(this.list.length < 1){
            this.presentConfirm()
          }
          this.navCtrl.setRoot(People, {'tab': 'PLOTS.TITLE'})
          this.presentToast('Se ha editado con exito', 'success')
        },
        err => this.presentToast('Ha habido un error', 'danger')
        )
      }
    }
  }

  goToInvitations(){
    this.navCtrl.setRoot(InvitationForm)
  }

  presentConfirm() {
    let messages;
    this.translate.get('PLOTS.CREATED_ALERT').subscribe((res: Object) => {
      messages = res
    });
    let alert = this.alertCtrl.create({
      title: messages['TITLE'],
      message: messages['MESSAGE'],
      buttons: [
        {
          text: messages['GO_TO_INVITATIONS'],
          handler: () => {
            this.goToInvitations()
          }
        }
      ]
    });
    alert.present();
  }

  plotsMessage(){
    switch (this.form.controls.quantity.value) {
       case 1:
         return "PLOT.FORM.MSG.ONE";
       default:
         return "PLOT.FORM.MSG.PLURAL";
    }
  }

  first_plot(){
    let form = this.form.controls;
    return form.name.value + ' ' + form.number.value;
  }

  last_plot(){
    let form = this.form.controls;
    let last_number = form.number.value * 1 + form.quantity.value * 1 - 1;
    return form.name.value + ' ' + last_number;
  }


  getItems(ev) {
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.showList = true
      this.list = this.people.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }else{
      this.showList = false
    }
  }

  onClear(ev){
    this.showList = false
  }

  selectPerson(person){
    this.showList = false
    this.form.patchValue({person: person})
    if(person.plot.id != null && person.plot.id != this.plot.id){
      this.alertMessage = 'PLOT.FORM.PERSON.ALREADY_ASSIGNED';
    }
  }

  unselectPerson(){
    this.form.patchValue({person: null})
    this.alertMessage = null;
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
