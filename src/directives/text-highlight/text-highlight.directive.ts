import {
    AfterViewInit,
    Directive,
    ElementRef,
    EventEmitter,
    Input,
    NgModule,
    OnChanges,
    OnDestroy,
    Output,
    Renderer2,
    SimpleChanges
} from "@angular/core";

interface ISearchInfo {
    searchedText: string;
    content: string;
    matchCount: number;
    caseSensitive: boolean;
}

export interface IActiveHighlightInfo {
    rowIndex: number;
    columnIndex: number;
    page: number;
    index: number;
}

@Directive({
    selector: "[igxTextHighlight]"
})
export class IgxTextHighlightDirective implements AfterViewInit, OnDestroy, OnChanges {
    private static onActiveElementChanged = new EventEmitter<string>();
    public static highlightGroupsMap = new Map<string, IActiveHighlightInfo>();

    private _lastSearchInfo: ISearchInfo;
    private _addedElements = [];
    private _observer: MutationObserver;
    private _nodeWasRemoved = false;
    private _forceEvaluation = false;
    private _activeElementIndex = -1;

    @Input("cssClass")
    public cssClass: string;

    @Input("activeCssClass")
    public activeCssClass: string;

    @Input("groupName")
    public groupName = "";

    @Input("value")
    public value: any = "";

    @Input("row")
    public row: number;

    @Input("column")
    public column: number;

    @Input("page")
    public page: number;

    public parentElement: any;

    private container: any;

    public static setActiveHighlight(groupName: string, column: number, row: number, index: number, page: number) {
        const group = IgxTextHighlightDirective.highlightGroupsMap.get(groupName);

        group.columnIndex = column;
        group.rowIndex = row;
        group.index = index;
        group.page = page;

        IgxTextHighlightDirective.onActiveElementChanged.emit(groupName);
    }

    constructor(element: ElementRef, public renderer: Renderer2) {
        this.parentElement = this.renderer.parentNode(element.nativeElement);

        const callback = (mutationList) => {
            mutationList.forEach((mutation) => {
                mutation.removedNodes.forEach((n) => {
                    if (n === this.container) {
                        this._nodeWasRemoved = true;
                        this.clearChildElements(false);
                    }
                });

                mutation.addedNodes.forEach((n) => {
                    if (n === this.parentElement.firstElementChild && this._nodeWasRemoved) {
                        this.container = this.parentElement.firstElementChild;
                        this._nodeWasRemoved = false;

                        this._forceEvaluation = true;
                        this.highlight(this._lastSearchInfo.searchedText, this._lastSearchInfo.caseSensitive);
                        this._forceEvaluation = false;

                        this.activateIfNecessary();
                    }
                });
            });
        };

        this._observer = new MutationObserver(callback);
        this._observer.observe(this.parentElement, {childList: true});

        IgxTextHighlightDirective.onActiveElementChanged.subscribe((groupName) => {
            if (this.groupName === groupName) {
                if (this._activeElementIndex !== -1) {
                    this.deactivate();
                }
                this.activateIfNecessary();
            }
        });
    }

    ngOnDestroy() {
        this._observer.disconnect();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.value && !changes.value.firstChange) {
            this.highlight(this._lastSearchInfo.searchedText, this._lastSearchInfo.caseSensitive);
            this.activateIfNecessary();
        }

