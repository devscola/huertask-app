import { Component, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { Task } from '../../models/task';
import { Tasks } from '../tasks/tasks';
import { TaskService } from '../../providers/task.service';
import moment from 'moment';

@Component({
  selector: 'task-form',
  templateUrl: './task-form.html'
})
export class TaskForm {

  task;
  categories;
  form;
  action;
  submited = false;

  constructor(
    public el: ElementRef,
    public navCtrl: NavController,
    private navParams: NavParams,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public taskService: TaskService,
    public translate: TranslateService,
    public toastCtrl: ToastController
  ) {
    this.action = el.nativeElement.getAttribute('form-action');
    taskService.getCategories().subscribe(categories => {
      this.categories = categories;
    });

    if(this.action == 'edit'){
      this.task = navParams.get('task');
    }
    else if (this.action == 'create'){
      this.task = new Task();
    }
    else if (this.action == 'duplicate'){
      var taskToCopy = navParams.get('task')

      taskToCopy['from_date'] = '';
      taskToCopy['to_date'] = '';

      this.task = taskToCopy;
    }

    this.form = this.generateForm(this.task);

  }

  generateForm(task){
    let categories = []
    if(task.categories){
      categories = task.categories.map(function(cat) {return cat.id;});
    }
    let date = ''
    let start_time = ''
    let end_time = ''

    if(this.action == 'edit'){
      date = moment(task['from_date']).format('YYYY-MM-DD')
      start_time = moment(task['from_date']).format('HH:mm')
      end_time = moment(task['to_date']).format('HH:mm')
    }

    return this.formBuilder.group({
      title: [task.title, Validators.compose([
        Validators.required,
        Validators.maxLength(100)
      ])],
      categories: [categories, Validators.required],
      date: [date, Validators.required],
      start_time: [start_time, Validators.required],
      end_time: [end_time, Validators.required],
      required_people: [task.required_people, Validators.required],
      note: [task.note],
      from_date: [],
      to_date: []
    });
  }

  hasValidationError(property){
    return !this.form.controls[property].valid && this.submited
  }

  hasThisError(property, error){
    return this.form.controls[property].hasError(error)
  }

  title(){
    return 'TASK.' + this.action.toUpperCase() + '.TITLE';
  }

  submitTask(){
    this.submited = true;
    let task = this.form.value;
    task['from_date'] = this.buildDate('start_time');
    task['to_date'] = this.buildDate('end_time');

    task = this.taskService.instanciatedTask(task)

    if(Date.parse(task['from_date']) < Date.now()){
      this.pastDateConfirmation(task)
    }else{
      this.callActionMethod(task)
    }
  }

  callActionMethod(task){
    if (this.form.valid){
      if(this.action == 'edit'){
        task['id'] = this.task.id;
        this.editTask(task);
      }else if (this.action == 'duplicate'){
        this.duplicateTask(task);
      }else{
        this.createTask(task);
      }
    }
  }

  editTask(task: Object){
    this.taskService.editTask(task).subscribe( data => {
      this.navCtrl.setRoot(Tasks);
    },
    err => this.presentToast('Ha habido un error', 'danger')
    )
  }

  createTask(task: Object){
    this.taskService.createTask(task).subscribe( data => {
      this.navCtrl.setRoot(Tasks);
    },
    err => this.presentToast('Ha habido un error', 'danger')
    )
  }

  duplicateTask(task: Task){
    task = task.clean();
    this.taskService.createTask(task).subscribe( data => {
      this.navCtrl.setRoot(Tasks);
    },
    err => this.presentToast('Ha habido un error', 'danger')
    )
  }

  buildDate(time: string){
    let date = new Date(this.form.value['date'])
    let hours = parseInt(this.form.value[time].split(':')[0])
    let minutes = parseInt(this.form.value[time].split(':')[1])
    date.setHours(hours)
    date.setMinutes(minutes)
    return date.toString()
  }

  pastDateConfirmation(task: Task) {
    this.translate.get('TASK.FORM.PAST_ALERT').subscribe((res: Object) => {
      this.presentAlert(res, task)
    });
  }

  presentAlert(messages: Object, task: Task){
    let alert = this.alertCtrl.create({
      title: messages['TITLE'],
      subTitle: messages['SUBTITLE'],
      buttons: [
        {
          text: messages['BUTTONS']['SUBMIT'],
          handler: () => {
            this.callActionMethod(task)
          }
        }, messages['BUTTONS']['CANCEL']
      ]
    });
    alert.present()
  }

  presentToast(message: string, cssClass: string = '') {
    let toast = this.toastCtrl.create({
     message: message,
     duration: 2000,
     position: 'bottom',
     cssClass: cssClass
    });

    toast.present();
  }

}
