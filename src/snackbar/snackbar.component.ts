import {
    animate,
    AnimationEvent,
    state,
    style,
    transition,
    trigger,
    useAnimation
} from "@angular/animations";
import { CommonModule } from "@angular/common";
import {
    Component,
    EventEmitter,
    HostBinding,
    Input,
    NgModule,
    NgZone,
    Output
} from "@angular/core";
import { fadeIn, fadeOut, slideInBottom, slideOutBottom } from "../animations/main";
/**
 * **Ignite UI for Angular Snackbar** -
 * [Documentation](https://www.infragistics.com/products/ignite-ui-angular/angular/components/snackbar.html)
 *
 * The Ignite UI Snack Bar provides feedback about an operation with a single-line message, which can
 * include a link to an action such as Undo.
 *
 * Example:
 * ```html
 * <button (click)="snackbar.show()">Send message</button>
 * <div>
 *   <igx-snackbar #snackbar message="Message sent">
 *   </igx-snackbar>
 * </div>
 * ```
 */
let NEXT_ID = 0;
@Component({
    animations: [
        trigger("slideInOut", [
            transition("void => *", [
                useAnimation(slideInBottom, {
                    params: {
                        duration: ".35s",
                        easing: "cubic-bezier(0.0, 0.0, 0.2, 1)",
                        fromPosition: "translateY(100%)",
                        toPosition: "translateY(0)"
                    }
                })
            ]),
            transition("* => void", [
                useAnimation(slideOutBottom, {
                    params: {
                        duration: ".2s",
                        easing: "cubic-bezier(0.4, 0.0, 1, 1)",
                        fromPosition: "translateY(0)",
                        toOpacity: 1,
                        toPosition: "translateY(100%)"
                    }
                })
            ])
        ]),
        trigger("fadeInOut", [
            transition("void => *", [
                useAnimation(fadeIn, {
                    params: {
                        duration: ".35s",
                        easing: "ease-out"
                    }
                })
            ]),
            transition("* => void", [
                useAnimation(fadeOut, {
                    params: {
                        duration: ".2s",
                        easing: "ease-out"
                    }
                })
            ])
        ])
    ],
    selector: "igx-snackbar",
    templateUrl: "snackbar.component.html"
})
export class IgxSnackbarComponent {

    /** ID of the component */
    @HostBinding("attr.id")
    @Input()
    public id = `igx-snackbar-${NEXT_ID++}`;
    /**
     * The message that will be shown message by the IgxSnackbar component
     * @type {string}
     */
    @Input() public message: string;

    /**
     * The IgxSnackbar component visual state state
     * @type {boolean}
     */
    @Input() public isVisible = false;

    /**
     * Sets if the IgxSnackbar component will be hidden after shown
     * Default value is true
     * @type {number}
     */
    @Input() public autoHide = true;

    /**
     * The duration of time span in ms which the IgxSnackbar component will be visible
     * after it is being shown.
     * Default value is 4000
     * @type {number}
     */
    @Input() public displayTime = 4000;

    /**
     * The text of the IgxSnackbar component action
     * @type {string}
     */
    @Input() public actionText?: string;

    /**
     * The event that will be thrown when the action is executed,
     * provides reference to the IgxSnackbar component as argument
     * @type {EventEmitter}
     */
    @Output() public onAction = new EventEmitter<IgxSnackbarComponent>();

    /**
     * The event that will be thrown when the snackbar animation starts
     * @type {EventEmitter<AnimationEvent>}
     */
    @Output() public animationStarted = new EventEmitter<AnimationEvent>();

    /**
     * The event that will be thrown when the snackbar animation ends
     * @type {EventEmitter<AnimationEvent>}
     */
    @Output() public animationDone = new EventEmitter<AnimationEvent>();

    private timeoutId;

    constructor(private zone: NgZone) { }

    /**
     * Shows the IgxSnackbar component and hides it after some time span
     * if autoHide is enabled
     */
    public show(): void {
        clearTimeout(this.timeoutId);
        setTimeout(this.timeoutId);
        this.isVisible = true;

        if (this.autoHide) {
            this.timeoutId = setTimeout(() => {
                this.hide();
            }, this.displayTime);
        }
    }

    /**
     * Hides the IgxSnackbar component
     */
    public hide(): void {
        this.isVisible = false;
        clearTimeout(this.timeoutId);
    }

    public triggerAction(): void {
        this.onAction.emit(this);
    }

    public snackbarAnimationStarted(evt: AnimationEvent): void {
        if (evt.fromState === "void") {
            this.animationStarted.emit(evt);
        }
    }

    public snackbarAnimationDone(evt: AnimationEvent): void {
        if (evt.fromState === "show") {
            this.animationDone.emit(evt);
        }
    }
}

@NgModule({
    declarations: [IgxSnackbarComponent],
    exports: [IgxSnackbarComponent],
    imports: [CommonModule]
})
export class IgxSnackbarModule { }
