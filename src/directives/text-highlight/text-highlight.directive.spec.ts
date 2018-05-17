import { Component, ElementRef, forwardRef, ViewChild } from "@angular/core";

import {
    async,
    TestBed
} from "@angular/core/testing";

import { By } from "@angular/platform-browser";

import { IgxTextHighlightDirective} from "./text-highlight.directive";

describe("IgxHighlight", () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                IgxTextHighlightDirective,
                HighlightLoremIpsumComponent
            ]
        });
    }));

    it("Highlight inputs should have the proper values", () => {
        const fix = TestBed.createComponent(HighlightLoremIpsumComponent);
        fix.detectChanges();

        const component: HighlightLoremIpsumComponent = fix.debugElement.componentInstance;

        expect(component.highlight.cssClass).toBe("igx-highlight");
        expect(component.highlight.activeCssClass).toBe("igx-highlight__active");
        expect(component.highlight.groupName).toBe("test");
        expect(component.highlight.value).toBe(component.html);
        expect(component.highlight.row).toBe(0);
        expect(component.highlight.column).toBe(0);
        expect(component.highlight.page).toBe(0);
    });

    it("Should highlight all instances of text", () => {
        const fix = TestBed.createComponent(HighlightLoremIpsumComponent);
        fix.detectChanges();

        const component: HighlightLoremIpsumComponent = fix.debugElement.componentInstance;
        let count = component.highlightText("a");
        fix.detectChanges();
        let spans = fix.debugElement.nativeElement.querySelectorAll("." + component.highlightClass);
        expect(spans.length).toBe(4);
        expect(count).toBe(4);

        count = component.highlightText("AM");
        fix.detectChanges();
        spans = fix.debugElement.nativeElement.querySelectorAll("." + component.highlightClass);
        expect(spans.length).toBe(1);
        expect(count).toBe(1);

        count = component.highlightText("amxsxd");
        fix.detectChanges();
        spans = fix.debugElement.nativeElement.querySelectorAll("." + component.highlightClass);
        expect(spans.length).toBe(0);
        expect(count).toBe(0);
    });

    it("Should highlight all instances of text case sensitive", () => {
        const fix = TestBed.createComponent(HighlightLoremIpsumComponent);
        fix.detectChanges();

        const component: HighlightLoremIpsumComponent = fix.debugElement.componentInstance;
        let count = component.highlightText("Lorem", true);
        fix.detectChanges();
        let spans = fix.debugElement.nativeElement.querySelectorAll("." + component.highlightClass);
        expect(spans.length).toBe(1);
        expect(count).toBe(1);

        count = component.highlightText("quisque", true);
        fix.detectChanges();
        spans = fix.debugElement.nativeElement.querySelectorAll("." + component.highlightClass);
        expect(spans.length).toBe(0);
        expect(count).toBe(0);
    });

    it("Should clear all highlights", () => {
        const fix = TestBed.createComponent(HighlightLoremIpsumComponent);
        fix.detectChanges();

        const component: HighlightLoremIpsumComponent = fix.debugElement.componentInstance;
        const count = component.highlightText("a");
        fix.detectChanges();
        let spans = fix.debugElement.nativeElement.querySelectorAll("." + component.highlightClass);
        expect(spans.length).toBe(4);
        expect(count).toBe(4);

        component.clearHighlight();
        fix.detectChanges();
        spans = fix.debugElement.nativeElement.querySelectorAll("." + component.highlightClass);
        expect(spans.length).toBe(0);
    });

    it("Should keep the text content of the DIV intact", () => {
        const fix = TestBed.createComponent(HighlightLoremIpsumComponent);
        fix.detectChanges();

        const component: HighlightLoremIpsumComponent = fix.debugElement.componentInstance;
        const originalTextContent = component.textContent;

        component.highlightText("Lorem");
        fix.detectChanges();
        const loremText = component.textContent;
        expect(loremText).toBe(originalTextContent);

        component.clearHighlight();
        fix.detectChanges();
        const clearedText = component.textContent;
        expect(clearedText).toBe(originalTextContent);
    });

    it("Should activate the correct span", () => {
        const fix = TestBed.createComponent(HighlightLoremIpsumComponent);
        fix.detectChanges();

        const component: HighlightLoremIpsumComponent = fix.debugElement.componentInstance;
        component.highlightText("a");
        component.activate(0);
        fix.detectChanges();

        let spans = fix.debugElement.nativeElement.querySelectorAll("." + component.highlightClass);
        let activeSpan = fix.debugElement.nativeElement.querySelector("." + component.activeHighlightClass);

        expect(activeSpan).toBe(spans[0]);

        component.activate(1);
        fix.detectChanges();

        spans = fix.debugElement.nativeElement.querySelectorAll("." + component.highlightClass);
        activeSpan = fix.debugElement.nativeElement.querySelector("." + component.activeHighlightClass);

        expect(activeSpan).toBe(spans[1]);

        const allActiveSpans = fix.debugElement.nativeElement.querySelectorAll("." + component.activeHighlightClass);
        expect(allActiveSpans.length).toBe(1);

        spans = fix.debugElement.nativeElement.querySelectorAll("." + component.highlightClass);
        activeSpan = fix.debugElement.nativeElement.querySelector("." + component.activeHighlightClass);

        component.clearHighlight();
        activeSpan = fix.debugElement.nativeElement.querySelector("." + component.activeHighlightClass);

        expect(activeSpan).toBeNull();
    });

    it("Should properly handle null and undefined searches", () => {
        const fix = TestBed.createComponent(HighlightLoremIpsumComponent);
        fix.detectChanges();

        const component: HighlightLoremIpsumComponent = fix.debugElement.componentInstance;
        component.highlightText("a");
        fix.detectChanges();

        let count = component.highlightText(null);
        fix.detectChanges();

        let spans = fix.debugElement.nativeElement.querySelectorAll("." + component.highlightClass);
        expect(spans.length).toBe(0);
        expect(count).toBe(0);

        component.highlightText("a");
        fix.detectChanges();

        count = component.highlightText(undefined);
        fix.detectChanges();

        spans = fix.debugElement.nativeElement.querySelectorAll("." + component.highlightClass);
        expect(spans.length).toBe(0);
        expect(count).toBe(0);

        component.highlightText("a");
        fix.detectChanges();

        count = component.highlightText("");
        fix.detectChanges();

        spans = fix.debugElement.nativeElement.querySelectorAll("." + component.highlightClass);
        expect(spans.length).toBe(0);
        expect(count).toBe(0);
    });

    it("Should properly handle value changes", () => {
        const fix = TestBed.createComponent(HighlightLoremIpsumComponent);
        fix.detectChanges();

        const component: HighlightLoremIpsumComponent = fix.debugElement.componentInstance;
        component.highlightText("a");
        component.html = "zzzzzzzzz";
        fix.detectChanges();

        const spans = fix.debugElement.nativeElement.querySelectorAll("." + component.highlightClass);
        expect(spans.length).toBe(0);
    });

    it("Should properly handle value changes - case sensitive", () => {
        const fix = TestBed.createComponent(HighlightLoremIpsumComponent);
        fix.detectChanges();

        const component: HighlightLoremIpsumComponent = fix.debugElement.componentInstance;
        component.highlightText("a", true);
        component.html = "AAAAAAAAAA";
        fix.detectChanges();

        const spans = fix.debugElement.nativeElement.querySelectorAll("." + component.highlightClass);
        expect(spans.length).toBe(0);
    });
});

@Component({
    template:
        // tslint:disable-next-line:max-line-length
        `<div igxTextHighlight [cssClass]="highlightClass" [activeCssClass]="activeHighlightClass" [groupName]="groupName" [value]="html" [column]="0" [row]="0" [page]="0">
            {{html}}
        </div>`
})
class HighlightLoremIpsumComponent {
    public highlightClass = "igx-highlight";
    public activeHighlightClass = "igx-highlight__active";
    public groupName = "test";

    // tslint:disable-next-line:max-line-length
    public html = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vulputate luctus dui ut maximus. Quisque sed suscipit lorem. Vestibulum sit.";

    @ViewChild(forwardRef(() => IgxTextHighlightDirective), { read: IgxTextHighlightDirective })
    public highlight: IgxTextHighlightDirective;

    constructor(private element: ElementRef) {}

    public highlightText(text: string, caseSensitive?: boolean) {
        return this.highlight.highlight(text, caseSensitive);
    }

    public clearHighlight() {
        this.highlight.clearHighlight();
    }

    public get textContent(): string {
        return this.highlight.parentElement.innerText;
    }

    public activate(index: number) {
        IgxTextHighlightDirective.setActiveHighlight(this.groupName, 0, 0, index, 0);
    }
}
