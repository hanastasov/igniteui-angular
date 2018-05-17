import {
    AfterContentInit,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    HostBinding,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Optional,
    Output,
    Renderer,
    SimpleChange,
    TemplateRef,
    ViewChild
} from "@angular/core";
import { fromEvent, interval, Observable, Subscription } from "rxjs";
import { debounce } from "rxjs/operators";
import { BaseComponent } from "../core/base";
import { IgxNavigationService, IToggleView } from "../core/navigation";
import { HammerGesturesManager } from "../core/touch";
import { IgxNavDrawerMiniTemplateDirective, IgxNavDrawerTemplateDirective } from "./navigation-drawer.directives";

/**
 * **Ignite UI for Angular Navigation Drawer** -
 * [Documentation](https://www.infragistics.com/products/ignite-ui-angular/angular/components/navdrawer.html)
 *
 * The Ignite UI Navigation Drawer is a collapsible side navigation container commonly used in combination with the Navbar.
 *
 * Example:
 * ```html
 * <igx-nav-drawer id="navigation" [isOpen]="true">
 *   <ng-template igxDrawer>
 *     <nav>
 *       <span igxDrawerItem [isHeader]="true">Email</span>
 *       <span igxDrawerItem igxRipple>Inbox</span>
 *       <span igxDrawerItem igxRipple>Deleted</span>
 *       <span igxDrawerItem igxRipple>Sent</span>
 *     </nav>
 *   </ng-template>
 * </igx-nav-drawer>
 * ```
 */
