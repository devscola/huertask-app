import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import { TaskService } from '../../providers/task.service';
import { CategoryForm } from '../category-form/category-form';

@Component({
  selector: 'page-fav-categories-menu',
  template: `
    <ion-list>
      <button ion-item (click)="goToEditCategory()">{{ 'BUTTONS.EDIT' | translate }}</button>
      <button ion-item (click)="tryDelete(category)">{{ 'BUTTONS.DELETE' | translate }}</button>
    </ion-list>
  `
})
export class FavCategoriesMenu {

  category;
  futureCategoryTasks;

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private translate: TranslateService,
    public taskService: TaskService
  ) {
    this.category = this.navParams.data.category;
    this.taskService.getFutureTasks().subscribe(tasks => {
      let tasksCategories = tasks.map(task => {return {'id': task.id, 'categories': task.categories.map(cat => cat.id)}});
      this.futureCategoryTasks = tasksCategories.filter(task => task['categories'].indexOf(this.category.id)>=0);
    });
  }

  goToEditCategory(){
    this.navCtrl.push(CategoryForm, {category: this.category});
    this.close();
  }

  tryDelete(category){
    if(this.futureCategoryTasks.length == 0){
      this.showConfirm(category);
    }else{
      this.showError();
    }
    this.close();
  }

  showConfirm(category) {
    this.translate.get('CATEGORIES.DELETE_CONFIRM').subscribe((res: Object) => {
      this.presentDeleteConfirm(res, category)
    });
  }

  presentDeleteConfirm(messages: Object, category) {
    let alert = this.alertCtrl.create({
      title: messages['TITLE'],
      message: messages['SUBTITLE'],
      buttons: [
        {
          text: messages['BUTTONS']['CANCEL'],
          role: 'cancel',
          handler: () => {
            alert.dismiss();
          }
        },
        {
          text: messages['BUTTONS']['DELETE'],
          handler: () => {
            this.deleteCategory(category);
            alert.dismiss();
          }
        }
      ]
    });
    alert.present();
  }

  showError() {
    this.translate.get('CATEGORIES.CATEGORY_WITH_TASKS_ALERT').subscribe((res: Object) => {
      this.presentCategoryWithTasksAlert(res)
    });
  }

  presentCategoryWithTasksAlert(messages: Object){
    let alert = this.alertCtrl.create({
      title: this.category.name,
      subTitle: messages['SUBTITLE'],
      buttons: [messages['BUTTON']]
    });
    alert.present();
  }

  close() {
    this.viewCtrl.dismiss();
  }

  deleteCategory(category){
    this.taskService.deleteCategory(category.id).subscribe();
  }

}
