import { Component, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { Task } from '../../models/task';
import { Tasks } from '../tasks/tasks';
import { TaskService } from '../../providers/task.service';

@Component({
  selector: 'task-form',
  templateUrl: 'task-form.html'
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
    public translate: TranslateService
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
    return this.formBuilder.group({
      title: [task.title, Validators.compose([
        Validators.required,
        Validators.maxLength(100)
      ])],
      categories: [categories, Validators.required],
      from_date: [task.from_date, Validators.required],
      to_date: [task.to_date, Validators.required],
      required_people: [task.required_people, Validators.required],
      note: [task.note]
    });
  }

  submitTask(){
    this.submited = true;
    let task = this.form.value;
    task['to_date'] = this.buildToDate()

    if(Date.parse(task['from_date']) < Date.now()){
      this.pastDateAlert(task)
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
    err => console.log(err)
    )
  }

  createTask(task: Object){
    this.taskService.createTask(task).subscribe( data => {
      this.navCtrl.setRoot(Tasks);
    },
    err => console.log(err)
    )
  }

  duplicateTask(task: Object){
    task = this.cleanTask(task);
    this.taskService.createTask(task).subscribe( data => {
      this.navCtrl.setRoot(Tasks);
    },
    err => console.log(err)
    )
  }

  cleanTask(task: Object){
    delete task['id'];
    delete task['people_going']
    delete task['people_not_going']
    return task
  }

  isSelected(category){
    return !!this.task.categories.find(cat => cat.id === category.id)
  }

  buildToDate(){
    return this.form.value['from_date'].split('T')[0] + 'T' + this.form.value['to_date'] + ':00Z'
  }

  pastDateAlert(task: Task) {
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

}
