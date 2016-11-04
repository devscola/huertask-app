import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';



var tasks = [
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

interface Task {
	title: string,
	date: string,
	category: string,
	people_left: number
};

@Component({
  selector: 'tasks',
  templateUrl: 'tasks.html'
})
export class Tasks {

  public list: Task[];

  tabs = [
    {title: "Próximas", active: true},
    {title: "Mias", active: false},
    {title: "Pasadas", active: false}
  ]

	constructor(public navCtrl: NavController) {
    this.sortByDate();
    this.showFutureTasks();
	}

	sortByDate(){
    this.list = tasks.sort(function(a,b){
			let date = Date.parse(a.date);
			let secondDate = Date.parse(b.date);
			return date - secondDate;
	  });
	}

	showFutureTasks(){
    let fromDate = Date.now();
		this.list = tasks.filter(function(task) { return Date.parse(task.date) >= fromDate });
	}

  showPastTasks(){
    let fromDate = Date.now();
    this.list = tasks.filter(function(task) { return Date.parse(task.date) <= fromDate });
  }

  showTasks(tabTitle){
    if(tabTitle === "Próximas"){ return this.showFutureTasks() }
    if(tabTitle === "Pasadas"){ this.showPastTasks() }
  }

  selectTab(tabTitle) {
    this.tabs.forEach((tab) => {
      tab.active = false;
      if(tabTitle === tab.title) { tab.active = true };
    });
    this.showTasks(tabTitle)
  }
}
