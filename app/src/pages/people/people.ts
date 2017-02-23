import { Component } from '@angular/core';
import { NavController, PopoverController } from 'ionic-angular';
import { PersonService } from '../../providers/person.service';
import { Person } from '../../models/person';
import { SimpleInvitationForm } from '../simple-invitation-form/simple-invitation-form';
import { QuickPeopleMenu } from './quick-people-menu'
import { Plot } from '../../models/plot';
import { PlotForm } from '../plot-form/plot-form'
import { QuickPlotsMenu } from './quick-plots-menu'

@Component({
  selector: 'people',
  templateUrl: './people.html'
})
export class People {
  filteredList: Person[];
  list: any[];
  joined: Person[];
  plots: Plot[] = [];
  invited: Person[];
  plot_points_enabled: boolean = false;
  searching = false;
  tabs = [
    {title: "PEOPLE.JOINED", active: true},
    {title: "PEOPLE.INVITED", active: false},
    {title: "PLOTS.TITLE", active: false}
  ]

  constructor(
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    private personService: PersonService
  ) {
    personService.getCommunity().subscribe(community => {
      this.joined = community.joined;
      this.invited = community.invited;
      this.list = this.joined;
      this.filteredList = this.list;
      this.plot_points_enabled = community.plot_points_enabled;
    });
    personService.getPlots().subscribe(plots => {
      this.plots = plots
    });
  }

  showTasks(tabTitle){
    if(tabTitle === "PEOPLE.JOINED"){ this.list = this.joined }
    else if(tabTitle === "PEOPLE.INVITED"){ this.list = this.invited }
    else if(tabTitle === "PLOTS.TITLE"){ this.list = this.plots }
    this.filteredList = this.list
  }

  selectTab(tabTitle) {
    this.tabs.forEach((tab) => {
      tab.active = false;
      if(tabTitle === tab.title) { tab.active = true };
    });
    this.showTasks(tabTitle)
  }

  presentPersonPopover(event, person) {
    let popover = this.popoverCtrl.create(QuickPeopleMenu, {person: person});
    popover.present({
      ev: event
    });
  }

  presentPlotPopover(event, plot) {
    let popover = this.popoverCtrl.create(QuickPlotsMenu, {plot: plot});
    popover.present({
      ev: event
    });
    popover.onDidDismiss((action, plot = null) => {
      if('edit' == action){
        this.navCtrl.push(PlotForm, {plot: plot});
      }else if('delete' == action){
        this.navCtrl.setRoot(People);
      }
    })
  }

  search(){
    this.searching = true
  }

  getItems(ev) {
    this.filteredList = this.list
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.filteredList = this.list.filter((item) => {
        return item.searcheable().toLowerCase().indexOf(val.toLowerCase()) > -1
      })
    }
  }

  onClear(ev) {
   this.filteredList = this.list;
   this.searching = false;
   ev.target.value = '';
  }

  goToInvitePerson(){
    this.navCtrl.push(SimpleInvitationForm);
  }

  goToAddPlot(){
    this.navCtrl.push(PlotForm);
  }

  setStatus(plot, status){
    plot.status = status;
  }

  saveStatus(){
    let plots = []
    for(let plot of this.plots){
      if (null != plot.status){
        plots.push({'id' : plot.id, 'status' : plot.status});
      }
    }
    this.personService.updateStatus({'plots': plots}).subscribe(community => {
      this.navCtrl.setRoot(People);
    });
  }

  createRevision(){
    let plots = []
    for(let plot of this.plots){
      plots.push({'id' : plot.id, 'status' : plot.status});
    }
    this.personService.createRevision({'plots': plots}).subscribe(plots => {
      this.navCtrl.setRoot(People);
    });
  }
}
