import { Component, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
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
    public formBuilder: FormBuilder,
    public taskService: TaskService
  ) {
    this.categories = taskService.categories;
    this.form = formBuilder.group({
      title: [null, Validators.compose([
        Validators.required,
        Validators.maxLength(100)
      ])],
      category: [null, Validators.required],
      from_date: [null, Validators.required],
      to_date: [null, Validators.required],
      required_people: [null, Validators.required],
      note: [null]
    });
    this.action = el.nativeElement.getAttribute('form-action');
    if(this.action == 'edit'){
      this.task = navParams.get('task');
    }else{
      this.task = new Task();
    }
  }

  submitTask(){
    this.submited = true;
    let task = this.form.value;
    if (this.form.valid){
      if(this.action == 'edit'){
        this.editTask(task);
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

}
