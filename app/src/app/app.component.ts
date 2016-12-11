import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { TranslateService } from 'ng2-translate';
import 'moment/locale/es';
import * as moment from 'moment';

import { Tasks } from '../pages/tasks/tasks';
import { CreateTask } from '../pages/create-task/create-task';
import { TaskService } from '../providers/task.service';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Tasks;

  pages: Array<{title: string, component: any}>;

  isAdmin: boolean = true;

  constructor(public platform: Platform, translate: TranslateService, public taskService: TaskService) {
    this.initializeApp();
    translate.setDefaultLang('es');
    translate.use('es');
    moment().locale('es');
    // used for an example of ngFor and navigation
    this.pages = [
      { title: "TASKS.TITLE", component: Tasks },
      { title: "TASK.CREATE.TITLE", component: CreateTask }
    ];
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

  setAdmin(){
    console.log(this.isAdmin)
    this.taskService.isAdmin = this.isAdmin
  }
}
