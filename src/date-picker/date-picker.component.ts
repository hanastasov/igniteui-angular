import { CommonModule } from "@angular/common";
import {
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    ContentChild,
    EventEmitter,
    HostBinding,
    Input,
    NgModule,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    ViewContainerRef
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import {
    IgxCalendarComponent,
    IgxCalendarHeaderTemplateDirective,
    IgxCalendarModule,
    IgxCalendarSubheaderTemplateDirective,
    WEEKDAYS
} from "../calendar";
import { IgxDialogComponent, IgxDialogModule } from "../dialog/dialog.component";
import { IgxIconModule } from "../icon";
import { IgxInputGroupModule } from "../input-group/input-group.component";

let NEXT_ID = 0;
/**
 * **Ignite UI for Angular Date Picker** -
 * [Documentation](https://www.infragistics.com/products/ignite-ui-angular/angular/components/date_picker.html)
 *
 * The Ignite UI Date Picker displays a popup calendar that lets users select a single date.
 *
 * Example:
 * ```html
 * <igx-datePicker [(ngModel)]="selectedDate"></igx-datePicker>
 * ```
 */
@Component({
    providers:
        [{ provide: NG_VALUE_ACCESSOR, useExisting: IgxDatePickerComponent, multi: true }],
    // tslint:disable-next-line:component-selector
    selector: "igx-datePicker",
    templateUrl: "date-picker.component.html"
})
export class IgxDatePickerComponent implements ControlValueAccessor, OnInit, OnDestroy {

    @HostBinding("attr.id")
    @Input()
    public id = `igx-datePicker-${NEXT_ID++}`;
    // Custom formatter function
    @Input() public formatter: (val: Date) => string;

    @Input() public isDisabled: boolean;

    @Input() public value: Date;

    /**
     * Propagate calendar properties.
     */
    @Input() public locale: string = Constants.DEFAULT_LOCALE_DATE;

    @Input() public weekStart: WEEKDAYS | number = WEEKDAYS.SUNDAY;

    @Input()
    public get formatOptions(): object {
        return this._formatOptions;
    }
    public set formatOptions(formatOptions: object) {
        this._formatOptions = Object.assign(this._formatOptions, formatOptions);
    }

    @Input()
    public get formatViews(): object {
        return this._formatViews;
    }
    public set formatViews(formatViews: object) {
        this._formatViews = Object.assign(this._formatViews, formatViews);
    }

    @Input()
    public vertical = false;

    /**
     * Propagate dialog properties.
     */
    @Input() public todayButtonLabel: string;

    @Input() public cancelButtonLabel: string;

    @Output() public onOpen = new EventEmitter<IgxDatePickerComponent>();

    @Output() public onClose = new EventEmitter<IgxDatePickerComponent>();
    /**
     * Propagate clanedar events.
     */
    @Output() public onSelection = new EventEmitter<Date>();

    public get displayData() {
        if (this.value) {
            return this._customFormatChecker(this.formatter, this.value);
        }

        return "";
    }

    @ContentChild(IgxCalendarHeaderTemplateDirective, { read: IgxCalendarHeaderTemplateDirective })
    public headerTemplate: IgxCalendarHeaderTemplateDirective;

    @ContentChild(IgxCalendarSubheaderTemplateDirective, { read: IgxCalendarSubheaderTemplateDirective })
    public subheaderTemplate: IgxCalendarSubheaderTemplateDirective;

    @ViewChild("container", { read: ViewContainerRef })
    public container: ViewContainerRef;

    @ViewChild(IgxDialogComponent)
    public alert: IgxDialogComponent;

    public calendarRef: ComponentRef<IgxCalendarComponent>;

    public get calendar() {
        return this.calendarRef.instance;
    }

    private _formatOptions = {
        day: "numeric",
        month: "short",
        weekday: "short",
        year: "numeric"
    };
    private _formatViews = {
        day: false,
        month: true,
        year: false
    };

    constructor(private resolver: ComponentFactoryResolver) { }

    public writeValue(value: Date) {
        this.value = value;
    }

    public registerOnChange(fn: (_: Date) => void) { this._onChangeCallback = fn; }

    public registerOnTouched(fn: () => void) { this._onTouchedCallback = fn; }

    public ngOnInit(): void {
        /**
         * If we have passed value from user, update @calendar.value and @calendar.viewDate.
         */
        this.alert.onOpen.subscribe((ev) => this._focusTheDialog());
        this.alert.onClose.subscribe((ev) => this.handleDialogCloseAction());
    }

    public ngOnDestroy(): void {
        this.alert.onClose.unsubscribe();
        this.alert.onOpen.unsubscribe();
    }

    /**
     * Selects today's date from calendar and change the input field value, @calendar.viewDate and @calendar.value.
     */
    public triggerTodaySelection() {
        const today = new Date(Date.now());
        this.handleSelection(today);
    }

    /**
     * Change the calendar slection and calling this method will emit the @calendar.onSelection event,
     * which will fire @handleSelection method.
     * @param date passed date that has to be set to the calendar.
     */
    public selectDate(date: Date) {
        this.value = date;
        this.onSelection.emit(date);
    }

    /**
     * Emits the open event and update the calendar.
     *
     * @hidden
     */
    public onOpenEvent(event): void {
        const factory = this.resolver.resolveComponentFactory(IgxCalendarComponent);

        this.calendarRef = this.container.createComponent(factory);

        this.calendarRef.changeDetectorRef.detach();
        this.updateCalendarInstance();
        this.calendarRef.location.nativeElement.classList.add("igx-date-picker__date--opened");
        this.calendarRef.changeDetectorRef.reattach();

        this.alert.open();
        this._onTouchedCallback();
        this.onOpen.emit(this);
    }

    /**
     * Closes the dialog, after was clearing all calendar items from dom.
     */
    public handleDialogCloseAction() {
        this.onClose.emit(this);
        setTimeout(() => this.calendarRef.destroy(), 350);
    }

    /**
     * Evaluates when @calendar.onSelection event was fired
     * and update the input value.
     *
     * @param event selected value from calendar.
     */
    public handleSelection(event) {
        this.value = event;
        this.calendar.viewDate = event;
        this._onChangeCallback(event);
        this.alert.close();
        this.onSelection.emit(event);
    }

    private updateCalendarInstance() {
        this.calendar.formatOptions = this._formatOptions;
        this.calendar.formatViews = this._formatViews;
        this.calendar.locale = this.locale;
        this.calendar.vertical = this.vertical;

        if (this.headerTemplate) {
            this.calendar.headerTemplate = this.headerTemplate;
        }

        if (this.subheaderTemplate) {
            this.calendar.subheaderTemplate = this.subheaderTemplate;
        }

        if (this.value) {
            this.calendar.value = this.value;
            this.calendar.viewDate = this.value;
        }
        this.calendar.weekStart = this.weekStart;
        this.calendar.onSelection.subscribe((ev) => this.handleSelection(ev));
    }

    // Focus the dialog element, after its appearence into DOM.
    private _focusTheDialog() {
        requestAnimationFrame(() => this.alert.element.focus());
    }

    private _setLocaleToDate(value: Date, locale: string = Constants.DEFAULT_LOCALE_DATE): string {
        return value.toLocaleDateString(locale);
    }

    /**
     * Apply custom user formatter upon date.
     * @param formatter custom formatter function.
     * @param date passed date
     */
    private _customFormatChecker(formatter: (_: Date) => string, date: Date) {
        return this.formatter ? this.formatter(date) : this._setLocaleToDate(date, this.locale);
    }

    private _onTouchedCallback: () => void = () => { };

    private _onChangeCallback: (_: Date) => void = () => { };
}

class Constants {
    public static readonly DEFAULT_LOCALE_DATE = "en";
}

@NgModule({
    declarations: [IgxDatePickerComponent],
    entryComponents: [IgxCalendarComponent],
    exports: [IgxDatePickerComponent],
    imports: [CommonModule, IgxIconModule, IgxInputGroupModule, IgxDialogModule, IgxCalendarModule]
})
export class IgxDatePickerModule { }
