import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { Tasks } from '../pages/tasks/tasks';

@NgModule({
  declarations: [
    MyApp,
    Tasks
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Tasks
  ],
  providers: []
})
export class AppModule {}
