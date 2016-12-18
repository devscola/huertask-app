import { Component, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { Category } from '../../models/category';
import { TaskService } from '../../providers/task.service';
import { FavCategories } from '../fav-categories/fav-categories';

@Component({
  selector: 'category-form',
  templateUrl: './category-form.html'
})
export class CategoryForm {

  category;
  form;
  action;
  submited = false;

  constructor(
    public el: ElementRef,
    public navCtrl: NavController,
    private navParams: NavParams,
    public formBuilder: FormBuilder,
    public taskService: TaskService,
    public translate: TranslateService,
    public toastCtrl: ToastController
  ) {
    this.action = el.nativeElement.getAttribute('form-action');
    this.category = new Category();
    this.form = this.generateForm(this.category);

  }

  generateForm(category){
    return this.formBuilder.group({
      name: [category.name, Validators.compose([
        Validators.required,
        Validators.maxLength(35)
      ])],
      description: [category.description]
    });
  }

  hasValidationError(property){
    return !this.form.controls[property].valid && this.submited
  }

  hasThisError(property, error){
    return this.form.controls[property].hasError(error)
  }

  createCategory(){
    this.submited = true;
    let category = this.form.value;
    category = this.taskService.instanciatedCategory(category)

    this.taskService.createCategory(category).subscribe( data => {
      this.navCtrl.setRoot(FavCategories);
    },
    err => this.presentToast('Ha habido un error', 'danger')
    )
  }

  presentToast(message: string, cssClass: string = '') {
    let toast = this.toastCtrl.create({
     message: message,
     duration: 19000,
     position: 'bottom',
     cssClass: cssClass
    });

    toast.present();
  }

}