let NEXT_ID = 0;
@Component({
    providers: [HammerGesturesManager],
    selector: "igx-nav-drawer",
    templateUrl: "navigation-drawer.component.html"
})
export class IgxNavigationDrawerComponent implements
    IToggleView,
    OnInit,
    AfterContentInit,
    OnDestroy,
    OnChanges {

    @HostBinding("class") public cssClass = "igx-nav-drawer";

    /** ID of the component */
    @HostBinding("attr.id")
    @Input() public id = `igx-nav-drawer-${NEXT_ID++}`;

    /**
     * Position of the Navigation Drawer. Can be "left"(default) or "right". Only has effect when not pinned.
     */
    @Input() public position = "left";

    /**
     * Enables the use of touch gestures to manipulate the drawer - such as swipe/pan from edge to open,
     * swipe toggle and pan drag.
     */
    @Input() public enableGestures = true;

    /** State of the drawer. */
    @Input() public isOpen = false;

    /** When pinned the drawer is relatively positioned instead of sitting above content. May require additional layout styling. */
    @Input() public pin = false;

    /**
     * Minimum device width required for automatic pin to be toggled.
     * Default is 1024, can be set to a falsy value to disable this behavior.
     */
    @Input() public pinThreshold = 1024;

    /**
     * Returns nativeElement of the component.
     */
    get element() {
        return this.elementRef.nativeElement;
    }

    /**
     * Width of the drawer in its open state. Defaults to "280px".
     */
    @Input() public width = "280px";

    /**
     * Width of the drawer in its mini state. Defaults to 60px.
     */
    @Input() public miniWidth = "60px";

    /** Pinned state change output for two-way binding  */
    @Output() public pinChange = new EventEmitter<boolean>(true);
    /** Event fired as the Navigation Drawer is about to open. */
    @Output() public opening = new EventEmitter();
    /** Event fired when the Navigation Drawer has opened. */
    @Output() public opened = new EventEmitter();
    /** Event fired as the Navigation Drawer is about to close. */
    @Output() public closing = new EventEmitter();
    /** Event fired when the Navigation Drawer has closed. */
    @Output() public closed = new EventEmitter();

    get template() {
        if (this.miniTemplate && !this.isOpen) {
            return this.miniTemplate.template;
        } else if (this.contentTemplate) {
            return this.contentTemplate.template;
        }
    }

    private _miniTemplate: IgxNavDrawerMiniTemplateDirective;
    public get miniTemplate(): IgxNavDrawerMiniTemplateDirective {
        return this._miniTemplate;
    }
    @ContentChild(IgxNavDrawerMiniTemplateDirective, { read: IgxNavDrawerMiniTemplateDirective })
    public set miniTemplate(v: IgxNavDrawerMiniTemplateDirective) {
        if (!this.isOpen) {
            this.setDrawerWidth(v ? this.miniWidth : "");
        }
        this._miniTemplate = v;
    }

    @ContentChild(IgxNavDrawerTemplateDirective, { read: IgxNavDrawerTemplateDirective })
    protected contentTemplate: IgxNavDrawerTemplateDirective;

    @HostBinding("style.flexBasis")
    get flexWidth() {
        if (!this.pin) {
            return "0px";
        }
        if (this.isOpen) {
            return this.width;
        }
        if (this.miniTemplate && this.miniWidth) {
            return this.miniWidth;
        }

        return "0px";
    }

    private _gesturesAttached = false;
    private _widthCache: { width: number, miniWidth: number } = { width: null, miniWidth: null };
    private _resizeObserver: Subscription;
    private css: { [name: string]: string; } = {
        drawer: "igx-nav-drawer__aside",
        mini: "igx-nav-drawer__aside--mini",
        overlay: "igx-nav-drawer__overlay",
        styleDummy: "igx-nav-drawer__style-dummy"
    };

    @ViewChild("aside") private _drawer: ElementRef;
    @ViewChild("overlay") private _overlay: ElementRef;
    @ViewChild("dummy") private _styleDummy: ElementRef;

    get drawer() {
        return this._drawer.nativeElement;
    }

    get overlay() {
        return this._overlay.nativeElement;
    }

    get styleDummy() {
        return this._styleDummy.nativeElement;
    }

    /** Pan animation properties */
    private _panning = false;
    private _panStartWidth: number;
    private _panLimit: number;
    private _previousDeltaX: number;

    /**
     * Property to decide whether to change width or translate the drawer from pan gesture.
     */
    public get hasAnimateWidth(): boolean {
        return this.pin || !!this.miniTemplate;
    }

    private _maxEdgeZone = 50;
    /**
     * Used for touch gestures (swipe and pan).
     * Defaults to 50 (in px) and is extended to at least 110% of the mini template width if available.
     * @protected set method
     */
    public get maxEdgeZone() {
        return this._maxEdgeZone;
    }

    /**
     * Get the Drawer width for specific state. Will attempt to evaluate requested state and cache.
     */
    public get expectedWidth() {
        return this.getExpectedWidth(false);
    }

    /**
     * Get the Drawer mini width for specific state. Will attempt to evaluate requested state and cache.
     */
    public get expectedMiniWidth() {
        return this.getExpectedWidth(true);
    }

    public get touchManager() {
        return this._touchManager;
    }

    /**
     * Exposes optional navigation service
     */
    public get state() {
        return this._state;
    }

    constructor(
        @Inject(ElementRef) private elementRef: ElementRef,
        @Optional() private _state: IgxNavigationService,
        // private animate: AnimationBuilder, TODO
        protected renderer: Renderer,
        private _touchManager: HammerGesturesManager) {
    }

    public ngOnInit() {
        // DOM and @Input()-s initialized
        if (this._state) {
            this._state.add(this.id, this);
        }
        if (this.isOpen) {
            this.setDrawerWidth(this.width);
        }
    }

    public ngAfterContentInit() {
        // wait for template and ng-content to be ready
        this.updateEdgeZone();
        this.checkPinThreshold();

        // need to set height without absolute positioning
        this.ensureDrawerHeight();
        this.ensureEvents();

        // TODO: apply platform-safe Ruler from http://plnkr.co/edit/81nWDyreYMzkunihfRgX?p=preview
        // (https://github.com/angular/angular/issues/6515), blocked by https://github.com/angular/angular/issues/6904
    }

    public ngOnDestroy() {
        this._touchManager.destroy();
        if (this._state) {
            this._state.remove(this.id);
        }
        if (this._resizeObserver) {
            this._resizeObserver.unsubscribe();
        }
    }

    public ngOnChanges(changes: { [propName: string]: SimpleChange }) {
        // simple settings can come from attribute set (rather than binding), make sure boolean props are converted
        if (changes.enableGestures && changes.enableGestures.currentValue !== undefined) {
            this.enableGestures = !!(this.enableGestures && this.enableGestures.toString() === "true");
            this.ensureEvents();
        }
        if (changes.pin && changes.pin.currentValue !== undefined) {
            this.pin = !!(this.pin && this.pin.toString() === "true");
            this.ensureDrawerHeight();
            if (this.pin) {
                this._touchManager.destroy();
                this._gesturesAttached = false;
            } else {
                this.ensureEvents();
            }
        }

        if (changes.pinThreshold) {
            if (this.pinThreshold) {
                this.ensureEvents();
                this.checkPinThreshold();
            } else if (this._resizeObserver) {
                this._resizeObserver.unsubscribe();
                this._resizeObserver = null;
            }
        }

        if (changes.width && this.isOpen) {
            this.setDrawerWidth(changes.width.currentValue);
        }

        if (changes.miniWidth) {
            if (!this.isOpen) {
                this.setDrawerWidth(changes.miniWidth.currentValue);
            }
            this.updateEdgeZone();
        }
    }

    /**
     * Toggle the open state of the Navigation Drawer.
     * @param fireEvents Optional flag determining whether events should be fired or not.
     */
    public toggle(fireEvents?: boolean) {
        if (this.isOpen) {
            this.close(fireEvents);
        } else {
            this.open(fireEvents);
        }
    }

    /**
     * Open the Navigation Drawer. Has no effect if already opened.
     * @param fireEvents Optional flag determining whether events should be fired or not.
     */
    public open(fireEvents?: boolean) {
        if (this._panning) {
            this.resetPan();
        }
        if (this.isOpen) {
            return;
        }
        if (fireEvents) {
            this.opening.emit();
        }
        this.isOpen = true;

        // TODO: Switch to animate API when available
        // var animationCss = this.animate.css();
        //     animationCss
        //         .setStyles({'width':'50px'}, {'width':'400px'})
        //         .start(this.elementRef.nativeElement)
        //         .onComplete(() => animationCss.setToStyles({'width':'auto'}).start(this.elementRef.nativeElement));

        this.elementRef.nativeElement.addEventListener("transitionend", this.toggleOpenedEvent, false);
        this.setDrawerWidth(this.width);
    }

    /**
     * Close the Navigation Drawer. Has no effect if already closed.
     * @param fireEvents Optional flag determining whether events should be fired or not.
     */
    public close(fireEvents?: boolean) {
        if (this._panning) {
            this.resetPan();
        }
        if (!this.isOpen) {
            return;
        }
        if (fireEvents) {
            this.closing.emit();
        }

        this.isOpen = false;
        this.setDrawerWidth(this.miniTemplate ? this.miniWidth : "");
        this.elementRef.nativeElement.addEventListener("transitionend", this.toggleClosedEvent, false);
    }

    protected set_maxEdgeZone(value: number) {
        this._maxEdgeZone = value;
    }

    protected ensureDrawerHeight() {
        if (this.pin) {
            // TODO: nested in content?
            // setElementStyle warning https://github.com/angular/angular/issues/6563
            this.renderer.setElementStyle(this.drawer, "height", window.innerHeight + "px");
        }
    }

    /**
     * Get the Drawer width for specific state. Will attempt to evaluate requested state and cache.
     * @param mini Request mini width instead
     */
    protected getExpectedWidth(mini?: boolean): number {
        if (mini) {
            if (!this.miniTemplate) {
                return 0;
            }
            if (this.miniWidth) {
                return parseFloat(this.miniWidth);
            } else {
                // if (!this.isOpen) { // This WON'T work due to transition timings...
                //     return this.elementRef.nativeElement.children[1].offsetWidth;
                // } else {
                if (this._widthCache.miniWidth === null) {
                    // force class for width calc. TODO?
                    this.renderer.setElementClass(this.styleDummy, this.css.drawer, true);
                    this.renderer.setElementClass(this.styleDummy, this.css.mini, true);
                    this._widthCache.miniWidth = this.styleDummy.offsetWidth;
                    this.renderer.setElementClass(this.styleDummy, this.css.drawer, false);
                    this.renderer.setElementClass(this.styleDummy, this.css.mini, false);
                }
                return this._widthCache.miniWidth;
            }
        } else {
            if (this.width) {
                return parseFloat(this.width);
            } else {
                if (this._widthCache.width === null) {
                    // force class for width calc. TODO?
                    this.renderer.setElementClass(this.styleDummy, this.css.drawer, true);
                    this._widthCache.width = this.styleDummy.offsetWidth;
                    this.renderer.setElementClass(this.styleDummy, this.css.drawer, false);
                }
                return this._widthCache.width;
            }
        }
    }

    private getWindowWidth() {
        return (window.innerWidth > 0) ? window.innerWidth : screen.width;
    }

    /**
     * Sets the drawer width.
     * @param width Width to set, must be valid CSS size string.
     */
    private setDrawerWidth(width: string) {
        window.requestAnimationFrame(() => {
            if (this.drawer) {
                this.renderer.setElementStyle(this.drawer, "width", width);
            }
        });
    }

    /**
     * Get current Drawer width.
     */
    private getDrawerWidth(): number {
        return this.drawer.offsetWidth;
    }

    private ensureEvents() {
        // set listeners for swipe/pan only if needed, but just once
        if (this.enableGestures && !this.pin && !this._gesturesAttached) {
            // Built-in manager handler(L20887) causes endless loop and max stack exception.
            // https://github.com/angular/angular/issues/6993
            // Use ours for now (until beta.10):
            // this.renderer.listen(document, "swipe", this.swipe);
            this._touchManager.addGlobalEventListener("document", "swipe", this.swipe);
            this._gesturesAttached = true;

            // this.renderer.listen(document, "panstart", this.panstart);
            // this.renderer.listen(document, "pan", this.pan);
            this._touchManager.addGlobalEventListener("document", "panstart", this.panstart);
            this._touchManager.addGlobalEventListener("document", "panmove", this.pan);
            this._touchManager.addGlobalEventListener("document", "panend", this.panEnd);
        }
        if (this.pinThreshold && !this._resizeObserver) {
            this._resizeObserver = fromEvent(window, "resize").pipe(debounce(() => interval(150)))
                .subscribe((value) => { this.checkPinThreshold(); });
        }
    }

    private updateEdgeZone() {
        let maxValue;

        if (this.miniTemplate) {
            maxValue = Math.max(this._maxEdgeZone, this.getExpectedWidth(true) * 1.1);
            this.set_maxEdgeZone(maxValue);
        }
    }

    private checkPinThreshold = (evt?: Event) => {
        let windowWidth;
        if (this.pinThreshold) {
            windowWidth = this.getWindowWidth();
            if (!this.pin && windowWidth >= this.pinThreshold) {
                this.pin = true;
                this.pinChange.emit(true);
            } else if (this.pin && windowWidth < this.pinThreshold) {
                this.pin = false;
                this.pinChange.emit(false);
            }
        }
    }

    private swipe = (evt: HammerInput) => {
        // TODO: Could also force input type: http://stackoverflow.com/a/27108052
        if (!this.enableGestures || evt.pointerType !== "touch") {
            return;
        }

        // HammerJS swipe is horizontal-only by default, don't check deltaY
        let deltaX;
        let startPosition;
        if (this.position === "right") {
            // when on the right use inverse of deltaX
            deltaX = -evt.deltaX;
            startPosition = this.getWindowWidth() - (evt.center.x + evt.distance);
        } else {
            deltaX = evt.deltaX;
            startPosition = evt.center.x - evt.distance;
        }
        // only accept closing swipe (ignoring minEdgeZone) when the drawer is expanded:
        if ((this.isOpen && deltaX < 0) ||
            // positive deltaX from the edge:
            (deltaX > 0 && startPosition < this.maxEdgeZone)) {
            this.toggle(true);
        }
    }

    private panstart = (evt: HammerInput) => { // TODO: test code
        if (!this.enableGestures || this.pin || evt.pointerType !== "touch") {
            return;
        }
        const startPosition = this.position === "right" ? this.getWindowWidth() - (evt.center.x + evt.distance)
            : evt.center.x - evt.distance;

        // cache width during animation, flag to allow further handling
        if (this.isOpen || (startPosition < this.maxEdgeZone)) {
            this._panning = true;
            this._panStartWidth = this.getExpectedWidth(!this.isOpen);
            this._panLimit = this.getExpectedWidth(this.isOpen);

            this.renderer.setElementClass(this.overlay, "panning", true);
            this.renderer.setElementClass(this.drawer, "panning", true);
        }
    }

    private pan = (evt: HammerInput) => {
        // TODO: input.deltaX = prevDelta.x + (center.x - offset.x);
        // get actual delta (not total session one) from event?
        // pan WILL also fire after a full swipe, only resize on flag
        if (!this._panning) {
            return;
        }
        const right: boolean = this.position === "right";
        // when on the right use inverse of deltaX
        const deltaX = right ? -evt.deltaX : evt.deltaX;
        let visibleWidth;
        let newX;
        let percent;

        visibleWidth = this._panStartWidth + deltaX;

        if (this.isOpen && deltaX < 0) {
            // when visibleWidth hits limit - stop animating
            if (visibleWidth <= this._panLimit) {
                return;
            }

            if (this.hasAnimateWidth) {
                percent = (visibleWidth - this._panLimit) / (this._panStartWidth - this._panLimit);
                newX = visibleWidth;
            } else {
                percent = visibleWidth / this._panStartWidth;
                newX = evt.deltaX;
            }
            this.setXSize(newX, percent.toPrecision(2));

        } else if (!this.isOpen && deltaX > 0) {
            // when visibleWidth hits limit - stop animating
            if (visibleWidth >= this._panLimit) {
                return;
            }

            if (this.hasAnimateWidth) {
                percent = (visibleWidth - this._panStartWidth) / (this._panLimit - this._panStartWidth);
                newX = visibleWidth;
            } else {
                percent = visibleWidth / this._panLimit;
                newX = (this._panLimit - visibleWidth) * (right ? 1 : -1);
            }
            this.setXSize(newX, percent.toPrecision(2));
        }
    }

    private panEnd = (evt: HammerInput) => {
        if (this._panning) {
            const deltaX = this.position === "right" ? -evt.deltaX : evt.deltaX;
            const visibleWidth: number = this._panStartWidth + deltaX;
            this.resetPan();

            // check if pan brought the drawer to 50%
            if (this.isOpen && visibleWidth <= this._panStartWidth / 2) {
                this.close(true);
            } else if (!this.isOpen && visibleWidth >= this._panLimit / 2) {
                this.open(true);
            }
            this._panStartWidth = null;
        }
    }

    private resetPan() {
        this._panning = false;
        /* styles fail to apply when set on parent due to extra attributes, prob ng bug */
        this.renderer.setElementClass(this.overlay, "panning", false);
        this.renderer.setElementClass(this.drawer, "panning", false);
        this.setXSize(0, "");
    }

    /**
     * Sets the absolute position or width in case the drawer doesn't change position.
     * @param x the number pixels to translate on the X axis or the width to set. 0 width will clear the style instead.
     * @param opacity optional value to apply to the overlay
     */
    private setXSize(x: number, opacity?: string) {
        // Angular polyfills patches window.requestAnimationFrame, but switch to DomAdapter API (TODO)
        window.requestAnimationFrame(() => {
            if (this.hasAnimateWidth) {
                this.renderer.setElementStyle(this.drawer, "width", x ? Math.abs(x) + "px" : "");
            } else {
                this.renderer.setElementStyle(this.drawer, "transform", x ? "translate3d(" + x + "px,0,0)" : "");
                this.renderer.setElementStyle(this.drawer, "-webkit-transform",
                    x ? "translate3d(" + x + "px,0,0)" : "");
            }
            if (opacity !== undefined) {
                this.renderer.setElementStyle(this.overlay, "opacity", opacity);
            }
        });
    }

    private toggleOpenedEvent = (evt?, fireEvents?) => {
        this.elementRef.nativeElement.removeEventListener("transitionend", this.toggleOpenedEvent, false);
        this.opened.emit();
    }

    private toggleClosedEvent = (evt?) => {
        this.elementRef.nativeElement.removeEventListener("transitionend", this.toggleClosedEvent, false);
        this.closed.emit();
    }
}
