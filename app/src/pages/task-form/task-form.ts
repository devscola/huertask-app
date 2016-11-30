import { Component, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    public taskService: TaskService
  ) {
    this.categories = taskService.categories;
    this.action = el.nativeElement.getAttribute('form-action');

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
    return this.formBuilder.group({
      title: [task.title, Validators.compose([
        Validators.required,
        Validators.maxLength(100)
      ])],
      category: [task.category, Validators.required],
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

  buildToDate(){
    return this.form.value['from_date'].split('T')[0] + 'T' + this.form.value['to_date'] + ':00Z'
  }

  pastDateAlert(task) {
    let alert = this.alertCtrl.create({
      title: 'La fecha de esta tarea ha vencido',
      subTitle: '¿Quieres guardarla de todas formas?',
      buttons: [{
          text: 'Guardar',
          handler: () => {
            this.callActionMethod(task)
          }
        }, 'Revisar']
    });
    alert.present();
  }
}
