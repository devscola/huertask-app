import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { Welcome } from '../welcome/welcome';

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})
export class Tutorial {

  @ViewChild(Slides) slides: Slides;

  pages = [
    {
      image: "https://trello-attachments.s3.amazonaws.com/58a5cc381d43533e38f8b42e/788x1297/bf1d37657fcb392bc60c32d5f95c1312/huertarea-18.jpg.png",
    },
    {
      image: "https://trello-attachments.s3.amazonaws.com/58a5cc381d43533e38f8b42e/788x1293/117ad0179b9f32d1e1f44f1e11b1aa82/huertarea-17.jpg.png",
    },
    {
      image: "https://trello-attachments.s3.amazonaws.com/58a5cc381d43533e38f8b42e/788x1292/02492a8091e192a4fa809663a18aba4e/huertarea-16.jpg.png",
    }
  ];

  constructor(public navCtrl: NavController) {}

  skipTutorial(){
    this.navCtrl.setRoot(Welcome)
  }

  goToNextSlide(){
    this.slides.slideNext()
  }

}