        if ((changes.row !== undefined && !changes.row.firstChange) ||
            (changes.column !== undefined && !changes.column.firstChange) ||
            (changes.page !== undefined && !changes.page.firstChange)) {
            if (this._activeElementIndex !== -1) {
                this.deactivate();
            }

            this.activateIfNecessary();
        }
    }

    ngAfterViewInit() {
        if (IgxTextHighlightDirective.highlightGroupsMap.has(this.groupName) === false) {
            IgxTextHighlightDirective.highlightGroupsMap.set(this.groupName, {
                rowIndex: -1,
                columnIndex: -1,
                page: -1,
                index: -1
            });
        }

        this._lastSearchInfo = {
            searchedText: "",
            content: this.value,
            matchCount: 0,
            caseSensitive: false
        };

        this.container = this.parentElement.firstElementChild;
    }

    public highlight(text: string, caseSensitive?: boolean): number {
        const caseSensitiveResolved = caseSensitive ? true : false;

        if (this.searchNeedsEvaluation(text, caseSensitiveResolved)) {
            this._lastSearchInfo.searchedText = text;
            this._lastSearchInfo.caseSensitive = caseSensitiveResolved;
            this._lastSearchInfo.content = this.value;

            if (text === "" || text === undefined || text === null) {
                this.clearHighlight();
            } else {
                this.clearChildElements(true);
                this._lastSearchInfo.matchCount = this.getHighlightedText(text, caseSensitive);
            }
        }

        return this._lastSearchInfo.matchCount;
    }

    public clearHighlight(): void {
        this.clearChildElements(false);

        this._lastSearchInfo.searchedText = "";
        this._lastSearchInfo.matchCount = 0;
    }

    public activateIfNecessary(): void {
        const group = IgxTextHighlightDirective.highlightGroupsMap.get(this.groupName);
        if (group.columnIndex === this.column && group.rowIndex === this.row && group.page === this.page) {
            this.activate(group.index);
        }
    }

    private activate(index: number) {
        this.deactivate();

        const spans = this._addedElements.filter((el) => el.nodeName === "SPAN");
        this._activeElementIndex = index;

        if (spans.length <= index) {
            return;
        }

        const elementToActivate = spans[index];
        this.renderer.addClass(elementToActivate, this.activeCssClass);
        this.renderer.setAttribute(elementToActivate, "style", "background:orange;font-weight:bold");
    }

    private deactivate() {
        if (this._activeElementIndex === -1) {
            return;
        }

        const spans = this._addedElements.filter((el) => el.nodeName === "SPAN");

        if (spans.length <= this._activeElementIndex) {
            this._activeElementIndex = -1;
            return;
        }

        const elementToDeactivate = spans[this._activeElementIndex];
        this.renderer.removeClass(elementToDeactivate, this.activeCssClass);
        this.renderer.setAttribute(elementToDeactivate, "style", "background:yellow;font-weight:bold");
        this._activeElementIndex = -1;
    }

    private clearChildElements(originalContentHidden: boolean): void {
        if (this.parentElement.firstElementChild) {
            this.renderer.setProperty(this.parentElement.firstElementChild, "hidden", originalContentHidden);
        }

        while (this._addedElements.length) {
            const el = this._addedElements.pop();

            this.renderer.removeChild(this.parentElement, el);
        }

        this._activeElementIndex = -1;
    }

    private getHighlightedText(searchText: string, caseSensitive: boolean) {
        const stringValue = String(this.value);
        const contentStringResolved = !caseSensitive ? stringValue.toLowerCase() : stringValue;
        const searchTextResolved = !caseSensitive ? searchText.toLowerCase() : searchText;

        let foundIndex = contentStringResolved.indexOf(searchTextResolved, 0);
        let previousMatchEnd = 0;
        let matchCount = 0;

        while (foundIndex !== -1) {
            const start = foundIndex;
            const end = foundIndex + searchTextResolved.length;

            this.appendText(stringValue.substring(previousMatchEnd, start));
            // tslint:disable-next-line:max-line-length
            this.appendSpan(`<span class="${this.cssClass}" style="background:yellow;font-weight:bold">${stringValue.substring(start, end)}</span>`);

            previousMatchEnd = end;
            matchCount++;

            foundIndex = contentStringResolved.indexOf(searchTextResolved, end);
        }

        this.appendText(stringValue.substring(previousMatchEnd, stringValue.length));

        return matchCount;
    }

    private appendText(text: string) {
        const textElement = this.renderer.createText(text);
        this.renderer.appendChild(this.parentElement, textElement);
        this._addedElements.push(textElement);
    }

    private appendSpan(outerHTML: string) {
        const span = this.renderer.createElement("span");
        this.renderer.appendChild(this.parentElement, span);
        this.renderer.setProperty(span, "outerHTML", outerHTML);

        const childNodes = this.parentElement.childNodes;
        this._addedElements.push(childNodes[childNodes.length - 1]);
    }

    private searchNeedsEvaluation(text: string, caseSensitive: boolean): boolean {
        const searchedText = this._lastSearchInfo.searchedText;

        return !this._nodeWasRemoved &&
                (searchedText === null ||
                searchedText !== text ||
                this._lastSearchInfo.content !== this.value ||
                this._lastSearchInfo.caseSensitive !== caseSensitive ||
                this._forceEvaluation);
    }
}

@NgModule({
    declarations: [IgxTextHighlightDirective],
    exports: [IgxTextHighlightDirective]
})
export class IgxTextHighlightModule { }
