import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, MenuController } from 'ionic-angular';
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
    { title: "COMMUNITY.CREATE.TITLE", component: CommunityForm },
    { title: "COMMUNITY.JOIN.TITLE", component: JoinCommunity },
  ];

  loggedOutPages: PageInterface[] = [
    { title: "LOGIN.TITLE", component: LogIn},
    { title: "REGISTER.TITLE", component: Register },
    { title: "WELCOME.TITLE", component: Welcome }
  ];
  adminPages: PageInterface[] = [
    { title: "TASK.CREATE.TITLE", component: CreateTask },
    { title: "COMMUNITY.CREATE.TITLE", component: CommunityForm },
    { title: "INVITATIONS.TITLE", component: InvitationForm },
    { title: "PEOPLE.TITLE", component: People },
    { title: "INVITATION.FORM.TITLE", component: SimpleInvitationForm },
    { title: "POINTS.SETTINGS.TITLE", component: PointsSettings },
  ];

  isAdmin: boolean = false;

  constructor(
    public events: Events,
    public menu: MenuController,
    public platform: Platform,
    translate: TranslateService,
    public taskService: TaskService,
    public personService: PersonService
  ) {
    translate.setDefaultLang('es');
    translate.use('es');
    moment().locale('es');
    this.listenToLoginEvents();

    personService.getUser().then(user =>{
      personService.person = user;
      personService.setCommunities().then((res)=>{
        this.isAdmin = personService.isAdmin;
        this.enableMenu(null != user);
        this.rootPage =  user ? Tasks : Welcome;
        this.initializeApp();
      })
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
    this.nav.setRoot(page.component);
  }

  logOut(){
    this.nav.setRoot(Welcome).then(() => {
      this.personService.logOut();
    })
  }

  listenToLoginEvents() {
    this.personService.events.subscribe('user:login', () => {
      console.log('user:login');
      this.enableMenu(true);
    });

    this.personService.events.subscribe('user:signup', () => {
      console.log('user:signup');
      this.enableMenu(true);
    });

    this.personService.events.subscribe('user:logout', () => {
      console.log('user:logout');
      this.enableMenu(false);
    });
  }

  enableMenu(loggedIn: boolean) {
    if(this.personService.isAdmin){
      this.menu.enable(true, 'adminMenu');
      this.menu.enable(false, 'loggedInMenu');
      this.menu.enable(false, 'loggedOutMenu');
    }else{
      this.menu.enable(false, 'adminMenu');
      this.menu.enable(loggedIn, 'loggedInMenu');
      this.menu.enable(!loggedIn, 'loggedOutMenu');
    }
  }
}
