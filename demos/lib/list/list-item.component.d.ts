import { ElementRef, Renderer2 } from "@angular/core";
import { IgxListPanState, IListChild } from "./list.common";
import { IgxListComponent } from "./list.component";
export declare class IgxListItemComponent implements IListChild {
    list: IgxListComponent;
    private elementRef;
    private _renderer;
    private _panState;
    private _FRACTION_OF_WIDTH_TO_TRIGGER_GRIP;
    private _currentLeft;
    constructor(list: IgxListComponent, elementRef: ElementRef, _renderer: Renderer2);
    isHeader: boolean;
    hidden: boolean;
    readonly role: string;
    ariaLabel: string;
    touchAction: string;
    readonly headerStyle: boolean;
    readonly innerStyle: boolean;
    readonly display: string;
    clicked(evt: any): void;
    panStart(ev: any): void;
    panMove(ev: any): void;
    panEnd(ev: any): void;
    readonly panState: IgxListPanState;
    readonly index: number;
    readonly element: any;
    readonly width: any;
    readonly maxLeft: number;
    readonly maxRight: any;
    private left;
    private performMagneticGrip();
    private isTrue(value);
}
