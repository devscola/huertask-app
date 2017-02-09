import { Component, ElementRef } from '@angular/core';
import { NavController, ViewController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { Category } from '../../models/category';
import { PersonService } from '../../providers/person.service';
import { FavCategories } from '../fav-categories/fav-categories';

@Component({
  selector: 'plot-form',
  templateUrl: './plot-form.html'
})
export class PlotForm {

  plot;
  form;
  submited = false;
  title = 'PLOT.EDIT.TITLE'
  people;
  list;
  showList = false;

  constructor(
    public el: ElementRef,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    private navParams: NavParams,
    public formBuilder: FormBuilder,
    public personService: PersonService,
    public translate: TranslateService,
    public toastCtrl: ToastController
  ) {
    this.plot = navParams.get('plot');
    this.form = this.generateForm(this.plot);
    personService.getCommunity(personService.communityId).subscribe(community => {
      this.people = community['joined']
      this.list = community['joined']
    })
  }

  generateForm(plot){
    return this.formBuilder.group({
      name: [plot.name, Validators.compose([
        Validators.required,
        Validators.maxLength(35)
      ])],
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
    let plot = this.form.value;
    plot = this.personService.instanciatedPlot(plot)
    plot['id'] = this.plot.id;
    /*this.personService.editPlot(plot).subscribe( data => {
      this.viewCtrl.dismiss();
    },
    err => this.presentToast('Ha habido un error', 'danger')
    )*/
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
  }

  unselectPerson(){
    this.form.patchValue({person: null})
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
