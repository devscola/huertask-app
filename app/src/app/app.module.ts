import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MomentModule } from 'angular2-moment';
import { MyApp } from './app.component';
import { KeysPipe } from './keys.pipe';
import { LogIn } from '../pages/log-in/log-in';
import { TermsAndConditions } from '../pages/terms-and-conditions/terms-and-conditions';
import { EqualValidator } from './equal-validator.directive';
import { CommunityForm } from '../pages/community-form/community-form';
import { CommunityModal } from '../pages/community-modal/community-modal';
import { InvitationForm } from '../pages/invitation-form/invitation-form';
import { People } from '../pages/people/people';
import { SimpleInvitationForm } from '../pages/simple-invitation-form/simple-invitation-form';
import { Tasks } from '../pages/tasks/tasks';
import { CreateTask } from '../pages/create-task/create-task';
import { TaskDetail } from '../pages/task-detail/task-detail';
import { DuplicateTask } from '../pages/duplicate-task/duplicate-task';
import { EditTask } from '../pages/edit-task/edit-task';
import { TaskForm } from '../pages/task-form/task-form';
import { CategoryForm } from '../pages/category-form/category-form';
import { FavCategories } from '../pages/fav-categories/fav-categories';
import { FavCategoriesMenu } from '../pages/fav-categories/fav-categories-menu';
import { Register } from '../pages/register/register';
import { ResetPassword } from '../pages/reset-password/reset-password';
import { Welcome } from '../pages/welcome/welcome';
import { Points } from '../pages/points/points';
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
    EqualValidator,
    KeysPipe,
    Tasks,
    LogIn,
    TermsAndConditions,
    CommunityForm,
    CommunityModal,
    InvitationForm,
    People,
    SimpleInvitationForm,
    CreateTask,
    TaskDetail,
    EditTask,
    TaskForm,
    CategoryForm,
    FavCategories,
    FavCategoriesMenu,
    DuplicateTask,
    FormAction,
    Register,
    ResetPassword,
    Welcome,
    Points,
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
    LogIn,
    TermsAndConditions,
    CommunityForm,
    CommunityModal,
    InvitationForm,
    People,
    SimpleInvitationForm,
    CreateTask,
    TaskDetail,
    EditTask,
    FavCategories,
    FavCategoriesMenu,
    TaskForm,
    CategoryForm,
    DuplicateTask,
    Register,
    ResetPassword,
    Welcome,
    Points
  ],
  providers: [TaskService, PersonService, Storage]
})
export class AppModule {}
