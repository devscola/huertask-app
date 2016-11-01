import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

interface Task {
	title: string,
	date: string,
	category: string,
	people_left: number
}

@Component({
  selector: 'tasks',
  templateUrl: 'tasks.html'
})
export class Tasks {

public list: Task[];
tasks = [
		{
			title: "Regar parcela",
			date: "2016/10/31",
			category: "general",
			people_left: 2
		},
		{
			title: "Recoger tomates",
			date: "2016/12/07",
			category: "cosecha",
			people_left: 1
		},
		{
			title: "Barrer entrada",
			date: "2016/12/09",
			category: "limpieza",
			people_left: 4
		},
		{
			title: "Traer leña",
			date: "2016/12/12",
			category: "general",
			people_left: 1
		},
		{
			title: "Quitar malas hierbas",
			date: "2016/12/02",
			category: "limpieza",
			people_left: 5
		},
		{
			title: "Ampliar parcelas zona oeste",
			date: "2016/12/13",
			category: "general",
			people_left: 9
		}
	];

  constructor(public navCtrl: NavController) {
    this.list = this.tasks.sort(function(a,b){
	  return parseInt(a.date.split('/').join('')) - parseInt(b.date.split('/').join(''));
	});
  }

}
