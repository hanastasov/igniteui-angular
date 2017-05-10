import {CommonModule} from "@angular/common";
import {
    Directive,
    DoCheck,
    ElementRef,
    HostBinding,
    HostListener,
    NgModule
} from "@angular/core";

@Directive({
    selector: "[igxInput]",
    // host: {
    //     '[class.igx-form-group__input]': 'true',
    //     '[class.igx-form-group__input--filled]': 'filled',
    //     '[class.igx-form-group__input--focused]': 'focused',
    //     '[class.igx-form-group__input--placeholder]': 'placeholder'
    // }
})
export class IgxInputClass implements DoCheck {

    @HostBinding("class.igx-form-group__input")
    isInput: boolean = true;

    @HostBinding("class.igx-form-group__input--focused")
    focused: boolean = false;

    @HostBinding("class.igx-form-group__input--filled")
    filled: boolean = false;
    @HostBinding("class.igx-form-group__input--placeholder")
    placeholder: boolean = false;

    constructor(protected el: ElementRef) {}

    @HostListener("focus", ["$event"])
    onFocus(event) {
        this.focused = true;
    }

    @HostListener("blur", ["$event"])
    onBlur(event) {
        this.focused = false;
    }

    ngDoCheck() {
        const value = this.el.nativeElement.value;

        this.filled = value && (value !== "");
        this.placeholder = this.el.nativeElement.getAttribute("placeholder") && !this.filled;
    }
}

@NgModule({
    imports: [CommonModule],
    declarations: [IgxInputClass],
    exports: [IgxInputClass]
})
export class IgxInput {}
