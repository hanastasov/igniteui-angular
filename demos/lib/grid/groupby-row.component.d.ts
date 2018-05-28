import { ChangeDetectorRef, ElementRef } from "@angular/core";
import { IgxSelectionAPIService } from "../core/selection";
import { IGroupByRecord } from "../data-operations/groupby-record.interface";
import { IgxGridAPIService } from "./api.service";
import { IgxGridComponent } from "./grid.component";
export declare class IgxGridGroupByRowComponent {
    gridAPI: IgxGridAPIService;
    private selectionAPI;
    element: ElementRef;
    cdr: ChangeDetectorRef;
    constructor(gridAPI: IgxGridAPIService, selectionAPI: IgxSelectionAPIService, element: ElementRef, cdr: ChangeDetectorRef);
    protected defaultCssClass: string;
    protected isFocused: boolean;
    readonly focused: boolean;
    index: number;
    gridID: string;
    groupRow: IGroupByRecord;
    groupContent: ElementRef;
    readonly expanded: boolean;
    tabindex: number;
    readonly describedBy: string;
    readonly padding: string;
    readonly styleClasses: string;
    toggle(): void;
    readonly grid: IgxGridComponent;
    onKeydownArrowDown(event: any): void;
    onKeydownArrowUp(event: any): void;
    onFocus(): void;
    onBlur(): void;
    private _getSelectedColIndex();
    private _getPrevSelectedColIndex();
}
