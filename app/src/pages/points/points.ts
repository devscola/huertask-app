import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { PersonService } from '../../providers/person.service';

@Component({
  selector: 'page-points',
  templateUrl: 'points.html',
})
export class Points {
  form;
  submited = false;
  points;
  people;
  list;
  sendPointTo;
  showList = false;

  tabs = [
    {title: "POINTS.RESUME", active: true},
    {title: "POINTS.DONATE", active: false}
  ]

  constructor(
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    private personService: PersonService,
    public formBuilder: FormBuilder
  ) {
    personService.getPoints().subscribe(points => {
      points["userpoints"] = points["person_medals"]
      delete points["person_medals"]
      points["userpoints"]["qty"] = points["userpoints"].length;
      this.points = points;

    });
    personService.getCommunity(personService.communityId).subscribe(community => {
      this.people = community['joined']
      this.list = community['joined']
    })
    this.form = this.generateForm()
  }

  generateForm(){
    return this.formBuilder.group({
      description: ['', Validators.maxLength(200)],
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
    let point = {"receiver_id": this.sendPointTo['id'],
                 "sender_id": this.personService.person['id'],
                 "description": this.form.value['description']}
    this.sendPoint(point)
  }

  sendPoint(point){
    this.personService.sendPoint(point).subscribe(res => {
      this.presentToast("medalla enviada", "success")
      this.selectTab("POINTS.RESUME")
    }, err => {
      this.presentToast("medalla no enviada", "danger")
    })
  }

  selectTab(tabTitle) {
    this.tabs.forEach((tab) => {
      tab.active = false;
      if(tabTitle === tab.title) { tab.active = true };
    });
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
    this.sendPointTo = person
  }

  unselectPerson(){
    this.sendPointTo = null
  }

  presentToast(message: string, cssClass: string = '') {
    let toast = this.toastCtrl.create({
     message: message,
     duration: 3000,
     position: 'bottom',
     cssClass: cssClass
    });

    toast.present();
  }
}
