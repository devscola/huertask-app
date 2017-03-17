import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { PersonService } from '../../providers/person.service';
import { PointsHelp } from '../points-help/points-help';

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

  userpointsRechargeDate;
  userpointsLeft;

  tabs = [
    {title: "POINTS.RESUME", active: true},
    {title: "POINTS.DONATE", active: false}
  ]

  plotpointsValues = {0: 0, 1: -2, 2: 0, 3: 2};

  constructor(
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public params: NavParams,
    private personService: PersonService,
    public formBuilder: FormBuilder
  ) {
    personService.getPoints().subscribe(points => {
      points["userpoints"]["qty"] = points["userpoints"]["list"].length;
      points["plotpoints"]["qty"] = this.plotpointsScore(points["plotpoints"]["list"]);
      points["taskpoints"]["qty"] = points["taskpoints"]["list"].length;
      this.userpointsLeft = points["userpoints"]["available"];
      this.points = points;
    });
    personService.getCommunity().subscribe(community => {
      this.people = community['joined']
      this.list = community['joined']
      this.userpointsRechargeDate = community['next_reload']
    })
    this.form = this.generateForm();

    if (this.params.get('tab')){
      this.selectTab(this.params.get('tab'));
    }
  }

  totalPoints(){
    let total = 0;
    for(let type in this.points){
      total += this.points[type]['qty'];
    }
    return total;
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

  plotpointsScore(list){
    if (list.length<1) return 0;
    let score = 0;
    list.forEach((revision) => {
      score += this.plotpointsValues[revision.status]
    })
    return score;
  }

  userpointsLeftMessage = () => {
    switch (this.userpointsLeft) {
       case 0:
         return "USERPOINTS.LEFT.MSG.ZERO";
       case 1:
         return "USERPOINTS.LEFT.MSG.ONE";
       default:
         return "USERPOINTS.LEFT.MSG.PLURAL";
    }
  }

  submit(){
    this.submited = true;
    if (this.form.valid && this.sendPointTo){
      let point = {"receiver_id": this.sendPointTo['id'],
                   "sender_id": this.personService.person['id'],
                   "description": this.form.value['description']}
      this.sendPoint(point)
    }
  }

  sendPoint(point){
    this.personService.sendPoint(point).subscribe(res => {
      this.presentToast("medalla enviada", "success")
      this.selectTab("POINTS.RESUME")
      this.navCtrl.setRoot(Points);
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

  emptySelectedPerson(){
    return this.submited && !this.sendPointTo
  }

  showModal(){
    let modal = this.modalCtrl.create(PointsHelp);
    modal.present();
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
