import {
    Component,
    Directive,
    EventEmitter,
    forwardRef,
    HostBinding,
    Input,
    NgModule,
    Output,
    Provider,
    ViewChild
} from "@angular/core";
import { CheckboxRequiredValidator, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR } from "@angular/forms";
import { IgxRippleModule } from "../directives/ripple/ripple.directive";

export enum SwitchLabelPosition {
    BEFORE = "before",
    AFTER = "after"
}

export interface IChangeSwitchEventArgs {
    checked: boolean;
    switch: IgxSwitchComponent;
}

const noop = () => { };
let nextId = 0;
/**
 * **Ignite UI for Angular Switch** -
 * [Documentation](https://www.infragistics.com/products/ignite-ui-angular/angular/components/switch.html)
 *
 * The Ignite UI Switch lets the user toggle between on/off or true/false states.
 *
 * Example:
 * ```html
 * <igx-switch [checked]="true">
 *   Simple switch
 * </igx-switch>
 * ```
 */
@Component({
    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: IgxSwitchComponent, multi: true }],
    selector: "igx-switch",
    templateUrl: "switch.component.html"
})
export class IgxSwitchComponent implements ControlValueAccessor {
    protected _value: any;

    @ViewChild("checkbox") public nativeCheckbox;
    @ViewChild("label") public nativeLabel;
    @ViewChild("placeholderLabel") public placeholderLabel;

    /** ID of the component */
    @HostBinding("attr.id")
    @Input() public id = `igx-switch-${nextId++}`;
    @Input() public labelId = `${this.id}-label`;
    @Input() public value: any;
    @Input() public name: string;
    @Input() public tabindex: number = null;
    @Input() public labelPosition: SwitchLabelPosition | string = "after";
    @Input() public disableRipple = false;
    @Input() public required = false;

    @Input("aria-labelledby")
    public ariaLabelledBy = this.labelId;

    @Input("aria-label")
    public ariaLabel: string | null = null;

    @Output()
    readonly change: EventEmitter<IChangeSwitchEventArgs> = new EventEmitter<IChangeSwitchEventArgs>();

    private _onTouchedCallback: () => void = noop;
    private _onChangeCallback: (_: any) => void = noop;

    @HostBinding("class.igx-switch")
    public cssClass = "igx-switch";

    @HostBinding("class.igx-switch--checked")
    @Input() public checked = false;

    @HostBinding("class.igx-switch--disabled")
    @Input() public disabled = false;

    @HostBinding("class.igx-switch--focused")
    public focused = false;

    public inputId = `${this.id}-input`;
    public toggle() {
        if (this.disabled) {
            return;
        }

        this.checked = !this.checked;
        this.focused = false;
        this.change.emit({ checked: this.checked, switch: this });
        this._onChangeCallback(this.checked);
    }

    public _onSwitchChange(event) {
        event.stopPropagation();
    }

    public _onSwitchClick(event) {
        event.stopPropagation();
        this.toggle();
    }

    public _onLabelClick(event) {
        this.toggle();
    }

    public onFocus(event) {
        this.focused = true;
    }

    public onBlur(event) {
        this.focused = false;
        this._onTouchedCallback();
    }

    public writeValue(value) {
        this._value = value;
        this.checked = !!this._value;
    }

    public get labelClass(): string {
        switch (this.labelPosition) {
            case SwitchLabelPosition.BEFORE:
                return `${this.cssClass}__label--before`;
            case SwitchLabelPosition.AFTER:
            default:
                return `${this.cssClass}__label`;
        }
    }

    public registerOnChange(fn: (_: any) => void) { this._onChangeCallback = fn; }
    public registerOnTouched(fn: () => void) { this._onTouchedCallback = fn; }
}

export const IGX_SWITCH_REQUIRED_VALIDATOR: Provider = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => IgxSwitchRequiredDirective),
    multi: true
};

/* tslint:disable directive-selector */
@Directive({
    selector: `igx-switch[required][formControlName],
    igx-switch[required][formControl],
    igx-switch[required][ngModel]`,
    providers: [IGX_SWITCH_REQUIRED_VALIDATOR]
})
export class IgxSwitchRequiredDirective extends CheckboxRequiredValidator { }

@NgModule({
    declarations: [IgxSwitchComponent, IgxSwitchRequiredDirective],
    exports: [IgxSwitchComponent, IgxSwitchRequiredDirective],
    imports: [IgxRippleModule]
})
export class IgxSwitchModule { }
