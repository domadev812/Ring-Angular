import { Directive, Input, Output, HostListener, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appMouseWheel]'
})
export class MouseWheelDirective {
  @Input() scrollClass: string;

  @HostListener('mousewheel', ['$event']) onMouseWheel(event: any) {
    this.mouseWheelFunc(event);
  }

  mouseWheelFunc(event: any) {
    event = window.event || event;
    let scrollUpOrDown = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
    let scrollArea = document.getElementsByClassName(this.scrollClass);
    if (scrollUpOrDown > 0) {
      if (scrollArea[0].scrollTop === 0) {
        window.scroll({
          top: 0,
          behavior: 'smooth'
        });
      }
      scrollArea[0].scrollTop = scrollArea[0].scrollTop - 40;
    } else if (scrollUpOrDown < 0) {
      if (scrollArea[0].scrollTop === 0) {
        window.scroll({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
      }
      scrollArea[0].scrollTop = scrollArea[0].scrollTop + 40;
    }
    event.returnValue = false;
    if (event.preventDefault) {
      event.preventDefault();
    }
  }
}
