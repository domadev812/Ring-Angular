import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollerDirective } from './_directives/infinite-scroll.directive';


@NgModule({
  declarations: [
    InfiniteScrollerDirective
  ],
  imports: [
  ],
  providers: [
  ],
  exports: [
    InfiniteScrollerDirective
  ]
})
export class SharedModule { }
