import { Directive, ElementRef, Input, Renderer } from '@angular/core';

@Directive({
  selector: '[form-action]'
})
export class FormAction {

  constructor(private el: ElementRef, private renderer: Renderer) {

  }

  @Input('form-action') action: string;

}

