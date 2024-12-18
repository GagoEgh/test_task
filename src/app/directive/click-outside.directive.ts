import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[clickOutside]',
    standalone: true
})
export class ClickOutsideDirective {
    @Output() clickOutside = new EventEmitter<void>();
    disabled: boolean = false;
    constructor(private currentElementRef: ElementRef) {}

    @HostListener('document:mouseup', ['$event.target'])
    onClickOutside(targetElement: HTMLElement): void | undefined {
        if (this.disabled || !targetElement) {
            return;
        }

        const clickedInside: boolean = this.currentElementRef.nativeElement.contains(targetElement);
        if (!clickedInside) {
            this.clickOutside.emit();
        }
    }
}
