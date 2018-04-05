import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollerDirective } from './_directives/infinite-scroll.directive';
import { ImagePreviewDirective } from './_directives/image-upload-preview.directive';
import { DetectClickDirective } from './_directives/detect-click.directive';
import { MouseWheelDirective } from './_directives/mousewheel.directive';


@NgModule({
  declarations: [
    InfiniteScrollerDirective,
    ImagePreviewDirective,
    DetectClickDirective,
    MouseWheelDirective
  ],
  imports: [
  ],
  providers: [
  ],
  exports: [
    InfiniteScrollerDirective,
    ImagePreviewDirective,
    DetectClickDirective,
    MouseWheelDirective
  ]
})
export class SharedModule { }
