import { CommonModule } from "@angular/common";
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    HostBinding, Inject,
    Input, NgModule, Output, QueryList, Renderer2, ViewChildren
} from "@angular/core";
import { IgxButtonDirective, IgxButtonModule } from "../directives/button/button.directive";
import { IgxRippleModule } from "../directives/ripple/ripple.directive";
import { IgxIconModule } from "../icon";

export enum ButtonGroupAlignment { horizontal, vertical }

/**
 * **Ignite UI for Angular Button Group** -
 * [Documentation](https://www.infragistics.com/products/ignite-ui-angular/angular/components/buttongroup.html)
 *
 * The Ignite UI Button Group displays a group of buttons either vertically or horizontally.  The group supports
 * single, multiple and toggle selection.
 *
 * Example:
 * ```html
 * <igx-buttongroup multiSelection="true" [values]="fontOptions">
 * </igx-buttongroup>
 * ```
 * The `fontOptions` value shown above is defined as:
 * ```typescript
 * this.fontOptions = [
 *   { icon: 'format_bold', selected: false },
 *   { icon: 'format_italic', selected: false },
 *   { icon: 'format_underlined', selected: false }];
 * ```
 */
let NEXT_ID = 0;
@Component({
    selector: "igx-buttongroup",
    templateUrl: "buttongroup-content.component.html"
})

export class IgxButtonGroupComponent implements AfterViewInit {
    @ViewChildren(IgxButtonDirective) public buttons: QueryList<IgxButtonGroupComponent>;

    @HostBinding("attr.id")
    @Input()
    public id = `igx-buttongroup-${NEXT_ID++}`;

    @Input() set itemContentCssClass(value: string) {
        this._itemContentCssClass = value || this._itemContentCssClass;
    }
    get itemContentCssClass(): string {
        return this._itemContentCssClass;
    }
    @Input() public multiSelection = false;
    @Input() public values: any;
    @Input() public disabled = false;

    public selectedIndexes: number[] = [];

    @Input() set alignment(value: ButtonGroupAlignment) {
        this._isVertical = value === ButtonGroupAlignment.vertical;
    }
    get alignment(): ButtonGroupAlignment {
        return this._isVertical ? ButtonGroupAlignment.vertical : ButtonGroupAlignment.horizontal;
    }

    @Output() public onSelect = new EventEmitter<IButtonGroupEventArgs>();
    @Output() public onUnselect = new EventEmitter<IButtonGroupEventArgs>();

    public get isVertical(): boolean {
        return this._isVertical;
    }
    private _isVertical: boolean;
    private _itemContentCssClass: string;

    constructor(private _el: ElementRef, private _renderer: Renderer2, cdr: ChangeDetectorRef) {
    }

    get selectedButtons(): IgxButtonGroupComponent[] {
        return this.buttons.filter((b, i) => {
            return this.selectedIndexes.indexOf(i) !== -1;
        });

    }

    public selectButton(index: number) {
        if (this.buttons.toArray()[index]._el.nativeElement.getAttribute("data-togglable") === "false"
            || this.buttons.toArray()[index]._el.nativeElement.classList.contains("igx-button--disabled")) {
            return;
        }
        const buttonElement = this.buttons.toArray()[index]._el.nativeElement;
        this.selectedIndexes.push(index);
        buttonElement.setAttribute("data-selected", true);
        this.onSelect.emit({ button: this.buttons.toArray()[index], index });
        this.values[index].selected = true;

        // deselect other buttons if multiSelection is not enabled
        if (!this.multiSelection && this.selectedIndexes.length > 0) {
            this.buttons.forEach((b, i) => {
                if (i !== index && this.selectedIndexes.indexOf(i) !== -1) {
                    this.deselectButton(i);
                }
            });
        }
    }

    public deselectButton(index: number) {
        if (this.buttons.toArray()[index]._el.nativeElement.getAttribute("data-togglable") === "false"
            || this.buttons.toArray()[index]._el.nativeElement.classList.contains("igx-button--disabled")) {
            return;
        }
        const buttonElement = this.buttons.toArray()[index]._el.nativeElement;
        this.selectedIndexes.splice(this.selectedIndexes.indexOf(index), 1);
        buttonElement.setAttribute("data-selected", false);
        this.onUnselect.emit({ button: this.buttons.toArray()[index], index });
        this.values[index].selected = false;
    }

    public ngAfterViewInit() {
        // initial selection
        setTimeout(() => {
            this.buttons.forEach((button, index) => {
                if (!button.disabled && button._el.nativeElement.getAttribute("data-selected") === "true") {
                    this.selectButton(index);
                }
            });
        }, 0);
    }

    public _clickHandler(event, i) {
        if (this.selectedIndexes.indexOf(i) !== -1) {
            this.deselectButton(i);
        } else {
            this.selectButton(i);
        }
    }
}

export interface IButtonGroupEventArgs {
    button: IgxButtonGroupComponent;
    index: number;
}

@NgModule({
    declarations: [IgxButtonGroupComponent],
    exports: [IgxButtonGroupComponent],
    imports: [IgxButtonModule, CommonModule, IgxRippleModule, IgxIconModule]
})

export class IgxButtonGroupModule {
}
