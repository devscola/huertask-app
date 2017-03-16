import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, MenuController, AlertController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { TranslateService } from 'ng2-translate';
import 'moment/locale/es';
import * as moment from 'moment';

import { LogIn } from '../pages/log-in/log-in';
import { Tasks } from '../pages/tasks/tasks';
import { CreateTask } from '../pages/create-task/create-task';
import { FavCategories } from '../pages/fav-categories/fav-categories';
import { Register } from '../pages/register/register';
import { Welcome } from '../pages/welcome/welcome';
import { Tutorial } from '../pages/tutorial/tutorial';
import { CommunityForm } from '../pages/community-form/community-form';
import { CommunityModal } from '../pages/community-modal/community-modal';
import { InvitationForm } from '../pages/invitation-form/invitation-form';
import { JoinCommunity } from '../pages/join-community/join-community';
import { People } from '../pages/people/people';
import { SimpleInvitationForm } from '../pages/simple-invitation-form/simple-invitation-form';
import { PointsSettings } from '../pages/points-settings/points-settings';
import { Points } from '../pages/points/points';
import { TaskService } from '../providers/task.service';
import { PersonService } from '../providers/person.service';

export interface PageInterface {
  title: string;
  component: any;
  tab?: string;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  loggedInPages: PageInterface[] = [
    { title: "TASKS.TITLE", component: Tasks },
    { title: "CATEGORIES.FAV.TITLE", component: FavCategories },
    { title: "POINTS.TITLE", component: Points },
    { title: "POINTS.DONATE", component: Points, tab: "POINTS.DONATE" },
    { title: "PEOPLE.TITLE", component: People },
  ];

  notMemberPages: PageInterface[] = [
    { title: "COMMUNITY.CREATE.TITLE", component: CommunityForm },
    { title: "COMMUNITY.JOIN.TITLE", component: JoinCommunity },
  ];

  loggedOutPages: PageInterface[] = [
    { title: "LOGIN.TITLE", component: LogIn},
    { title: "REGISTER.TITLE", component: Register },
    { title: "WELCOME.TITLE", component: Welcome }
  ];
  adminPages: PageInterface[] = [
    { title: "TASKS.TITLE", component: Tasks },
    { title: "CATEGORIES.FAV.TITLE", component: FavCategories },
    { title: "POINTS.TITLE", component: Points },
    { title: "POINTS.DONATE", component: Points, tab: "POINTS.DONATE" },
    { title: "PEOPLE.TITLE", component: People },
    { title: "PLOTS.TITLE", component: People, tab: "PLOTS.TITLE" },
    { title: "POINTS.SETTINGS.TITLE", component: PointsSettings },
  ];

  person = null;
  isAdmin: boolean = false;
  communities;
  activeCommunityName;
  hasInvitations;
  invitations;

  constructor(
    public events: Events,
    public menu: MenuController,
    public alertCtrl: AlertController,
    public platform: Platform,
    public translate: TranslateService,
    public taskService: TaskService,
    public personService: PersonService
  ) {
    translate.setDefaultLang('es');
    translate.use('es');
    moment().locale('es');
    this.listenToLoginEvents();
    personService.getUser().then(user =>{
      if(null == user){
        this.rootPage = Tutorial;
        this.initializeApp();
      }else{
        personService.getPerson(user['id']).subscribe(person => {
          personService.setPerson(person).then(person => {
            this.person = person;
            personService.setDefaultCommunity().then((community)=>{
              personService.events.publish('user:login')
              if(person['communities'].length > 0){
                this.rootPage = Tasks;
              }else{
                this.rootPage = JoinCommunity;
              }
              this.initializeApp();
            })
          })
        }, err => {
          this.rootPage = Welcome;
          this.initializeApp();
        })
      }
      Splashscreen.hide();
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.tab){
      this.nav.setRoot(page.component, {tab: page.tab});
    }else{
      this.nav.setRoot(page.component);
    }
  }

  showRadio() {
      let messages;
      this.translate.get('COMMUNITY.CHANGE_ALERT').subscribe((res: Object) => {
        messages = res
      });
      let alert = this.alertCtrl.create();
      alert.setTitle(messages['TITLE']);

      for(let community in this.communities){
        let checked = false
        if(this.communities[community]['community']['name'] == this.activeCommunityName){ checked = true }
        alert.addInput({
          type: 'radio',
          label: this.communities[community]['community']['name'],
          value: this.communities[community]['community']['name'],
          checked: checked
        });
      }

      alert.addInput({
        type: 'radio',
        label: messages['NEW'],
        value: 'new_community',
        checked: false
      });

      alert.addButton(messages['CANCEL']);
      alert.addButton({
        text: messages['OK'],
        handler: data => {
          this.changeCommunity(data)
        }
      });
      alert.present();
    }

  changeCommunity(community_name){
    if(community_name == 'new_community'){
      this.activeCommunityName = this.personService.activeCommunity['name']
      this.menu.close()
      return this.nav.setRoot(CommunityForm)
    }
    let relation = this.communities.filter(relation => relation.community.name === community_name)[0]
    this.personService.setCommunity(relation.community, relation.type)
  }

  goToInvitations(){
    this.menu.close()
    this.nav.setRoot(JoinCommunity)
  }

  logOut(){
    this.nav.setRoot(Welcome).then(() => {
      this.personService.logOut();
    })
  }

  listenToLoginEvents() {
    this.personService.events.subscribe('user:login', () => {
      console.log('user:login');
      this.communities = this.personService.communities
      if (this.personService.person['invitations'].length > 0 ){ this.hasInvitations = true }
      this.invitations = this.personService.person['invitations'].length
      this.isAdmin = this.personService.isAdmin
      if(this.personService.person['communities'].length > 0){
        this.activeCommunityName = this.personService.activeCommunity['name']
        this.nav.setRoot(Tasks)
      }
      this.nav.setRoot(JoinCommunity)
      this.menu.close()
      this.person = this.personService.person;
      this.enableMenu(true);
    });

    this.personService.events.subscribe('user:signup', () => {
      console.log('user:signup');
      this.person = this.personService.person;
      this.enableMenu(true);
    });

    this.personService.events.subscribe('user:logout', () => {
      console.log('user:logout');
      this.person = null;
      this.enableMenu(false);
    });
  }

  enableMenu(loggedIn: boolean) {
    if(this.personService.isAdmin){
      this.menu.enable(true, 'adminMenu');
      this.menu.enable(false, 'loggedInMenu');
      this.menu.enable(false, 'loggedOutMenu');
      this.menu.enable(false, 'notMemberMenu');
    }else if(this.personService.person['communities'].length < 1){
      this.menu.enable(true, 'notMemberMenu');
      this.menu.enable(false, 'adminMenu');
      this.menu.enable(false, 'loggedInMenu');
      this.menu.enable(false, 'loggedOutMenu');
    }else{
      this.menu.enable(false, 'adminMenu');
      this.menu.enable(loggedIn, 'loggedInMenu');
      this.menu.enable(!loggedIn, 'loggedOutMenu');
      this.menu.enable(false, 'notMemberMenu');
    }
  }

  pageClass(title: string) {
    return title.toLowerCase().replace('.title', '').split('.').join('-')
  }
}
