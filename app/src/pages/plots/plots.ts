import { Component } from '@angular/core';
import { NavController, PopoverController } from 'ionic-angular';
import { PersonService } from '../../providers/person.service';
import { Plot } from '../../models/plot';
import { QuickPlotsMenu } from './quick-plots-menu'

@Component({
  selector: 'plots',
  templateUrl: 'plots.html'
})
export class Plots {
  plots: Plot[] = [];

  constructor(
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    private personService: PersonService
  ) {
      personService.getPlots().subscribe(plots => {
        // this.plots = plots
        this.plots = [
          {'id': 1, 'name': 'Parcela 1', 'person' : {'name': 'Ana'}},
          {'id': 2, 'name': 'Parcela 2', 'person' : {'name': 'Emma'}},
          {'id': 3, 'name': 'Parcela 3', 'person' : {'name': 'Teresa'}},
          {'id': 4, 'name': 'Parcela 4', 'person' : null},
        ]
      });
  }

  presentPopover(event, plot) {
    let popover = this.popoverCtrl.create(QuickPlotsMenu, {plot: plot});
    popover.present({
      ev: event
    });
  }

}
