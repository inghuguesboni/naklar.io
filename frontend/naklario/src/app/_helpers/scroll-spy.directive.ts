import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Scroll } from '@angular/router';
import { ScrollPositionService } from '../_services/scroll-position.service';

@Directive({
  selector: '[appScrollSpy]'
})
export class ScrollSpyDirective {
  @Input() public spiedTags = [];
  @Input() public spyBottom = true;
  @Output() public sectionChange = new EventEmitter<string>();
  private currentSection: string;

  constructor(
    private ref: ElementRef,
    private scrollPosition: ScrollPositionService
    ) {
    scrollPosition.onScroll.subscribe((event) => {
      this.onScroll(event);
    });
  }

  onScroll(event) {
    let currentSection: string;
    const scrollTop = event.target.scrollTop;
    const children = this.ref.nativeElement.children;

    const parentOffset = this.spyBottom ? window.innerHeight : 0;
    for (const element of children) {
      if (this.spiedTags.some(spiedTag => spiedTag === element.tagName)) {
        if ((element.offsetTop - parentOffset) <= scrollTop) {

          currentSection = element.id;
        }
      }
    }
    if (currentSection !== this.currentSection) {
      this.currentSection = currentSection;
      this.sectionChange.emit(this.currentSection);
    }
  }
}
