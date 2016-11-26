import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { Tasks } from '../pages/tasks/tasks';
import { CreateTask } from '../pages/create-task/create-task';
import { TaskDetail } from '../pages/task-detail/task-detail';
import { EditTask } from '../pages/edit-task/edit-task';
import { TaskForm } from '../pages/task-form/task-form';
import { TaskService } from '../providers/task.service';
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
    FormAction
  ],
  imports: [
    HttpModule,
    TranslateModule.forRoot({
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
    }),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Tasks,
    CreateTask,
    TaskDetail,
    EditTask,
    TaskForm
  ],
  providers: [TaskService]
})
export class AppModule {}
