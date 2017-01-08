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
  action = 'create';
  submited = false;
  title = 'CATEGORY.CREATE.TITLE'

  constructor(
    public el: ElementRef,
    public navCtrl: NavController,
    private navParams: NavParams,
    public formBuilder: FormBuilder,
    public taskService: TaskService,
    public translate: TranslateService,
    public toastCtrl: ToastController
  ) {
    this.category = navParams.get('category') || new Category();
    if(navParams.get('category')){
      this.title = 'CATEGORY.EDIT.TITLE';
      this.action = 'edit';
    }
    this.form = this.generateForm(this.category);

  }

  generateForm(category){
    return this.formBuilder.group({
      name: [category.name, Validators.compose([
        Validators.required,
        Validators.maxLength(35)
      ])],
      description: [category.description, Validators.maxLength(255)],
      mandatory: [category.mandatory]
    });
  }

  hasValidationError(property){
    return !this.form.controls[property].valid && this.submited
  }

  hasThisError(property, error){
    return this.form.controls[property].hasError(error)
  }

  submit(){
    this.submited = true;
    let category = this.form.value;
    category = this.taskService.instanciatedCategory(category)
    category['id'] = this.category.id;
    if(this.action == 'edit'){
      this.taskService.editCategory(category).subscribe( data => {
        this.navCtrl.setRoot(FavCategories);
      },
      err => this.presentToast('Ha habido un error', 'danger')
      )
    }else{
      this.taskService.createCategory(category).subscribe( data => {
        this.navCtrl.setRoot(FavCategories);
      },
      err => this.presentToast('Ha habido un error', 'danger')
      )
    }

  }

  presentToast(message: string, cssClass: string = '') {
    let toast = this.toastCtrl.create({
     message: message,
     duration: 5000,
     position: 'bottom',
     cssClass: cssClass
    });

    toast.present();
  }

}
