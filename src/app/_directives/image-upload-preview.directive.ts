import { Directive, ElementRef, Input, SimpleChanges, OnChanges } from '@angular/core';

@Directive({ selector: 'appImg[imgPreview]' })

export class ImagePreviewDirective implements OnChanges { 
    @Input() image;

    constructor(private el: ElementRef ) { }

    ngOnChanges(changes: SimpleChanges) {

        let reader = new FileReader();
        let el = this.el;

        reader.onloadend = function (e) {
            el.nativeElement.src = reader.result;
        };

        if (this.image) {
            return reader.readAsDataURL(this.image);
        }

    }

}