import { Component } from '@angular/core';
import { Task } from '../../models/task';
import { Tasks } from '../tasks/tasks';
import { TaskService } from '../../providers/task.service';
import { PersonService } from '../../providers/person.service';
import { EditTask } from '../edit-task/edit-task';
import { DuplicateTask } from '../duplicate-task/duplicate-task';
import { NavController, AlertController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'task-detail',
  templateUrl: './task-detail.html'
})

export class TaskDetail {

  task = new Task();
  waitingForResponse = false
  person;
  isAdmin = false;
  attended = {};

  constructor(public navCtrl: NavController,
              private navParams: NavParams,
              public translate: TranslateService,
              public taskService: TaskService,
              public personService: PersonService,
              public alertCtrl: AlertController) {
    this.task = navParams.get('task');
    this.person = personService.person
    this.isAdmin = personService.isAdmin
    this.setAttended()
  }

  setAttended(){
    for(let i in this.task.people_going){
      let person = this.task.people_going[i]
      this.attended[person.id] = true
    }
  }

  togglePeopleGoing(event){
    event.target.parentElement.parentElement.classList.toggle('show_all')
  }

  deleteConfirmation() {
    this.translate.get('TASK.DELETE_ALERT').subscribe((res: Object) => {
      this.presentAlert(res)
    });
  }

  presentAlert(messages: Object){
    let alert = this.alertCtrl.create({
      title: messages['TITLE'],
      subTitle: messages['SUBTITLE'],
      buttons: [
        {
          text: messages['BUTTONS']['SUBMIT'],
          handler: () => {
            this.deleteTask()
          }
        }, messages['BUTTONS']['CANCEL']
      ]
    });
    alert.present()
  }

  deleteTask(){
    return this.taskService.deleteTask(this.task.id).subscribe( data => {
      this.navCtrl.setRoot(Tasks);
    },
    err => console.log(err)
    )
  }

  going(){
    return this.taskService.going(this.task.id, this.person['id']).subscribe( data => {
      this.task = data
    },
    err => console.log(err)
    )
  }

  notGoing(){
    return this.taskService.notGoing(this.task.id, this.person['id']).subscribe( data => {
      this.task = data
    },
    err => console.log(err)
    )
  }

  toggleFinalized(task: Task){
    task.toggleFinalized()
    this.waitingForResponse = true
    task['categories'] = task['categories'].map((cat) => {return cat['id']})
    return this.taskService.editTask(task).subscribe( data => {
      this.task = data
      task['categories'] = data.categories
      this.waitingForResponse = false
    },
    err => console.log(err)
    )
  }

  finalize(){
    this.taskService.finalizeTask(this.attended, this.task['id']).subscribe( data => {
      this.task = data
    },
    err => console.log(err)
    )
  }

  goToEditTask(){
    this.navCtrl.push(EditTask, {task: this.task});
  }

  goToDuplicateTask(){
    this.navCtrl.push(DuplicateTask, {task: this.task});
  }
}
