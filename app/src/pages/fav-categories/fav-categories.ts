import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TaskService } from '../../providers/task.service';
import { PersonService } from '../../providers/person.service';

@Component({
  selector: 'page-fav-categories',
  templateUrl: 'fav-categories.html'
})
export class FavCategories {
  person;
  categories;

  constructor(
    public navCtrl: NavController,
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

}
