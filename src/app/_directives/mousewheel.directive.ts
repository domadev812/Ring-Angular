import { Directive, Output, HostListener, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appMouseWheel]'
})
export class MouseWheelDirective {
  @Output() mouseWheelUp = new EventEmitter();
  @Output() mouseWheelDown = new EventEmitter();

  @HostListener('mousewheel', ['$event']) onMouseWheel(event: any) {
    this.mouseWheelFunc(event);
  }

  mouseWheelFunc(event: any) {
    event = window.event || event;
    let scrollUpOrDown = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
    if (scrollUpOrDown > 0) {
      this.mouseWheelUp.emit(event);
    } else if (scrollUpOrDown < 0) {
      this.mouseWheelDown.emit(event);
    }
    event.returnValue = false;
    if (event.preventDefault) {
      event.preventDefault();
    }
  }
}