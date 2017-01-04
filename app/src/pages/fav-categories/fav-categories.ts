import { Component } from '@angular/core';
import { NavController, PopoverController } from 'ionic-angular';
import { TaskService } from '../../providers/task.service';
import { PersonService } from '../../providers/person.service';
import { FavCategoriesMenu } from './fav-categories-menu';

@Component({
  selector: 'page-fav-categories',
  templateUrl: 'fav-categories.html'
})
export class FavCategories {
  person;
  categories;

  constructor(
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    public personService: PersonService,
    public taskService: TaskService,
    ) {
    personService.getPerson(1).subscribe(person => {
      this.person = person;
      taskService.getCategories().subscribe(categories => {
        let disliked_ids = this.person['dislike_categories'].map(cat => {return cat.id})
        this.categories = categories.map(cat => {
          cat['fav'] = disliked_ids.includes(cat.id) ? false : true;
          cat['showDescription'] = false;
          return cat;
        })
      });
    });
  }

  toggleFavorite(category){
    return this.personService.toggleLikeCategory(this.person, category).subscribe( data => {
      this.person = data
    },
    err => console.log(err)
    )
  }

  toggleDescription(category){
    if(category.description){
      category.showDescription = !category.showDescription
    }
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(FavCategoriesMenu);
    popover.present({
      ev: event
    });
  }

}
