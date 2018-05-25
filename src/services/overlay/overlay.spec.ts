import {
    Component,
    ElementRef,
    Inject,
    NgModule,
    ViewChild
} from "@angular/core";
import { async, TestBed } from "@angular/core/testing";
import { BrowserModule, By } from "@angular/platform-browser";
import { IgxOverlayService } from "./overlay";

describe("igxOverlay", () => {
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                DynamicModule
            ],
            declarations: [
                EmptyPageComponent
            ],
            providers: [IgxOverlayService]
        }).compileComponents();
    });
    it("Unit - OverlayElement should return a div attached to Document's body", async(() => {
        const fixture = TestBed.createComponent(EmptyPageComponent);
        fixture.detectChanges();

        fixture.componentInstance.buttonElement.nativeElement.click();
        fixture.whenStable().then(() => {
            const overlayDiv = fixture.debugElement.nativeElement.parentElement.lastChild;
            expect(overlayDiv).toBeDefined();
            expect(overlayDiv.classList.contains("overlay")).toBeTruthy();
        });
    }));
});

@Component({
    template: "<button #button (click)='click($event)'>Show Overlay</button>"
})
export class EmptyPageComponent {
    constructor(@Inject(IgxOverlayService) private _overlay: IgxOverlayService) { }

    @ViewChild("button") buttonElement: ElementRef;

    click(event) {
        this._overlay.showComponent(SimpleDynamicComponent);
    }
}

@Component({
    template: "<div style='position: absolute; width:100px; height: 100px; background-color: red'></div>"
})
export class SimpleDynamicComponent { }

const TEST_COMPONENTS = [
    SimpleDynamicComponent
];

@NgModule({
    imports: [BrowserModule],
    declarations: [TEST_COMPONENTS],
    exports: [TEST_COMPONENTS],
    // bootstrap: [TEST_COMPONENTS],
    entryComponents: [TEST_COMPONENTS]
})
export class DynamicModule { }
