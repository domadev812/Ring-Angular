import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollerDirective } from './_directives/infinite-scroll.directive';
import { ImagePreviewDirective } from './_directives/image-upload-preview.directive';


@NgModule({
  declarations: [
    InfiniteScrollerDirective,
    ImagePreviewDirective
  ],
  imports: [
  ],
  providers: [
  ],
  exports: [
    InfiniteScrollerDirective,
    ImagePreviewDirective
  ]
})
export class SharedModule { }
