import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appLazyLoad]',
  standalone: true
})
export class LazyLoadDirective implements AfterViewInit {
  @Input('appLazyLoad') defaultSrc?: string;

  constructor(private el: ElementRef<HTMLImageElement>) {}

  ngAfterViewInit(): void {
    const img = this.el.nativeElement;

    img.setAttribute('loading', 'lazy');

    if (this.defaultSrc) {
      const fallbackSrc = this.defaultSrc;
      img.onerror = () => {
        img.src = fallbackSrc;
      };
    }
  }
}
