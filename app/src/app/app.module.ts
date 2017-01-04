import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MomentModule } from 'angular2-moment';
import { MyApp } from './app.component';
import { Tasks } from '../pages/tasks/tasks';
import { CreateTask } from '../pages/create-task/create-task';
import { TaskDetail } from '../pages/task-detail/task-detail';
import { DuplicateTask } from '../pages/duplicate-task/duplicate-task';
import { EditTask } from '../pages/edit-task/edit-task';
import { TaskForm } from '../pages/task-form/task-form';
import { FavCategories } from '../pages/fav-categories/fav-categories';
import { FavCategoriesMenu } from '../pages/fav-categories/fav-categories-menu';
import { TaskService } from '../providers/task.service';
import { PersonService } from '../providers/person.service';
import { FormAction } from '../components/form-action/form-action';

import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';

export function createTranslateLoader(http: Http) {
    return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    Tasks,
    CreateTask,
    TaskDetail,
    EditTask,
    TaskForm,
    FavCategories,
    FavCategoriesMenu,
    DuplicateTask,
    FormAction
  ],
  imports: [
    HttpModule,
    TranslateModule.forRoot({
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
    }),
    IonicModule.forRoot(MyApp),
    MomentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Tasks,
    CreateTask,
    TaskDetail,
    EditTask,
    FavCategories,
    FavCategoriesMenu,
    TaskForm,
    DuplicateTask
  ],
  providers: [TaskService, PersonService]
})
export class AppModule {}
